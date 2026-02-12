import React from 'react';

const LoadingSkeleton = ({ viewMode = 'grid', count = 6 }) => {
  const SkeletonCard = ({ isListView = false }) => (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${isListView ? 'p-6' : ''}`}>
      {!isListView && (
        <div className="h-48 bg-slate-200 animate-pulse"></div>
      )}
      
      <div className={isListView ? 'flex items-start space-x-4' : 'p-4'}>
        {isListView && (
          <div className="flex-shrink-0 w-20 h-20 bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
            {!isListView && <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>}
          </div>
          
          <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-slate-200 rounded animate-pulse w-16"></div>
              <div className="h-8 bg-slate-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RoadmapSkeleton = () => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="h-32 bg-slate-200 animate-pulse"></div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="h-2 bg-slate-200 rounded-full animate-pulse"></div>
        
        {[1, 2, 3]?.map((i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PYQSkeleton = () => (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded animate-pulse w-24"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded-full animate-pulse w-16"></div>
          <div className="h-6 bg-slate-200 rounded-full animate-pulse w-12"></div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
        <div className="h-16 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3]?.map((i) => (
          <div key={i} className="text-center space-y-1">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-8 mx-auto"></div>
            <div className="h-3 bg-slate-200 rounded animate-pulse w-12 mx-auto"></div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-slate-200 rounded animate-pulse w-16"></div>
          <div className="h-8 bg-slate-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="h-16 bg-slate-200 rounded-xl animate-pulse"></div>
      {/* View Toggle Skeleton */}
      <div className="h-16 bg-slate-200 rounded-xl animate-pulse"></div>
      {/* Content Skeleton */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :'grid-cols-1'
      }`}>
        {Array.from({ length: count })?.map((_, index) => (
          <SkeletonCard key={index} isListView={viewMode === 'list'} />
        ))}
      </div>
      {/* Roadmap Section Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2]?.map((i) => (
            <RoadmapSkeleton key={i} />
          ))}
        </div>
      </div>
      {/* PYQ Section Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-40"></div>
        <div className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2]?.map((i) => (
            <PYQSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;