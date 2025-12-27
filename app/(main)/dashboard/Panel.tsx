"use client";
import getLatestLaunches, { getAllLaunches, getUpcomingLaunches } from "@/services/service";
import { useEffect, useState } from "react";
import { FaRocket, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import OverTimeChart from "./OverTimeChart";
import MostUsedRocketsChart from "./MostUsedRocketsChart";
import UpcomingLaunches from "./UpcomingLaunches";
import { formatLaunchCardDate } from "@/utils/dateFormatter";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Launch } from "@/types";
import LaunchListSkeleton from "@/app/components/LaunchListSkeleton";
import LoadingCircle from "@/app/components/LoadingCircle";
import LaunchDetailsModal from "@/app/components/LaunchDetailsModal";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";


const Panel = () => {
  const { theme } = useTheme();
  
  const cls = (light: string, dark: string) => theme === "dark" ? dark : light;

  const [launchData, setLaunchData] = useState<Launch[]>([]);
  const [allLaunchesForMetrics, setAllLaunchesForMetrics] = useState<Launch[]>([]);
  const [upcomingLaunches, setUpcomingLaunches] = useState<Launch[]>([]);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const launchesPerPage = 8;
  const metrics = useDashboardMetrics(allLaunchesForMetrics);

  const sortedLaunches = [...launchData].sort((a, b) => {
    const dateA = new Date(a.date_utc).getTime();
    const dateB = new Date(b.date_utc).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedLaunches.length / launchesPerPage);
  const startIndex = (currentPage - 1) * launchesPerPage;
  const endIndex = startIndex + launchesPerPage;
  const visibleLaunches = sortedLaunches.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allLaunchesData = await getAllLaunches();
        const allLaunchesArray = Array.isArray(allLaunchesData) 
          ? allLaunchesData 
          : ((allLaunchesData as any)?.docs && Array.isArray((allLaunchesData as any).docs) ? (allLaunchesData as any).docs : []);
        
        setLaunchData(allLaunchesArray);
        setAllLaunchesForMetrics(allLaunchesArray);
        
        const upcomingData = await getUpcomingLaunches();
        const upcomingArray = Array.isArray(upcomingData) 
          ? upcomingData 
          : ((upcomingData as any)?.docs && Array.isArray((upcomingData as any).docs) ? (upcomingData as any).docs : []);
        setUpcomingLaunches(upcomingArray);
      } catch {
        setLaunchData([]);
        setAllLaunchesForMetrics([]);
        setUpcomingLaunches([]);
      }
    };
    fetchData();
  }, []);


  return (
    <>
    <div id="main-content" className="dashboard-container flex flex-col">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`text-center text-lg sm:text-xl md:text-2xl font-bold pt-3 sm:pt-5 tracking-tight ${theme === "dark" ? "text-white" : "text-[#1F2937]"}`}
      >
        SpaceX Mission Control Dashboard
      </motion.h1>
      <div className="dashboard-content flex flex-col lg:flex-row items-start justify-center gap-4 p-2 sm:p-4 ml-0 sm:ml-20 lg:ml-20"> 
        <div className="dashboard-timeline w-full sm:w-96 lg:w-80 flex flex-col gap-4 pt-4 pb-4 rounded-3xl">
          <div className="flex justify-between items-center w-full mb-2">
            <span className={`text-lg sm:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-[#1F2937]"} tracking-wide`}>Latest Launches</span>
          </div>
          {launchData.length === 0 ? (
            <LaunchListSkeleton items={10} />
          ) : (
            <div className="relative w-full timeline-container">
              <div className={`timeline-line absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#A78BFA] via-[#60A5FA] to-[#A78BFA] ${theme === "dark" ? "opacity-60" : "opacity-40"}`}></div>
              
              <div className="flex flex-col gap-6 pl-0">
                {visibleLaunches.map((launch, index) => (
                  <motion.div 
                    key={launch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.08,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    whileHover={{ x: 4 }}
                    className="relative flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="rocket-icon-container relative z-10 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full ${theme === "dark" ? "bg-[#7C3AED]/40 border-[#A78BFA]/50" : "bg-[#FEFCFB] border-[#A78BFA]/30"} border-2 flex items-center justify-center transition-all duration-250 ${theme === "dark" ? "group-hover:border-[#A78BFA]/80 group-hover:bg-[#7C3AED]/60" : "group-hover:border-[#A78BFA]/60 group-hover:bg-[#F8F5FF]"} group-hover:shadow-sm`}>
                        <FaRocket className={`${theme === "dark" ? "text-[#C4B5FD] group-hover:text-[#DDD6FE]" : "text-[#6366F1] group-hover:text-[#818CF8]"} text-sm transition-all duration-250 group-hover:scale-110`} />
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setSelectedLaunch(launch)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedLaunch(launch);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${launch.name}`}
                      className={`flex-1 ${theme === "dark" ? "bg-[#7C3AED]/30 border-[#A78BFA]/30 group-hover:bg-[#7C3AED]/40 group-hover:shadow-lg group-hover:border-[#A78BFA]/50" : "bg-[#FEFCFB]/80 border-black/6 group-hover:bg-[#FEFCFB] group-hover:shadow-md group-hover:border-[#A78BFA]/20"} backdrop-blur-sm border rounded-2xl p-4 transition-all duration-250 group-hover:-translate-y-0.5 min-w-0 cursor-pointer focus:outline-none focus:ring-2 ${cls("focus:ring-[#6366F1]", "focus:ring-[#A78BFA]")} focus:ring-offset-2`}
                    >
                      <h2 className={`${theme === "dark" ? "text-white" : "text-[#1F2937]"} font-semibold text-base mb-1.5`}>{launch.name}</h2>
                      <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-sm`}>{formatLaunchCardDate(launch.date_utc, launch.date_precision)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6 pl-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1.5 px-4 py-2 ${cls("bg-white/60", "bg-[#7C3AED]/40")} ${cls("hover:bg-white/80", "hover:bg-[#7C3AED]/50")} backdrop-blur-sm border ${cls("border-black/8", "border-[#A78BFA]/30")} rounded-full text-sm font-medium ${cls("text-[#1F2937]", "text-white")} transition-all duration-300 ease-out ${cls("hover:shadow-md", "hover:shadow-lg")} hover:-translate-y-0.5 ${cls("hover:border-[#A78BFA]/20", "hover:border-[#A78BFA]/50")} ${
                      currentPage === 1
                        ? `opacity-50 cursor-not-allowed ${cls("hover:bg-white/60", "hover:bg-[#7C3AED]/40")} hover:shadow-none hover:translate-y-0`
                        : "cursor-pointer"
                    }`}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft className={`text-xs ${cls("text-[#6E6E73]", "text-gray-300")}`} />
                    <span>Previous</span>
                  </button>
                  
                  <span className={`text-xs ${cls("text-[#6E6E73]", "text-gray-300")} font-medium px-2`}>
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1.5 px-4 py-2 ${cls("bg-white/60", "bg-[#7C3AED]/40")} ${cls("hover:bg-white/80", "hover:bg-[#7C3AED]/50")} backdrop-blur-sm border ${cls("border-black/8", "border-[#A78BFA]/30")} rounded-full text-sm font-medium ${cls("text-[#1F2937]", "text-white")} transition-all duration-300 ease-out ${cls("hover:shadow-md", "hover:shadow-lg")} hover:-translate-y-0.5 ${cls("hover:border-[#A78BFA]/20", "hover:border-[#A78BFA]/50")} ${
                      currentPage === totalPages
                        ? `opacity-50 cursor-not-allowed ${cls("hover:bg-white/60", "hover:bg-[#7C3AED]/40")} hover:shadow-none hover:translate-y-0`
                        : "cursor-pointer"
                    }`}
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <FaChevronRight className={`text-xs ${cls("text-[#6E6E73]", "text-gray-300")}`} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="analytics-container flex flex-col gap-4 w-full lg:max-w-4xl pt-4">
          <div className="top-stats grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`${cls("bg-white", "bg-[#7C3AED]/30")} rounded-3xl p-6 h-fit min-h-[120px] border ${cls("border-black/6", "border-[#A78BFA]/30")} shadow-sm transition-all duration-200 ${cls("hover:shadow-md", "hover:shadow-lg")} hover:-translate-y-0.5 relative group`}>
              <div className={`absolute top-4 right-4 w-10 h-10 rounded-full ${cls("bg-[#6366F1]/10", "bg-[#A78BFA]/20")} flex items-center justify-center transition-all duration-200 ${cls("group-hover:bg-[#6366F1]/20", "group-hover:bg-[#A78BFA]/30")} group-hover:scale-110`}>
                <FaRocket className={`${cls("text-[#6366F1]", "text-[#C4B5FD]")} text-lg opacity-70 group-hover:opacity-100 transition-opacity duration-200`} />
              </div>
              <h1 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>Total Rocket Launches</h1>
              <div className="h-16">
                {allLaunchesForMetrics.length === 0 ? (
                  <LoadingCircle showText={true} />
                ) : (
                  <p className={`text-3xl font-bold ${cls("text-[#1F2937]", "text-white")}`}>{metrics?.totalLaunches ?? 0}</p>
                )}
              </div>
            </div>

            <div className={`${cls("bg-white", "bg-[#7C3AED]/30")} rounded-3xl p-6 h-fit min-h-[120px] border ${cls("border-black/6", "border-[#A78BFA]/30")} shadow-sm transition-all duration-200 ${cls("hover:shadow-md", "hover:shadow-lg")} hover:-translate-y-0.5 relative group`}>
              <div className={`absolute top-4 right-4 w-10 h-10 rounded-full ${cls("bg-[#10B981]/10", "bg-[#A78BFA]/20")} flex items-center justify-center transition-all duration-200 ${cls("group-hover:bg-[#10B981]/20", "group-hover:bg-[#A78BFA]/30")} group-hover:scale-110`}>
                <FaCheckCircle className={`${cls("text-[#10B981]", "text-[#C4B5FD]")} text-lg opacity-70 group-hover:opacity-100 transition-opacity duration-200`} />
              </div>
              <h1 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>Success Rate</h1>
              <div className="h-16">
                {allLaunchesForMetrics.length === 0 ? (
                  <LoadingCircle showText={true} />
                ) : (
                  <p className={`text-3xl font-bold ${cls("text-[#1F2937]", "text-white")}`}>{metrics?.successRate ?? 0} <span className={cls("text-green-500", "text-[#34D399]")}>%</span></p>
                )}
              </div>
            </div>

            <div className={`${cls("bg-[#FEFCFB]", "bg-[#7C3AED]/30")} rounded-3xl p-6 h-fit flex flex-col border ${cls("border-black/6", "border-[#A78BFA]/30")} shadow-sm transition-all duration-200 ${cls("hover:shadow-md", "hover:shadow-lg")}`}>
              <UpcomingLaunches launches={upcomingLaunches} isLoading={upcomingLaunches.length === 0 && allLaunchesForMetrics.length === 0} />
            </div>

            <div className={`dashboard-chart ${cls("bg-white", "bg-[#7C3AED]/30")} rounded-3xl p-4 sm:p-6 h-fit min-h-[350px] border ${cls("border-black/6", "border-[#A78BFA]/30")} shadow-sm transition-all duration-200 ${cls("hover:shadow-md", "hover:shadow-lg")}`}>
              <h1 className={`text-lg sm:text-xl font-bold mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>Most Used Rocket</h1>
              <div className="h-[250px] sm:h-[280px] flex items-center justify-center">
                {allLaunchesForMetrics.length === 0 ? (
                  <LoadingCircle />
                ) : (
                  <MostUsedRocketsChart launches={allLaunchesForMetrics} />
                )}
              </div>
            </div>
          </div>

          <div className="bottom-stats"> 
          <div className={`dashboard-chart ${cls("bg-[#FEFCFB]", "bg-[#7C3AED]/30")} rounded-3xl p-4 sm:p-6 h-fit min-h-[300px] sm:min-h-[380px] border ${cls("border-black/6", "border-[#A78BFA]/30")} shadow-sm transition-all duration-200 ${cls("hover:shadow-md", "hover:shadow-lg")}`}>
              <h1 className={`text-lg sm:text-xl font-bold mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>Success Rate Over Time</h1>
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
                {allLaunchesForMetrics.length === 0 ? (
                  <LoadingCircle />
                ) : (
                  <OverTimeChart launches={allLaunchesForMetrics} />
                )}
              </div>
            </div>
          </div>
        </div>
          
        
      </div>
      <LaunchDetailsModal 
        launch={selectedLaunch} 
        onClose={() => setSelectedLaunch(null)} 
      />
    </div>
    </>
  )
};

export default Panel;