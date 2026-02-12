import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchQuery, onSearchChange, onFilterToggle, isMobile }) => {
  return (
    <div className="relative max-w-3xl mx-auto w-full mb-8 z-20">
      <div className="relative group">
        
        {/* Left Icon (Search) */}
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Icon 
            name="Search" 
            size={20} 
            className="text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" 
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes, roadmaps, interview questions..."
          className="w-full pl-14 pr-24 py-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm text-gray-700 placeholder-gray-400 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-200 transition-all duration-300"
        />

        {/* Right Actions (Clear & Filter) */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
          
          {/* Clear Button (Visible only when typing) */}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors transform hover:scale-110"
              title="Clear search"
            >
              <Icon name="X" size={16} />
            </button>
          )}

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* Filter Button */}
          <button
            onClick={onFilterToggle}
            className={`p-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
               isMobile 
               ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
               : 'bg-white/50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100'
            }`}
            title="Filters"
          >
            <Icon name="Filter" size={20} />
            {isMobile && <span className="text-sm font-medium">Filters</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;