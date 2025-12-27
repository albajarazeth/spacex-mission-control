"use client";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { Launch } from "@/types";

interface OverTimeChartProps {
  launches: Launch[];
}

const OverTimeChart = ({ launches }: OverTimeChartProps) => {
  const yearStats: Record<string, { success: number; failure: number }> = {};

  launches.forEach((launch) => {
    if (launch.upcoming || launch.success === null || launch.success === undefined) {
      return;
    }

    if (!launch.date_utc) return;
    const year = new Date(launch.date_utc).getFullYear().toString();
    
    if (!yearStats[year]) {
      yearStats[year] = { success: 0, failure: 0 };
    }

    if (launch.success) {
      yearStats[year].success += 1;
    } else {
      yearStats[year].failure += 1;
    }
  });

  const launchStats = Object.entries(yearStats)
    .map(([year, stats]) => ({
      year,
      success: stats.success,
      failure: stats.failure,
    }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  if (launchStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No launch data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={launchStats}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.4} />

        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#D1D5DB"
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          stroke="#D1D5DB"
        />

        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            padding: '8px 12px'
          }}
        />

        <Line
          type="monotone"
          dataKey="success"
          stroke="#86EFAC"
          strokeWidth={2.5}
          dot={false}
          name="Successful"
        />

        <Line
          type="monotone"
          dataKey="failure"
          stroke="#FCA5A5"
          strokeWidth={2.5}
          dot={false}
          name="Failed"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OverTimeChart;
   