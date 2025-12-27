"use client";

interface LoadingCircleProps {
  showText?: boolean;
}

const LoadingCircle = ({ showText = true }: LoadingCircleProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${showText ? 'h-16' : 'h-12'} gap-2`}>
      <div className="relative w-8 h-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      {showText && (
        <p className="text-green-600 text-sm font-medium">Loading</p>
      )}
    </div>
  );
};

export default LoadingCircle;

