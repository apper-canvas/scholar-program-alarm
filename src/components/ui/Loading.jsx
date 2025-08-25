import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
          <div className="h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg w-32"></div>
        </div>
        
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg card-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                <div className="h-8 w-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"></div>
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg card-shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-6 flex items-center space-x-4">
                <div className="h-10 w-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;