import React from 'react';
import Icon from '../../../components/AppIcon';
import { BRANCH_OPTIONS, SEMESTER_OPTIONS, DIFFICULTY_OPTIONS } from './filterConfig';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  // Helper to get labels
  const getBranchLabel = (val) => BRANCH_OPTIONS.find(o => o.value === val)?.label || val;
  const getSemesterLabel = (val) => SEMESTER_OPTIONS.find(o => o.value === val)?.label || `Semester ${val}`;
  
  // Calculate total number of active filters
  const activeChips = [];

  if (filters.search) {
    activeChips.push({ category: 'search', value: filters.search, label: `Search: "${filters.search}"` });
  }
  if (filters.type && filters.type !== 'all') {
    const typeLabels = { notes: 'Study Notes', pyqs: 'Interview PYQs', roadmaps: 'Career Roadmaps' };
    activeChips.push({ category: 'type', value: filters.type, label: `Type: ${typeLabels[filters.type] || filters.type}` });
  }
  // Commented out for now
  /*
  if (filters.verifiedOnly) {
    activeChips.push({ category: 'verifiedOnly', value: true, label: 'Verified Only' });
  }
  if (filters.branch && filters.branch.length > 0) {
    filters.branch.forEach(b => {
      activeChips.push({ category: 'branch', value: b, label: getBranchLabel(b) });
    });
  }
  */
  if (filters.semester && filters.semester.length > 0) {
    filters.semester.forEach(s => {
      activeChips.push({ category: 'semester', value: s, label: getSemesterLabel(s) });
    });
  }
  if (filters.company && filters.company.length > 0) {
    filters.company.forEach(c => {
      activeChips.push({ category: 'company', value: c, label: `Company: ${c}` });
    });
  }
  if (filters.year && filters.year.length > 0) {
    filters.year.forEach(y => {
      activeChips.push({ category: 'year', value: y, label: `Year: ${y}` });
    });
  }
  if (filters.difficulty && filters.difficulty.length > 0) {
    filters.difficulty.forEach(d => {
      activeChips.push({ category: 'difficulty', value: d, label: `Difficulty: ${d}` });
    });
  }
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach(t => {
      activeChips.push({ category: 'tags', value: t, label: `#${t}` });
    });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 text-left">
      <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1.5 flex items-center gap-1.5 select-none">
        <Icon name="Sliders" size={12} className="text-slate-400" />
        Active Filters:
      </span>

      {activeChips.map((chip, idx) => (
        <div
          key={`${chip.category}-${chip.value}-${idx}`}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100/50 hover:border-indigo-200 text-indigo-600 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-brand-sm group"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.category, chip.value)}
            className="p-0.5 rounded-full hover:bg-indigo-100 text-indigo-400 hover:text-indigo-700 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
            title="Remove filter"
          >
            <Icon name="X" size={10} className="stroke-[3]" />
          </button>
        </div>
      ))}

      <button
        onClick={onClearAll}
        className="px-3.5 py-1.5 border border-dashed border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-full text-xs font-black transition-all cursor-pointer bg-transparent flex items-center gap-1 ml-auto"
      >
        <Icon name="RotateCcw" size={11} />
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;
