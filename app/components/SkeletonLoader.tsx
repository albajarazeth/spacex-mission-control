"use client";

interface SkeletonLoaderProps {
  rows?: number;
}

const SkeletonLoader = ({ rows = 5 }: SkeletonLoaderProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <div className="flex-1 overflow-y-auto max-h-[300px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </th>
              <th className="text-left py-2 px-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2 px-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </td>
                <td className="py-2 px-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonLoader;

