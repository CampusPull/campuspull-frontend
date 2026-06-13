import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// CollapsibleSection is a stable component declared outside the parent to prevent remounts and focus loss
const CollapsibleSection = ({ id, title, icon, isExpanded, onToggle, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-300">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer text-left"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
            <Icon name={icon} size={14} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-poppins">{title}</span>
        </div>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={14}
          className="text-slate-400 transition-transform duration-300"
        />
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100 border-t border-slate-50 p-4' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

const FilterSidebar = ({
  activeType = 'all',
  filters,
  onFilterChange,
  onClearFilters,
  isMobile,
  onClose,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    subName: true,
    company: true,
    difficulty: true,
    year: true,
    sortBy: true,
    type: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeType === 'notes') {
      if (filters.subName) count += 1;
      if (filters.year) count += filters.year.length;
    } else if (activeType === 'roadmaps') {
      if (searchQuery) count += 1;
      if (filters.year) count += filters.year.length;
    } else if (activeType === 'pyqs') {
      if (filters.company) count += 1;
      if (filters.difficulty) count += 1;
      if (filters.year) count += filters.year.length;
    } else {
      // 'all'
      if (filters.type && filters.type !== 'all') count += 1;
    }
    return count;
  };

  const handleYearToggle = (yearValue) => {
    const currentYears = filters.year || [];
    const isSelected = currentYears.includes(String(yearValue));
    const newYears = isSelected
      ? currentYears.filter(y => y !== String(yearValue))
      : [...currentYears, String(yearValue)];
    onFilterChange('year', newYears);
  };

  const handleDifficultyClick = (diff) => {
    const currentDiff = filters.difficulty;
    const newDiff = currentDiff === diff ? '' : diff;
    onFilterChange('difficulty', newDiff);
  };

  const handleCalendarYearChange = (e) => {
    const val = e.target.value;
    onFilterChange('year', val === '' ? [] : [val]);
  };

  const handleTypeChange = (typeVal) => {
    onFilterChange('type', typeVal);
  };

  const renderNotesFilters = () => {
    return (
      <>
        {/* Subject Name Input */}
        <CollapsibleSection
          id="subName"
          title="Subject Name"
          icon="BookOpen"
          isExpanded={expandedSections.subName}
          onToggle={toggleSection}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={14} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={filters.subName || ''}
              onChange={(e) => onFilterChange('subName', e.target.value)}
              placeholder="Search subject..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </CollapsibleSection>

        {/* Year Selector */}
        <CollapsibleSection
          id="year"
          title="Academic Year"
          icon="Calendar"
          isExpanded={expandedSections.year}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '1st Year', value: 1 },
              { label: '2nd Year', value: 2 },
              { label: '3rd Year', value: 3 },
              { label: '4th Year', value: 4 },
            ].map(y => {
              const isSelected = (filters.year || []).includes(String(y.value));
              return (
                <button
                  key={y.value}
                  onClick={() => handleYearToggle(y.value)}
                  className={`py-2 px-3 rounded-full text-xs font-bold border cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {y.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Sort By Selector */}
        <CollapsibleSection
          id="sortBy"
          title="Sort By"
          icon="Sliders"
          isExpanded={expandedSections.sortBy}
          onToggle={toggleSection}
        >
          <div className="flex flex-col gap-2">
            {[
              { label: 'Newest First', value: 'newest' },
              { label: 'Most Downloaded', value: 'downloads' },
              { label: 'Most Viewed', value: 'popular' },
            ].map(s => {
              const isSelected = sortBy === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => onSortChange(s.value)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold border text-left cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      </>
    );
  };

  const renderRoadmapsFilters = () => {
    return (
      <>
        {/* Search Roadmaps */}
        <CollapsibleSection
          id="search"
          title="Search Roadmap"
          icon="Search"
          isExpanded={expandedSections.search}
          onToggle={toggleSection}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={14} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search title/description..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </CollapsibleSection>

        {/* Year Selector */}
        <CollapsibleSection
          id="year"
          title="Academic Year"
          icon="Calendar"
          isExpanded={expandedSections.year}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '1st Year', value: 1 },
              { label: '2nd Year', value: 2 },
              { label: '3rd Year', value: 3 },
              { label: '4th Year', value: 4 },
            ].map(y => {
              const isSelected = (filters.year || []).includes(String(y.value));
              return (
                <button
                  key={y.value}
                  onClick={() => handleYearToggle(y.value)}
                  className={`py-2 px-3 rounded-full text-xs font-bold border cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {y.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Sort By Selector */}
        <CollapsibleSection
          id="sortBy"
          title="Sort By"
          icon="Sliders"
          isExpanded={expandedSections.sortBy}
          onToggle={toggleSection}
        >
          <div className="flex flex-col gap-2">
            {[
              { label: 'Newest First', value: 'newest' },
              { label: 'Most Viewed', value: 'popular' },
            ].map(s => {
              const isSelected = sortBy === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => onSortChange(s.value)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold border text-left cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      </>
    );
  };

  const renderPYQFilters = () => {
    return (
      <>
        {/* Company Name */}
        <CollapsibleSection
          id="company"
          title="Company Name"
          icon="Briefcase"
          isExpanded={expandedSections.company}
          onToggle={toggleSection}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={14} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={filters.company || ''}
              onChange={(e) => onFilterChange('company', e.target.value)}
              placeholder="Search company..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </CollapsibleSection>

        {/* Difficulty Selector */}
        <CollapsibleSection
          id="difficulty"
          title="Difficulty"
          icon="Tag"
          isExpanded={expandedSections.difficulty}
          onToggle={toggleSection}
        >
          <div className="flex flex-col gap-2">
            {[
              { label: 'Easy', value: 'Easy', activeClass: 'bg-emerald-600 border-emerald-600 text-white' },
              { label: 'Medium', value: 'Medium', activeClass: 'bg-amber-500 border-amber-500 text-white' },
              { label: 'Hard', value: 'Hard', activeClass: 'bg-rose-600 border-rose-600 text-white' },
            ].map(d => {
              const isSelected = filters.difficulty === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => handleDifficultyClick(d.value)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold border text-left cursor-pointer transition-all ${isSelected
                      ? d.activeClass
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Year Dropdown Calendar Year */}
        <CollapsibleSection
          id="year"
          title="Calendar Year"
          icon="Calendar"
          isExpanded={expandedSections.year}
          onToggle={toggleSection}
        >
          <select
            value={filters.year?.[0] || ''}
            onChange={handleCalendarYearChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="">All Years</option>
            {['2025', '2024', '2023', '2022', '2021', '2020', '2019'].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </CollapsibleSection>

        {/* Sort By Selector */}
        <CollapsibleSection
          id="sortBy"
          title="Sort By"
          icon="Sliders"
          isExpanded={expandedSections.sortBy}
          onToggle={toggleSection}
        >
          <div className="flex flex-col gap-2">
            {[
              { label: 'Newest First', value: 'newest' },
              { label: 'Most Downloaded', value: 'downloads' },
              { label: 'Most Viewed', value: 'popular' },
            ].map(s => {
              const isSelected = sortBy === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => onSortChange(s.value)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold border text-left cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      </>
    );
  };

  const renderAllFilters = () => {
    return (
      <>
        {/* Resource Type */}
        <CollapsibleSection
          id="type"
          title="Resource Type"
          icon="Grid3X3"
          isExpanded={expandedSections.type}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'Notes', value: 'notes' },
              { label: 'Roadmaps', value: 'roadmaps' },
              { label: 'Interview PYQ', value: 'pyqs' },
            ].map(t => {
              const isSelected = activeType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => handleTypeChange(t.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Sort By Selector */}
        <CollapsibleSection
          id="sortBy"
          title="Sort By"
          icon="Sliders"
          isExpanded={expandedSections.sortBy}
          onToggle={toggleSection}
        >
          <div className="flex flex-col gap-2">
            {[
              { label: 'Newest First', value: 'newest' },
              { label: 'Most Viewed', value: 'popular' },
            ].map(s => {
              const isSelected = sortBy === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => onSortChange(s.value)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold border text-left cursor-pointer transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      </>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white text-slate-700">
      {/* ── Header ── */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/15 text-white">
            <Icon name="Filter" size={15} />
          </div>
          <h3 className="font-extrabold text-slate-800 tracking-tight font-poppins text-sm sm:text-base">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-2.5 py-1 rounded-full border border-indigo-100 select-none">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 hover:text-slate-600 rounded-full border-none cursor-pointer">
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* ── Clear/Reset Filters Button ── */}
      {getActiveFiltersCount() > 0 && (
        <div className="p-4 border-b border-slate-100 bg-slate-50/20">
          <button
            onClick={onClearFilters}
            className="w-full py-2.5 rounded-xl border border-dashed border-rose-200 hover:border-rose-300 text-rose-500 hover:text-rose-600 hover:bg-rose-50/70 font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer bg-transparent"
          >
            <Icon name="RotateCcw" size={11} />
            Reset All Filters
          </button>
        </div>
      )}

      {/* ── Filter Fields ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {activeType === 'notes' && renderNotesFilters()}
        {activeType === 'roadmaps' && renderRoadmapsFilters()}
        {activeType === 'pyqs' && renderPYQFilters()}
        {activeType === 'all' && renderAllFilters()}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center sm:justify-center animate-fade-in">
        <div 
          onWheel={(e) => e.stopPropagation()}
          className="bg-white w-full sm:w-[400px] max-h-[85vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto flex flex-col border border-slate-100 relative animate-slide-up"
        >
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 h-fit w-full rounded-3xl overflow-hidden shadow-sm border border-slate-150/90 bg-white p-1">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;