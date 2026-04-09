// src/pages/announcements/components/LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  const SkeletonCard = () => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-brand-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-slate-200 rounded w-3/5"></div>
        <div className="h-4 bg-slate-200 rounded w-8"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-4/5"></div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
          <div className="h-3 bg-slate-200 rounded w-20"></div>
        </div>
        <div className="h-3 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;