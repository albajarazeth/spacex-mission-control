"use client";

import { useEffect, useState } from "react";
import { getAllLaunches } from "@/services/service";
import { Launch } from "@/types";
import { formatLaunchCardDate } from "@/utils/dateFormatter";
import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
import Filters, { FilterState } from "../dashboard/Filters";
import LaunchDetailsModal from "@/app/components/LaunchDetailsModal";
import { useTheme } from "../ThemeContext";
import LaunchCardSkeleton from "@/app/components/LaunchCardSkeleton";
import { motion } from "framer-motion";

const rocketNames: Record<string, string> = {
  "5e9d0d95eda69955f709d1eb": "Falcon 1",
  "5e9d0d95eda69973a809d1ec": "Falcon 9",
  "5e9d0d95eda69974db09d1ed": "Falcon Heavy",
  "5e9d0d96eda699382d09d1ee": "Starship",
};

const LaunchesPage = () => {
  const { theme } = useTheme();
  const cls = (light: string, dark: string) => theme === "dark" ? dark : light;
  
  const [allLaunches, setAllLaunches] = useState<Launch[]>([]);
  const [filteredByFilters, setFilteredByFilters] = useState<Launch[]>([]);
  const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    success: "all",
    dateFrom: "",
    dateTo: "",
    rocket: "all",
    hasVideo: "all",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allData = await getAllLaunches();
        const launchesArray = Array.isArray(allData) 
          ? allData 
          : ((allData as any)?.docs && Array.isArray((allData as any).docs) ? (allData as any).docs : []);
        setAllLaunches(launchesArray);
        setFilteredByFilters(launchesArray);
      } catch {
        setAllLaunches([]);
        setFilteredByFilters([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLaunches(filteredByFilters);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = filteredByFilters.filter((launch) => {
      const nameMatch = launch.name?.toLowerCase().includes(query);
      const detailsMatch = launch.details?.toLowerCase().includes(query);
      return nameMatch || detailsMatch;
    });

    setFilteredLaunches(filtered);
    setCurrentPage(1);
  }, [searchQuery, filteredByFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLaunches.length]);

  const totalPages = Math.ceil(filteredLaunches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLaunches = filteredLaunches.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const applyFiltersToLaunches = (filters: FilterState, launches: Launch[]): Launch[] => {
    let filtered = [...launches];

    if (filters.success !== "all") {
      filtered = filtered.filter((launch) => {
        if (launch.upcoming === true) return false;
        
        if (filters.success === "successful") {
          return launch.success === true;
        } else if (filters.success === "failed") {
          return launch.success === false;
        }
        return true;
      });
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((launch) => {
        if (!launch.date_utc) return false;
        return new Date(launch.date_utc) >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((launch) => {
        if (!launch.date_utc) return false;
        return new Date(launch.date_utc) <= toDate;
      });
    }

    if (filters.rocket !== "all") {
      filtered = filtered.filter((launch) => launch.rocket === filters.rocket);
    }

    if (filters.hasVideo !== "all") {
      filtered = filtered.filter((launch) => {
        const hasVideo = !!(launch.links?.youtube_id || launch.links?.webcast);
        return filters.hasVideo === "yes" ? hasVideo : !hasVideo;
      });
    }

    return filtered;
  };

  useEffect(() => {
    const filtered = applyFiltersToLaunches(appliedFilters, allLaunches);
    setFilteredByFilters(filtered);
    setCurrentPage(1);
  }, [appliedFilters, allLaunches]);

  const handleFilterSave = (filters: FilterState) => {
    setAppliedFilters(filters);
  };

  return (
    <div id="main-content" className="min-h-screen p-4 sm:p-6 ml-0 sm:ml-24">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`text-3xl font-bold mb-6 text-center ${cls("text-gray-800", "text-white")}`}
        >
          All Launches
        </motion.h1>

        <div className="mb-6">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${cls("text-gray-400", "text-gray-500")}`} />
              <input
                type="text"
                placeholder="Search launches by name or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${cls("border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400", "border-[#A78BFA]/30 bg-[#7C3AED]/30 text-white placeholder:text-gray-400")} rounded-lg focus:outline-none focus:ring-2 ${cls("focus:ring-blue-500", "focus:ring-[#A78BFA]/50")}`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 ${cls("border border-gray-300 bg-white hover:bg-gray-50", "border-[#A78BFA]/30 bg-[#7C3AED]/30 hover:bg-[#7C3AED]/40")} rounded-lg cursor-pointer transition-colors`}
              aria-label="Toggle filters"
            >
              <FaFilter className={cls("text-gray-600", "text-gray-300")} />
            </button>
          </div>
        </div>

        <Filters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          launches={allLaunches}
          initialFilters={appliedFilters}
          onSave={handleFilterSave}
        />

        <div className={`mb-4 ${cls("text-gray-600", "text-gray-300")}`}>
          {isLoading ? (
            <p>Loading launches...</p>
          ) : (
            <p>
              {filteredLaunches.length === 0
                ? "No launches found"
                : `Showing ${filteredLaunches.length} launch${filteredLaunches.length !== 1 ? "es" : ""}`}
            </p>
          )}
        </div>

        {isLoading ? (
          <LaunchCardSkeleton count={18} theme={theme} />
        ) : filteredLaunches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {paginatedLaunches.map((launch, index) => (
                <motion.div
                  key={launch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                  className={`${cls("bg-white border border-gray-300", "bg-[#7C3AED]/30 border-[#A78BFA]/30")} rounded-xl p-4 ${cls("hover:shadow-lg", "hover:shadow-xl")} cursor-pointer focus:outline-none focus:ring-2 ${cls("focus:ring-blue-500", "focus:ring-[#A78BFA]")} focus:ring-offset-2`}
                >
                  <h2 className={`text-lg font-semibold mb-2 ${cls("text-gray-800", "text-white")}`}>
                    {launch.name}
                  </h2>
                  <p className={`text-sm ${cls("text-gray-600", "text-gray-300")} mb-2`}>
                    {formatLaunchCardDate(launch.date_utc, launch.date_precision)}
                  </p>
                  {launch.rocket && (
                    <p className={`text-sm ${cls("text-gray-500", "text-gray-400")} mb-2`}>
                      <span className="font-medium">Rocket: </span>
                      {rocketNames[launch.rocket] || launch.rocket}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {launch.success === true && (
                      <span className={`px-2 py-1 ${cls("bg-green-100 text-green-800", "bg-green-900/40 text-green-300")} rounded text-xs font-medium`}>
                        Successful
                      </span>
                    )}
                    {launch.success === false && (
                      <span className={`px-2 py-1 ${cls("bg-red-100 text-red-800", "bg-red-900/40 text-red-300")} rounded text-xs font-medium`}>
                        Failed
                      </span>
                    )}
                    {launch.upcoming && (
                      <span className={`px-2 py-1 ${cls("bg-blue-100 text-blue-800", "bg-white/20 text-white")} rounded text-xs font-medium`}>
                        Upcoming
                      </span>
                    )}
                  </div>
                  {launch.details && (
                    <p className={`text-xs ${cls("text-gray-500", "text-gray-400")} mt-2 line-clamp-2`}>
                      {launch.details}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentPage === 1
                      ? `${cls("bg-gray-100 text-gray-400", "bg-[#7C3AED]/20 text-gray-500")} cursor-not-allowed`
                      : `${cls("bg-white text-gray-700 hover:bg-gray-50 border-gray-300", "bg-[#7C3AED]/30 text-white hover:bg-[#7C3AED]/40 border-[#A78BFA]/30")} cursor-pointer`
                  }`}
                  aria-label="Previous page"
                >
                  <FaChevronLeft />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg border text-sm cursor-pointer ${
                            currentPage === page
                              ? cls("bg-blue-600 text-white border-blue-600", "bg-[#A78BFA] text-white border-[#A78BFA]")
                              : cls("bg-white text-gray-700 hover:bg-gray-50 border-gray-300", "bg-[#7C3AED]/30 text-white hover:bg-[#7C3AED]/40 border-[#A78BFA]/30")
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className={cls("px-2 text-gray-400", "px-2 text-gray-500")}>
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${
                    currentPage === totalPages
                      ? `${cls("bg-gray-100 text-gray-400", "bg-[#7C3AED]/20 text-gray-500")} cursor-not-allowed`
                      : `${cls("bg-white text-gray-700 hover:bg-gray-50 border-gray-300", "bg-[#7C3AED]/30 text-white hover:bg-[#7C3AED]/40 border-[#A78BFA]/30")} cursor-pointer`
                  }`}
                  aria-label="Next page"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            {filteredLaunches.length > 0 && (
              <div className={`text-sm ${cls("text-gray-600", "text-gray-300")} text-center mt-4`}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredLaunches.length)} of{" "}
                {filteredLaunches.length} launches
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className={cls("text-gray-500", "text-gray-400")}>No launches match your search or filters.</p>
          </div>
        )}
      </div>
      <LaunchDetailsModal 
        launch={selectedLaunch} 
        onClose={() => setSelectedLaunch(null)} 
      />
    </div>
  );
};

export default LaunchesPage;

