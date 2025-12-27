"use client";

import { FaRocket } from "react-icons/fa";

interface LaunchListSkeletonProps {
  items?: number;
}

const LaunchListSkeleton = ({ items = 10 }: LaunchListSkeletonProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#A78BFA] via-[#60A5FA] to-[#A78BFA] opacity-40"></div>
      
      <div className="flex flex-col gap-6 pl-2 min-h-[760px]">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="relative flex items-start gap-4">
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#FEFCFB] border-2 border-[#A78BFA]/30 flex items-center justify-center">
                <FaRocket className="text-[#6366F1]/30 text-sm" />
              </div>
            </div>
            
            <div className="flex-1 bg-[#FEFCFB]/80 border border-black/6 rounded-2xl p-4">
              <div className="h-5 bg-gray-200/60 rounded-lg w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200/60 rounded-lg w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaunchListSkeleton;

