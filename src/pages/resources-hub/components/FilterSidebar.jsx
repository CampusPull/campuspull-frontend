import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isMobile, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    subject: true,
    semester: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  // Fixed Taxonomy Options (Real Application Structure)
  const filterSections = [
    {
      key: 'subject',
      title: 'Subject',
      icon: 'BookOpen',
      options: [
        { value: 'computer-science', label: 'Computer Science' },
        { value: 'mathematics', label: 'Mathematics' },
        { value: 'physics', label: 'Physics' },
        { value: 'chemistry', label: 'Chemistry' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'mechanical', label: 'Mechanical Engineering' },
        { value: 'civil', label: 'Civil Engineering' },
      ]
    },
    {
      key: 'semester',
      title: 'Semester',
      icon: 'Calendar',
      options: [
        { value: '1', label: '1st Semester' },
        { value: '2', label: '2nd Semester' },
        { value: '3', label: '3rd Semester' },
        { value: '4', label: '4th Semester' },
        { value: '5', label: '5th Semester' },
        { value: '6', label: '6th Semester' },
        { value: '7', label: '7th Semester' },
        { value: '8', label: '8th Semester' }
      ]
    }
  ];

  const handleFilterChange = (section, value, checked) => {
    const currentValues = filters?.[section] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    onFilterChange(section, newValues);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters)?.reduce((count, filterArray) => count + (filterArray?.length || 0), 0);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-indigo-50">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-indigo-600" />
          <h3 className="font-bold text-gray-800">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-50 hover:text-red-500 rounded-full">
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="p-4 border-b border-indigo-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all"
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2">
        {filterSections?.map((section) => (
          <div key={section?.key} className="bg-white/50 rounded-xl border border-white/60 overflow-hidden">
            <button
              onClick={() => toggleSection(section?.key)}
              className="w-full flex items-center justify-between p-3 hover:bg-white/80 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Icon name={section?.icon} size={16} />
                </div>
                <span className="font-semibold text-gray-700 text-sm">
                  {section?.title}
                </span>
              </div>
              <Icon 
                name={expandedSections?.[section?.key] ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-gray-400" 
              />
            </button>

            {expandedSections?.[section?.key] && (
              <div className="px-3 pb-3 pt-1 space-y-1">
                {section?.options?.map((option) => {
                  const isChecked = filters?.[section?.key]?.includes(option?.value) || false;
                  
                  return (
                    <label 
                        key={option?.value}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                            isChecked ? 'bg-indigo-50 ring-1 ring-indigo-100' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            {/* Custom Checkbox */}
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                                isChecked 
                                ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                                : 'border-gray-300 bg-white group-hover:border-indigo-400'
                            }`}>
                                {isChecked && <Icon name="Check" size={10} className="text-white" />}
                            </div>
                            
                            {/* Hidden Native Checkbox */}
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleFilterChange(section?.key, option?.value, e?.target?.checked)}
                                className="hidden"
                            />
                            
                            <span className={`text-sm ${isChecked ? 'font-medium text-indigo-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                {option?.label}
                            </span>
                        </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center sm:justify-center">
        <div className="bg-white w-full sm:w-96 max-h-[85vh] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl overflow-hidden shadow-sm border border-white/60">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;