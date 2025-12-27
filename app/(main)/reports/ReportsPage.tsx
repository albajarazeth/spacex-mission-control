"use client";

import { useEffect, useState } from "react";
import { getAllLaunches } from "@/services/service";
import { Launch, DashboardMetrics } from "@/types";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";
import { FaDownload, FaChartLine, FaChartPie } from "react-icons/fa";
import OverTimeChart from "../dashboard/OverTimeChart";
import MostUsedRocketsChart from "../dashboard/MostUsedRocketsChart";
import LoadingCircle from "@/app/components/LoadingCircle";
import { generateAnalyticsPdf } from "@/utils/pdfGenerator";

const ReportsPage = () => {
  const { theme } = useTheme();
  const cls = (light: string, dark: string) => theme === "dark" ? dark : light;

  const [allLaunches, setAllLaunches] = useState<Launch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const metrics = useDashboardMetrics(allLaunches);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allData = await getAllLaunches();
        const launchesArray = Array.isArray(allData)
          ? allData
          : ((allData as any)?.docs && Array.isArray((allData as any).docs)
              ? (allData as any).docs
              : []);
        setAllLaunches(launchesArray);
      } catch {
        setAllLaunches([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadPdf = async () => {
    if (!metrics || allLaunches.length === 0) {
      return;
    }

    setIsGeneratingPdf(true);
    setPdfError(null);

    try {
      await generateAnalyticsPdf({
        metrics,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setPdfError(errorMessage);
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="main-content" className="min-h-screen p-6 ml-0 sm:ml-20 lg:ml-20">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`text-3xl font-bold mb-6 text-center ${cls("text-gray-800", "text-white")}`}
        >
          Analytics Reports
        </motion.h1>

        <div className="mb-6 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPdf}
            disabled={isLoading || isGeneratingPdf || !metrics || allLaunches.length === 0}
            className={`flex items-center gap-3 px-6 py-3 ${cls(
              "bg-[#6366F1] hover:bg-[#4F46E5] text-white",
              "bg-[#A78BFA] hover:bg-[#8B5CF6] text-white"
            )} rounded-xl font-semibold transition-all duration-200 ${cls(
              "shadow-lg hover:shadow-xl",
              "shadow-lg hover:shadow-xl"
            )} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          >
            <FaDownload className="text-lg" />
            <span>{isGeneratingPdf ? "Generating PDF..." : "Download PDF Report"}</span>
          </motion.button>
          
          {pdfError && (
            <div className={`${cls("bg-red-50 border border-red-200", "bg-red-900/20 border-red-800/30")} rounded-xl p-4`}>
              <p className={`text-sm ${cls("text-red-800", "text-red-300")} font-medium mb-2`}>
                PDF Generation Error
              </p>
              <p className={`text-xs ${cls("text-red-600", "text-red-400")}`}>
                  {pdfError.includes('Cannot find module') || pdfError.includes('not installed') ? (
                  <>
                    Please install the required package:
                    <code className="block mt-2 px-2 py-1 bg-black/10 rounded text-xs">
                      npm install jspdf
                    </code>
                  </>
                ) : (
                  pdfError
                )}
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingCircle showText={true} />
          </div>
        ) : (
          <div className="space-y-6">
            <div
              className={`${cls("bg-white", "bg-[#7C3AED]/30")} rounded-3xl p-6 border ${cls(
                "border-black/6",
                "border-[#A78BFA]/30"
              )} shadow-sm`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide flex items-center gap-2`}
              >
                <FaChartPie className={cls("text-[#6366F1]", "text-[#C4B5FD]")} />
                Summary Metrics
              </h2>
              {metrics ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    className={`${cls("bg-[#FEFCFB]", "bg-[#7C3AED]/40")} rounded-2xl p-4 border ${cls(
                      "border-black/6",
                      "border-[#A78BFA]/30"
                    )}`}
                  >
                    <p className={`text-sm ${cls("text-gray-600", "text-gray-300")} mb-1`}>
                      Total Launches
                    </p>
                    <p className={`text-2xl font-bold ${cls("text-[#1F2937]", "text-white")}`}>
                      {metrics.totalLaunches}
                    </p>
                  </div>
                  <div
                    className={`${cls("bg-[#FEFCFB]", "bg-[#7C3AED]/40")} rounded-2xl p-4 border ${cls(
                      "border-black/6",
                      "border-[#A78BFA]/30"
                    )}`}
                  >
                    <p className={`text-sm ${cls("text-gray-600", "text-gray-300")} mb-1`}>
                      Success Rate
                    </p>
                    <p className={`text-2xl font-bold ${cls("text-[#1F2937]", "text-white")}`}>
                      {metrics.successRate}%
                    </p>
                  </div>
                  <div
                    className={`${cls("bg-[#FEFCFB]", "bg-[#7C3AED]/40")} rounded-2xl p-4 border ${cls(
                      "border-black/6",
                      "border-[#A78BFA]/30"
                    )}`}
                  >
                    <p className={`text-sm ${cls("text-gray-600", "text-gray-300")} mb-1`}>
                      Upcoming
                    </p>
                    <p className={`text-2xl font-bold ${cls("text-[#1F2937]", "text-white")}`}>
                      {metrics.upcomingLaunches}
                    </p>
                  </div>
                  <div
                    className={`${cls("bg-[#FEFCFB]", "bg-[#7C3AED]/40")} rounded-2xl p-4 border ${cls(
                      "border-black/6",
                      "border-[#A78BFA]/30"
                    )}`}
                  >
                    <p className={`text-sm ${cls("text-gray-600", "text-gray-300")} mb-1`}>
                      Most Used Rocket
                    </p>
                    <p className={`text-2xl font-bold ${cls("text-[#1F2937]", "text-white")}`}>
                      {metrics.mostUsedRocket?.name || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className={cls("text-gray-500", "text-gray-400")}>No metrics available</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`${cls("bg-white", "bg-[#7C3AED]/30")} rounded-3xl p-6 border ${cls(
                  "border-black/6",
                  "border-[#A78BFA]/30"
                )} shadow-sm`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide flex items-center gap-2`}
                >
                  <FaChartPie className={cls("text-[#6366F1]", "text-[#C4B5FD]")} />
                  Most Used Rocket
                </h2>
                <div className="h-[280px] flex items-center justify-center">
                  {allLaunches.length === 0 ? (
                    <LoadingCircle />
                  ) : (
                    <MostUsedRocketsChart launches={allLaunches} />
                  )}
                </div>
              </div>

              <div
                className={`${cls("bg-white", "bg-[#7C3AED]/30")} rounded-3xl p-6 border ${cls(
                  "border-black/6",
                  "border-[#A78BFA]/30"
                )} shadow-sm`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide flex items-center gap-2`}
                >
                  <FaChartLine className={cls("text-[#6366F1]", "text-[#C4B5FD]")} />
                  Success Rate Over Time
                </h2>
                <div className="h-[300px] flex items-center justify-center">
                  {allLaunches.length === 0 ? (
                    <LoadingCircle />
                  ) : (
                    <OverTimeChart launches={allLaunches} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;

