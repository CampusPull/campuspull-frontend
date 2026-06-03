import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { SORT_OPTIONS } from './filterConfig';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find active option
  const activeOption = SORT_OPTIONS.find(o => o.value === sortBy) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none transition-all cursor-pointer shadow-sm min-w-[170px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Icon name={activeOption.icon} size={15} className="text-indigo-500" />
          <span>{activeOption.label}</span>
        </div>
        <Icon
          name="ChevronDown"
          size={14}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-150/90 shadow-2xl p-1.5 z-40 animate-fade-in origin-top-right transition-all duration-200"
          style={{ boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)' }}
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === sortBy;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-left cursor-pointer border-none transition-all ${
                  isSelected
                    ? 'bg-indigo-50/80 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    name={option.icon}
                    size={14}
                    className={isSelected ? 'text-indigo-600' : 'text-slate-400'}
                  />
                  <span>{option.label}</span>
                </div>
                {isSelected && <Icon name="Check" size={14} className="text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
