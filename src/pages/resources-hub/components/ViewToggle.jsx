import React from 'react';
import Icon from '../../../components/AppIcon';
import SortDropdown from './SortDropdown';

const ViewToggle = ({ viewMode, onViewModeChange, totalResults, sortBy, onSortChange }) => {
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
        {/* Modern Sort Dropdown */}
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center ${
              viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'
            }`}
            title="Grid View"
          >
            <Icon name="Grid3X3" size={15} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center ${
              viewMode === 'list' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'
            }`}
            title="List View"
          >
            <Icon name="List" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;