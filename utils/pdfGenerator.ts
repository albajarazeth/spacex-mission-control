import { DashboardMetrics } from '@/types';

interface PdfExportOptions {
  metrics: DashboardMetrics | null;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    rocket?: string;
    success?: string;
  };
}

export const generateAnalyticsPdf = async ({
  metrics,
  filters,
}: PdfExportOptions): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation requires browser environment');
  }

  let jsPDF: any;

  try {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.jsPDF || (jsPDFModule.default && jsPDFModule.default.jsPDF) || jsPDFModule.default || jsPDFModule;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(
      `PDF library not installed or failed to load: ${errorMessage}. Please run: npm install jspdf`
    );
  }

  if (!jsPDF) {
    throw new Error('PDF library not properly loaded. Please ensure jspdf is installed.');
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addTitle = (text: string, fontSize: number = 24) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, margin, yPosition);
    yPosition += 10;
  };

  const addSubtitle = (text: string, fontSize: number = 14) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(text, margin, yPosition);
    yPosition += 8;
    pdf.setTextColor(0, 0, 0);
  };

  const addText = (text: string, fontSize: number = 12) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 6;
  };

  const addMetric = (label: string, value: string | number) => {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    const valueX = margin + 60;
    pdf.text(String(value), valueX, yPosition);
    yPosition += 8;
  };

  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  addTitle('SpaceX Launch Analytics Report', 24);
  yPosition += 5;

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  addSubtitle(`Generated on ${timestamp}`, 10);
  yPosition += 10;

  if (filters && (filters.dateFrom || filters.dateTo || filters.rocket || filters.success)) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Applied Filters:', margin, yPosition);
    yPosition += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    if (filters.dateFrom) {
      pdf.text(`Date From: ${filters.dateFrom}`, margin + 5, yPosition);
      yPosition += 6;
    }
    if (filters.dateTo) {
      pdf.text(`Date To: ${filters.dateTo}`, margin + 5, yPosition);
      yPosition += 6;
    }
    if (filters.rocket && filters.rocket !== 'all') {
      pdf.text(`Rocket: ${filters.rocket}`, margin + 5, yPosition);
      yPosition += 6;
    }
    if (filters.success && filters.success !== 'all') {
      pdf.text(`Success Status: ${filters.success}`, margin + 5, yPosition);
      yPosition += 6;
    }
    yPosition += 5;
  }

  checkPageBreak(40);

  addTitle('Summary Metrics', 18);
  yPosition += 5;

  if (metrics) {
    addMetric('Total Launches', metrics.totalLaunches);
    addMetric('Upcoming Launches', metrics.upcomingLaunches);
    addMetric('Success Rate', `${metrics.successRate}%`);
    
    if (metrics.mostUsedRocket) {
      addMetric(
        'Most Used Rocket',
        `${metrics.mostUsedRocket.name} (${metrics.mostUsedRocket.count} launches)`
      );
    } else {
      addMetric('Most Used Rocket', 'N/A');
    }

    const completedLaunches = metrics.totalLaunches - metrics.upcomingLaunches;
    const successfulLaunches = Math.round((metrics.successRate / 100) * completedLaunches);
    const failedLaunches = completedLaunches - successfulLaunches;

    yPosition += 5;
    addMetric('Successful Launches', successfulLaunches);
    addMetric('Failed Launches', failedLaunches);
  } else {
    addText('No metrics available', 12);
  }

  yPosition += 10;

  const filename = `spacex-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};

