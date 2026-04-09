import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewToggle = ({ viewMode, onViewModeChange, totalResults, sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant', icon: 'Target' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'downloads', label: 'Most Downloaded', icon: 'Download' }
  ];

  const getCurrentSortOption = () => {
    return sortOptions?.find(option => option?.value === sortBy) || sortOptions?.[0];
  };

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-brand-sm">
      {/* Results Count */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={18} color="var(--color-academic-blue)" />
          <span className="text-sm font-inter text-wisdom-charcoal">
            <span className="font-semibold">{totalResults?.toLocaleString()}</span> resources found
          </span>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e?.target?.value)}
            className="appearance-none bg-surface border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-inter text-wisdom-charcoal focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-academic-blue cursor-pointer"
          >
            {sortOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon name="ChevronDown" size={16} color="var(--color-insight-gray)" />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-surface rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={`px-3 py-2 ${
              viewMode === 'grid' ?'bg-academic-blue text-white shadow-brand-sm' :'text-insight-gray hover:text-wisdom-charcoal'
            }`}
          >
            <Icon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-2 ${
              viewMode === 'list' ?'bg-academic-blue text-white shadow-brand-sm' :'text-insight-gray hover:text-wisdom-charcoal'
            }`}
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;