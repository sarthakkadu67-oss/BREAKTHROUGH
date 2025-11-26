
import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-3xl shadow-sm overflow-hidden border border-gray-800">
      {/* Image Skeleton */}
      <div className="h-64 bg-gray-800 animate-pulse relative">
        <div className="absolute top-3 left-3 w-16 h-5 bg-gray-700 rounded"></div>
        <div className="absolute bottom-3 right-3 w-20 h-5 bg-gray-700 rounded-full"></div>
      </div>

      {/* Info Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse"></div>
          <div className="h-5 bg-gray-800 rounded w-10 animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-800 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-1/4 animate-pulse"></div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex justify-between">
          <div className="h-4 bg-gray-800 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
