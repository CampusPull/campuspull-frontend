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
    <div className="h-full flex flex-col bg-white p-2 text-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/10 text-white">
            <Icon name="Filter" size={15} />
          </div>
          <h3 className="font-extrabold text-slate-800 tracking-tight font-poppins">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-2.5 py-1 rounded-full border border-indigo-100">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 hover:text-slate-600 rounded-full border-none">
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={onClearFilters}
            className="w-full py-3 rounded-2xl border border-transparent text-slate-400 font-bold text-xs hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer bg-transparent"
          >
            <Icon name="RotateCcw" size={12} />
            Reset Filters
          </button>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-3">
        {filterSections?.map((section) => (
          <div key={section?.key} className="bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
            <button
              onClick={() => toggleSection(section?.key)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/50 transition-colors duration-200 border-none bg-transparent cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/30">
                  <Icon name={section?.icon} size={15} />
                </div>
                <span className="font-extrabold text-slate-700 text-sm font-poppins">
                  {section?.title}
                </span>
              </div>
              <Icon 
                name={expandedSections?.[section?.key] ? "ChevronUp" : "ChevronDown"} 
                size={15} 
                className="text-slate-400" 
              />
            </button>

            {expandedSections?.[section?.key] && (
              <div className="px-3 pb-3 pt-1 space-y-1">
                {section?.options?.map((option) => {
                  const isChecked = filters?.[section?.key]?.includes(option?.value) || false;
                  
                  return (
                    <label 
                      key={option?.value}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 group select-none ${
                        isChecked ? 'bg-indigo-50/80 border border-indigo-100/30' : 'hover:bg-slate-100/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Custom Checkbox */}
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          isChecked 
                          ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                          : 'border-slate-300 bg-white group-hover:border-indigo-400'
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
                        
                        <span className={`text-xs font-bold ${isChecked ? 'text-indigo-600' : 'text-slate-600 group-hover:text-slate-800'}`}>
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
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center sm:justify-center">
        <div className="bg-white w-full sm:w-96 max-h-[85vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit w-80 rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;