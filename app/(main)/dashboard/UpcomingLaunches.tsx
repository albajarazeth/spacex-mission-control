"use client";

import { Launch } from "@/types";
import { formatLaunchCardDate } from "@/utils/dateFormatter";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { useTheme } from "../ThemeContext";

interface UpcomingLaunchesProps {
  launches: Launch[];
  isLoading?: boolean;
}

const UpcomingLaunches = ({ launches, isLoading = false }: UpcomingLaunchesProps) => {
  const { theme } = useTheme();
  const cls = (light: string, dark: string) => theme === "dark" ? dark : light;
  
  if (isLoading) {
    return <SkeletonLoader rows={5} />;
  }

  const upcomingLaunches = launches
    .filter((launch) => {
      if (!launch.date_utc) return false;
      const launchDate = new Date(launch.date_utc);
      const year = launchDate.getFullYear();
      return year === 2022;
    })
    .sort((a, b) => new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime());

  return (
    <div className="flex flex-col h-full">
      <h1 className={`text-xl font-bold mb-4 ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>Upcoming Launches</h1>
      <div className="flex-1 overflow-y-auto max-h-[300px]">
        {upcomingLaunches.length > 0 ? (
          <table className="w-full text-sm">
            <thead className={`sticky top-0 ${cls("bg-[#FEFCFB]/95", "bg-[#7C3AED]/40")} backdrop-blur-sm z-10`}>
              <tr className={`border-b ${cls("border-black/6", "border-[#A78BFA]/30")}`}>
                <th className={`text-left py-3 px-3 font-bold ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>
                  Mission
                </th>
                <th className={`text-left py-3 px-3 font-bold ${cls("text-[#1F2937]", "text-white")} tracking-wide`}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {upcomingLaunches.map((launch) => (
                <tr
                  key={launch.id}
                  className={`border-b ${cls("border-black/4 hover:bg-white/60", "border-[#A78BFA]/20 hover:bg-[#7C3AED]/40")} transition-colors duration-150`}
                >
                  <td className={`py-3 px-3 ${cls("text-[#1F2937]", "text-white")}`}>
                    {launch.name}
                  </td>
                  <td className={`py-3 px-3 ${cls("text-gray-600", "text-gray-300")}`}>
                    {formatLaunchCardDate(launch.date_utc, launch.date_precision)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={`${cls("text-gray-500", "text-gray-400")} text-center py-4`}>
            No upcoming launches
          </p>
        )}
      </div>
    </div>
  );
};

export default UpcomingLaunches;