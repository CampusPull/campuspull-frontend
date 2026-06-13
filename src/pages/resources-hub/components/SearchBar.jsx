import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchQuery, onSearchChange, onFilterToggle, isMobile, hideFilterButton }) => {
  return (
    <div className="relative max-w-3xl mx-auto w-full mb-8 z-20 text-left">
      <div className="relative group">
        
        {/* Left Icon (Search) */}
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Icon 
            name="Search" 
            size={20} 
            className="text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" 
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes, roadmaps, questions..."
          className="w-full pl-12 sm:pl-14 pr-20 sm:pr-24 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 font-semibold shadow-sm"
        />

        {/* Right Actions (Clear & Filter) */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
          
          {/* Clear Button (Visible only when typing) */}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors transform hover:scale-110 border-none bg-transparent cursor-pointer"
              title="Clear search"
            >
              <Icon name="X" size={16} />
            </button>
          )}

          {!hideFilterButton && (
            <>
              {/* Vertical Divider */}
              <div className="h-6 w-px bg-slate-200 mx-1"></div>

              {/* Filter Button */}
              <button
                onClick={onFilterToggle}
                className={`p-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 border bg-transparent cursor-pointer ${
                   isMobile 
                   ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md border-none font-bold' 
                   : 'bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200/60 font-bold'
                }`}
                title="Filters"
              >
                <Icon name="Filter" size={18} />
                {isMobile && <span className="text-sm font-medium">Filters</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;