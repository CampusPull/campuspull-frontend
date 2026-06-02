import React from 'react';
import Icon from '../../../components/AppIcon';

const ViewToggle = ({ viewMode, onViewModeChange, totalResults, sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant', icon: 'Target' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'downloads', label: 'Most Downloaded', icon: 'Download' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-100 rounded-3xl p-3.5 sm:p-4 shadow-sm text-left">
      {/* Results Count */}
      <div className="flex items-center space-x-2">
        <Icon name="FileText" size={18} className="text-indigo-500" />
        <span className="text-sm font-inter text-slate-500 font-semibold">
          <span className="font-extrabold text-slate-800">{totalResults?.toLocaleString()}</span> resources found
        </span>
      </div>
      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e?.target?.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-2xl px-3 sm:px-4 py-2.5 pr-8 sm:pr-10 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer shadow-sm transition-all"
          >
            {sortOptions?.map((option) => (
              <option key={option?.value} value={option?.value} className="bg-white text-slate-700">
                {option?.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <Icon name="ChevronDown" size={14} className="text-slate-400" />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center ${
              viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'
            }`}
          >
            <Icon name="Grid3X3" size={15} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center ${
              viewMode === 'list' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'
            }`}
          >
            <Icon name="List" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;