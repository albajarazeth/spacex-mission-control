"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Launch } from "@/types";
import { FaChevronDown, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { useTheme } from "../ThemeContext";

const rocketNames: Record<string, string> = {
  "5e9d0d95eda69955f709d1eb": "Falcon 1",
  "5e9d0d95eda69973a809d1ec": "Falcon 9",
  "5e9d0d95eda69974db09d1ed": "Falcon Heavy",
  "5e9d0d96eda699382d09d1ee": "Starship",
};

export interface FilterState {
  success: "all" | "successful" | "failed";
  dateFrom: string;
  dateTo: string;
  rocket: string;
  hasVideo: "all" | "yes" | "no";
}

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  launches: Launch[];
  initialFilters?: FilterState;
  onSave: (filters: FilterState) => void;
}

const Filters = ({ isOpen, onClose, launches, initialFilters, onSave }: FiltersProps) => {
  const { theme } = useTheme();
  const cls = (light: string, dark: string) => theme === "dark" ? dark : light;
  
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      success: "all",
      dateFrom: "",
      dateTo: "",
      rocket: "all",
      hasVideo: "all",
    }
  );

  useEffect(() => {
    if (isOpen && initialFilters) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const uniqueRockets = Array.from(
    new Set(launches.map((l) => l.rocket).filter(Boolean))
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(filters);
    onClose();
  };

  const handleCancel = () => {
    if (initialFilters) {
      setFilters(initialFilters);
    } else {
      setFilters({
        success: "all",
        dateFrom: "",
        dateTo: "",
        rocket: "all",
        hasVideo: "all",
      });
    }
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      success: "all",
      dateFrom: "",
      dateTo: "",
      rocket: "all",
      hasVideo: "all",
    });
  };

  const hasActiveFilters = 
    filters.success !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.rocket !== "all" ||
    filters.hasVideo !== "all";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={handleCancel}
            className={`fixed inset-0 ${cls("bg-black/20", "bg-black/40")} backdrop-blur-md z-50`}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-title"
          >
            <div 
              className={`relative ${cls("bg-[rgba(250,249,247,0.75)] border-white/30", "bg-[rgba(124,58,237,0.4)] border-[#A78BFA]/30")} backdrop-blur-2xl rounded-[20px] ${cls("shadow-[0_8px_32px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.5)_inset]", "shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(167,139,250,0.3)_inset]")} border max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
              }}
            >
              <div className={`flex items-center justify-between px-6 pt-6 pb-4 border-b ${cls("border-white/20", "border-[#A78BFA]/20")}`}>
                <h3 id="filters-title" className={`text-[17px] font-medium ${cls("text-[#1D1D1F]", "text-white")} tracking-[-0.01em]`}>
                  Filters
                </h3>
                <button
                  onClick={handleCancel}
                  className={`p-1.5 rounded-full ${cls("hover:bg-white/30", "hover:bg-[#A78BFA]/20")} transition-all duration-200 ease-out cursor-pointer`}
                  aria-label="Close"
                >
                  <FaTimes className={cls("text-[#6E6E73]", "text-gray-300")} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label htmlFor="success-filter" className={`block text-[13px] font-medium ${cls("text-[#6E6E73]", "text-gray-300")} tracking-[-0.01em]`}>
                      Success Status
                    </label>
                    <div className="relative">
                      <select
                        id="success-filter"
                        value={filters.success}
                        onChange={(e) =>
                          handleFilterChange("success", e.target.value as FilterState["success"])
                        }
                        className={`w-full h-[46px] pl-4 pr-12 ${cls("bg-white/70 text-[#1D1D1F]", "bg-[#7C3AED]/50 text-white")} backdrop-blur-sm rounded-[12px] border-0 ${cls("shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]", "shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]")} text-[15px] font-normal appearance-none cursor-pointer transition-all duration-300 ease-out ${cls("hover:bg-white/85 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]", "hover:bg-[#7C3AED]/60 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]")} focus:outline-none ${cls("focus:bg-white/95 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(0,122,255,0.08)]", "focus:bg-[#7C3AED]/70 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_0_0_3px_rgba(167,139,250,0.3)]")}`}
                      >
                        <option value="all">All Launches</option>
                        <option value="successful">Successful Only</option>
                        <option value="failed">Failed Only</option>
                      </select>
                      <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${cls("text-[#86868B]", "text-gray-300")} text-xs pointer-events-none`} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className={`block text-[13px] font-medium ${cls("text-[#6E6E73]", "text-gray-300")} tracking-[-0.01em]`}>
                      Date Range
                    </label>
                    <div className={`${cls("bg-white/70", "bg-[#7C3AED]/50")} backdrop-blur-sm rounded-[12px] ${cls("shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]", "shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]")} p-1.5 flex gap-2`}>
                      <div className="flex-1 relative">
                        <label htmlFor="date-from" className="sr-only">Date From</label>
                        <FaCalendarAlt className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${cls("text-[#86868B]", "text-gray-300")} text-xs pointer-events-none`} />
                        <input
                          id="date-from"
                          type="date"
                          value={filters.dateFrom}
                          aria-label="Date From"
                          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                          className={`w-full h-[42px] pl-10 pr-3 bg-transparent border-0 rounded-[10px] text-[15px] ${cls("text-[#1D1D1F]", "text-white")} font-normal focus:outline-none ${cls("focus:bg-white/50", "focus:bg-[#7C3AED]/60")} transition-all duration-300 ease-out cursor-pointer`}
                        />
                      </div>
                      <div className="flex-1 relative">
                        <label htmlFor="date-to" className="sr-only">Date To</label>
                        <FaCalendarAlt className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${cls("text-[#86868B]", "text-gray-300")} text-xs pointer-events-none`} />
                        <input
                          id="date-to"
                          type="date"
                          value={filters.dateTo}
                          aria-label="Date To"
                          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                          className={`w-full h-[42px] pl-10 pr-3 bg-transparent border-0 rounded-[10px] text-[15px] ${cls("text-[#1D1D1F]", "text-white")} font-normal focus:outline-none ${cls("focus:bg-white/50", "focus:bg-[#7C3AED]/60")} transition-all duration-300 ease-out cursor-pointer`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="rocket-filter" className={`block text-[13px] font-medium ${cls("text-[#6E6E73]", "text-gray-300")} tracking-[-0.01em]`}>
                      Rocket
                    </label>
                    <div className="relative">
                      <select
                        id="rocket-filter"
                        value={filters.rocket}
                        onChange={(e) => handleFilterChange("rocket", e.target.value)}
                        className={`w-full h-[46px] pl-4 pr-12 ${cls("bg-white/70 text-[#1D1D1F]", "bg-[#7C3AED]/50 text-white")} backdrop-blur-sm rounded-[12px] border-0 ${cls("shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]", "shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]")} text-[15px] font-normal appearance-none cursor-pointer transition-all duration-300 ease-out ${cls("hover:bg-white/85 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]", "hover:bg-[#7C3AED]/60 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]")} focus:outline-none ${cls("focus:bg-white/95 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(0,122,255,0.08)]", "focus:bg-[#7C3AED]/70 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_0_0_3px_rgba(167,139,250,0.3)]")}`}
                      >
                        <option value="all">All Rockets</option>
                        {uniqueRockets.map((rocketId) => (
                          <option key={rocketId} value={rocketId}>
                            {rocketId ? (rocketNames[rocketId] || rocketId) : "Unknown"}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${cls("text-[#86868B]", "text-gray-300")} text-xs pointer-events-none`} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="video-filter" className={`block text-[13px] font-medium ${cls("text-[#6E6E73]", "text-gray-300")} tracking-[-0.01em]`}>
                      Video Available
                    </label>
                    <div className="relative">
                      <select
                        id="video-filter"
                        value={filters.hasVideo}
                        onChange={(e) =>
                          handleFilterChange("hasVideo", e.target.value as FilterState["hasVideo"])
                        }
                        className={`w-full h-[46px] pl-4 pr-12 ${cls("bg-white/70 text-[#1D1D1F]", "bg-[#7C3AED]/50 text-white")} backdrop-blur-sm rounded-[12px] border-0 ${cls("shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]", "shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]")} text-[15px] font-normal appearance-none cursor-pointer transition-all duration-300 ease-out ${cls("hover:bg-white/85 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]", "hover:bg-[#7C3AED]/60 hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]")} focus:outline-none ${cls("focus:bg-white/95 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),0_0_0_3px_rgba(0,122,255,0.08)]", "focus:bg-[#7C3AED]/70 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_0_0_3px_rgba(167,139,250,0.3)]")}`}
                      >
                        <option value="all">All Launches</option>
                        <option value="yes">Has Video</option>
                        <option value="no">No Video</option>
                      </select>
                      <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${cls("text-[#86868B]", "text-gray-300")} text-xs pointer-events-none`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`sticky bottom-0 px-6 py-4 ${cls("bg-[rgba(250,249,247,0.95)] border-white/20", "bg-[rgba(124,58,237,0.6)] border-[#A78BFA]/20")} backdrop-blur-xl border-t flex items-center justify-end gap-3`}>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className={`text-[13px] font-normal ${cls("text-[#86868B] hover:text-[#1D1D1F]", "text-gray-300 hover:text-white")} transition-colors duration-300 ease-out px-3 py-1.5 cursor-pointer`}
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={handleCancel}
                  className={`text-[15px] font-normal ${cls("text-[#1D1D1F] hover:bg-white/40", "text-white hover:bg-[#A78BFA]/20")} transition-all duration-200 ease-out px-4 py-2 rounded-[10px] cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`text-[15px] font-medium ${cls("text-[#1D1D1F] bg-white/80 hover:bg-white/90", "text-white bg-[#7C3AED]/60 hover:bg-[#7C3AED]/70")} transition-all duration-200 ease-out px-5 py-2 rounded-[10px] ${cls("shadow-[0_1px_2px_rgba(0,0,0,0.08)]", "shadow-[0_1px_2px_rgba(0,0,0,0.2)]")} cursor-pointer`}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Filters;