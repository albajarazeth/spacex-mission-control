"use client";

interface LaunchCardSkeletonProps {
  count?: number;
  theme?: "light" | "dark";
}

const LaunchCardSkeleton = ({ count = 9, theme = "light" }: LaunchCardSkeletonProps) => {
  const cls = (light: string, dark: string) => theme === "dark" ? dark : light;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${cls("bg-white border border-gray-200", "bg-[#7C3AED]/20 border-[#A78BFA]/20")} rounded-xl p-4 animate-pulse`}
        >
          <div className={`h-6 ${cls("bg-gray-200", "bg-[#7C3AED]/40")} rounded mb-3 w-3/4`}></div>
          
          <div className={`h-4 ${cls("bg-gray-200", "bg-[#7C3AED]/30")} rounded mb-2 w-1/2`}></div>
          
          <div className={`h-4 ${cls("bg-gray-200", "bg-[#7C3AED]/30")} rounded mb-3 w-2/3`}></div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className={`h-6 ${cls("bg-gray-200", "bg-[#7C3AED]/40")} rounded-full w-20`}></div>
          </div>
          
          <div className="space-y-2">
            <div className={`h-3 ${cls("bg-gray-200", "bg-[#7C3AED]/30")} rounded w-full`}></div>
            <div className={`h-3 ${cls("bg-gray-200", "bg-[#7C3AED]/30")} rounded w-5/6`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LaunchCardSkeleton;

