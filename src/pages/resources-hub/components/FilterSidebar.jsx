import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { 
  BRANCH_OPTIONS, 
  SEMESTER_OPTIONS, 
  DIFFICULTY_OPTIONS, 
  POPULAR_TAG_OPTIONS, 
  POPULAR_COMPANY_OPTIONS,
  RESOURCE_TYPES
} from './filterConfig';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isMobile, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    tags: true,
    branch: true,
    semester: true,
    pyqDetails: true,
    verified: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (section, value, checked) => {
    const currentValues = filters[section] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFilterChange(section, newValues);
  };

  const handleSingleSelect = (section, value) => {
    onFilterChange(section, value);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count += 1;
    if (filters.type && filters.type !== 'all') count += 1;
    if (filters.verifiedOnly) count += 1;
    
    const arrayFields = ['branch', 'semester', 'company', 'year', 'difficulty', 'tags'];
    arrayFields.forEach(field => {
      if (filters[field] && filters[field].length > 0) {
        count += filters[field].length;
      }
    });
    return count;
  };

  const activeType = filters.type || 'all';

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

      {/* ── Filter Fields (Collapsible Accordions) ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        
        {/* SECTION 1: Resource Type Selectors */}
        <div className="bg-slate-50/40 rounded-2xl border border-slate-200/50 overflow-hidden">
          <button
            onClick={() => toggleSection('type')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/30 transition-colors border-none bg-transparent cursor-pointer text-left"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
                <Icon name="Grid3X3" size={14} />
              </div>
              <span className="font-extrabold text-slate-700 text-xs font-poppins">Resource Type</span>
            </div>
            <Icon name={expandedSections.type ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-400" />
          </button>
          
          {expandedSections.type && (
            <div className="px-3 pb-3.5 pt-1 grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'All Types' },
                { value: 'notes', label: 'Notes' },
                { value: 'pyqs', label: 'Interview PYQ' },
                { value: 'roadmaps', label: 'Roadmaps' }
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => handleSingleSelect('type', t.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    activeType === t.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Verified Only Toggle (Common to all) */}
        <div className="bg-slate-50/40 rounded-2xl border border-slate-200/50 p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
              <Icon name="ShieldCheck" size={14} />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-slate-700 text-xs block font-poppins">Verified Only</span>
              <span className="text-[10px] text-slate-400 font-semibold leading-none">Show certified materials</span>
            </div>
          </div>
          <button
            onClick={() => onFilterChange('verifiedOnly', !filters.verifiedOnly)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              filters.verifiedOnly ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* SECTION 3: Notes Specific Filters (Branch & Semester) */}
        {activeType === RESOURCE_TYPES.NOTES && (
          <>
            {/* Branch Accordion */}
            <div className="bg-slate-50/40 rounded-2xl border border-slate-200/50 overflow-hidden">
              <button
                onClick={() => toggleSection('branch')}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/30 transition-colors border-none bg-transparent cursor-pointer text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
                    <Icon name="Folder" size={14} />
                  </div>
                  <span className="font-extrabold text-slate-700 text-xs font-poppins">Branch</span>
                </div>
                <Icon name={expandedSections.branch ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-400" />
              </button>
              {expandedSections.branch && (
                <div className="px-3 pb-3 pt-1 space-y-1">
                  {BRANCH_OPTIONS.map(opt => {
                    const isChecked = filters.branch?.includes(opt.value) || false;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 group select-none ${
                          isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange('branch', opt.value, e.target.checked)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                            isChecked 
                            ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                            : 'border-slate-300 bg-white group-hover:border-indigo-400'
                          }`}>
                            {isChecked && <Icon name="Check" size={10} className="text-white" />}
                          </div>
                          <span className={`text-[11px] font-bold ${isChecked ? 'text-indigo-600' : 'text-slate-600 group-hover:text-slate-800'}`}>
                            {opt.label}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Semester Accordion */}
            <div className="bg-slate-50/40 rounded-2xl border border-slate-200/50 overflow-hidden">
              <button
                onClick={() => toggleSection('semester')}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/30 transition-colors border-none bg-transparent cursor-pointer text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
                    <Icon name="Calendar" size={14} />
                  </div>
                  <span className="font-extrabold text-slate-700 text-xs font-poppins">Semester</span>
                </div>
                <Icon name={expandedSections.semester ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-400" />
              </button>
              {expandedSections.semester && (
                <div className="px-3 pb-3 pt-1 grid grid-cols-4 gap-1.5">
                  {SEMESTER_OPTIONS.map(opt => {
                    const isChecked = filters.semester?.includes(opt.value) || false;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleCheckboxChange('semester', opt.value, !isChecked)}
                        className={`py-2 text-[10px] font-black rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-600 font-extrabold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                      >
                        {opt.value}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* SECTION 4: Interview PYQ Specific Filters (Company, Year, Difficulty) */}
        {activeType === RESOURCE_TYPES.PYQS && (
          <div className="bg-slate-50/40 rounded-2xl border border-slate-200/50 overflow-hidden">
            <button
              onClick={() => toggleSection('pyqDetails')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/30 transition-colors border-none bg-transparent cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
                  <Icon name="Briefcase" size={14} />
                </div>
                <span className="font-extrabold text-slate-700 text-xs font-poppins">PYQ Specifics</span>
              </div>
              <Icon name={expandedSections.pyqDetails ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-400" />
            </button>
            
            {expandedSections.pyqDetails && (
              <div className="px-3 pb-4 pt-1 space-y-4">
                {/* 1. Companies select list */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">Target Company</span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {POPULAR_COMPANY_OPTIONS.map(opt => {
                      const isChecked = filters.company?.includes(opt.value) || false;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleCheckboxChange('company', opt.value, !isChecked)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-500/10'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Years selection */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">Filter by Year</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['2025', '2024', '2023', '2022', '2021', '2020'].map(year => {
                      const isChecked = filters.year?.includes(year) || false;
                      return (
                        <button
                          key={year}
                          onClick={() => handleCheckboxChange('year', year, !isChecked)}
                          className={`py-1.5 text-[10px] font-black rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Difficulties */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">Difficulty</span>
                  <div className="space-y-1">
                    {DIFFICULTY_OPTIONS.map(opt => {
                      const isChecked = filters.difficulty?.includes(opt.value) || false;
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 group select-none ${
                            isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange('difficulty', opt.value, e.target.checked)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                              isChecked 
                              ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                              : 'border-slate-300 bg-white group-hover:border-indigo-400'
                            }`}>
                              {isChecked && <Icon name="Check" size={10} className="text-white" />}
                            </div>
                            <span className={`text-[11px] font-bold ${isChecked ? 'text-indigo-600' : 'text-slate-600 group-hover:text-slate-800'}`}>
                              {opt.label}
                            </span>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${opt.color}`}>
                            {opt.value}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: Multi-select Tags (Common to all) */}
        <div className="bg-slate-50/40 rounded-2xl border border-slate-200/50 overflow-hidden">
          <button
            onClick={() => toggleSection('tags')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/30 transition-colors border-none bg-transparent cursor-pointer text-left"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 border border-indigo-100/20">
                <Icon name="Tag" size={14} />
              </div>
              <span className="font-extrabold text-slate-700 text-xs font-poppins">Popular Tags</span>
            </div>
            <Icon name={expandedSections.tags ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-400" />
          </button>
          
          {expandedSections.tags && (
            <div className="px-3 pb-3.5 pt-1 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {POPULAR_TAG_OPTIONS.map(opt => {
                const isChecked = filters.tags?.includes(opt.value) || false;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleCheckboxChange('tags', opt.value, !isChecked)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center sm:justify-center animate-fade-in">
        <div className="bg-white w-full sm:w-[400px] max-h-[85vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 relative animate-slide-up">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 h-fit w-80 rounded-3xl overflow-hidden shadow-sm border border-slate-150/90 bg-white p-1">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;