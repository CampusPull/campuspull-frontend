import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MobileSearchBar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);

  const quickSearchSuggestions = [
    { id: 1, text: "Data Structures and Algorithms", type: "Study Material", icon: "BookOpen" },
    { id: 2, text: "Google Interview Questions", type: "Interview PYQs", icon: "MessageSquare" },
    { id: 3, text: "Full Stack Developer Roadmap", type: "Career Path", icon: "Map" },
    { id: 4, text: "Machine Learning Basics", type: "Study Material", icon: "BookOpen" },
    { id: 5, text: "System Design Interview", type: "Interview PYQs", icon: "MessageSquare" },
    { id: 6, text: "Product Manager Career", type: "Career Path", icon: "Map" }
  ];

  const mockSearchResults = [
    {
      id: 1,
      title: "Complete DSA Guide for Interviews",
      type: "Study Material",
      author: "Campus pull",
      downloads: 2847,
      rating: 4.9,
      icon: "BookOpen"
    },
    {
      id: 2,
      title: "Google SWE Interview Experience 2024",
      type: "Interview PYQ",
      author: "Campus pull",
      downloads: 1923,
      rating: 4.8,
      icon: "MessageSquare"
    },
    {
      id: 3,
      title: "Frontend Developer Learning Path",
      type: "Career Roadmap",
      author: "Campus pull",
      downloads: 3156,
      rating: 4.9,
      icon: "Map"
    }
  ];

  useEffect(() => {
    if (isSearchActive && searchInputRef?.current) {
      searchInputRef?.current?.focus();
    }
  }, [isSearchActive]);

  useEffect(() => {
    if (searchQuery?.length > 2) {
      setIsLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        setSearchResults(mockSearchResults?.filter(result => 
          result?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        ));
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion?.text);
    setIsSearchActive(false);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      // Handle search submission
      console.log('Searching for:', searchQuery);
      setIsSearchActive(false);
    }
  };

  return (
    <>
      {/* Mobile Search Bar - Only visible on mobile */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-brand-sm">
        <div className="px-4 py-3">
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={20} color="var(--color-insight-gray)" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onFocus={() => setIsSearchActive(true)}
                  placeholder="Search resources, mentors, topics..."
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-slate-200 rounded-lg text-wisdom-charcoal placeholder-insight-gray font-inter focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Icon name="X" size={18} color="var(--color-insight-gray)" />
                  </button>
                )}
              </div>
              
              {searchQuery && (
                <button
                  type="submit"
                  className="px-4 py-3 bg-academic-blue hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-brand-sm"
                >
                  <Icon name="Search" size={18} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* Search Overlay */}
      {isSearchActive && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-lg font-inter font-semibold text-wisdom-charcoal">
              Search Resources
            </h3>
            <button
              onClick={handleSearchToggle}
              className="p-2 hover:bg-surface rounded-lg transition-colors duration-300"
            >
              <Icon name="X" size={24} color="var(--color-insight-gray)" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-slate-200">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={20} color="var(--color-insight-gray)" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-slate-200 rounded-lg text-wisdom-charcoal placeholder-insight-gray font-inter focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent transition-all duration-300"
                />
              </div>
            </form>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery?.length === 0 ? (
              /* Quick Suggestions */
              (<div className="p-4">
                <h4 className="text-sm font-inter font-semibold text-wisdom-charcoal mb-4 uppercase tracking-wide">
                  Popular Searches
                </h4>
                <div className="space-y-2">
                  {quickSearchSuggestions?.map((suggestion) => (
                    <button
                      key={suggestion?.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-surface rounded-lg transition-colors duration-300 text-left"
                    >
                      <div className="w-10 h-10 bg-academic-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={suggestion?.icon} size={18} color="var(--color-academic-blue)" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-inter font-medium text-wisdom-charcoal">
                          {suggestion?.text}
                        </p>
                        <p className="text-xs text-insight-gray">
                          {suggestion?.type}
                        </p>
                      </div>
                      <Icon name="ArrowUpRight" size={16} color="var(--color-insight-gray)" />
                    </button>
                  ))}
                </div>
              </div>)
            ) : isLoading ? (
              /* Loading State */
              (<div className="p-4">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-academic-blue"></div>
                </div>
              </div>)
            ) : searchResults?.length > 0 ? (
              /* Search Results */
              (<div className="p-4">
                <h4 className="text-sm font-inter font-semibold text-wisdom-charcoal mb-4 uppercase tracking-wide">
                  Search Results ({searchResults?.length})
                </h4>
                <div className="space-y-3">
                  {searchResults?.map((result) => (
                    <div
                      key={result?.id}
                      className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-brand-sm transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-academic-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={result?.icon} size={20} color="var(--color-academic-blue)" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-inter font-semibold text-wisdom-charcoal line-clamp-1">
                          {result?.title}
                        </h5>
                        <p className="text-xs text-insight-gray mb-1">
                          by {result?.author} • {result?.type}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-insight-gray">
                          <div className="flex items-center space-x-1">
                            <Icon name="Download" size={12} />
                            <span>{result?.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} color="#F59E0B" />
                            <span>{result?.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>)
            ) : (
              /* No Results */
              (<div className="p-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={24} color="var(--color-insight-gray)" />
                  </div>
                  <h4 className="text-lg font-inter font-semibold text-wisdom-charcoal mb-2">
                    No results found
                  </h4>
                  <p className="text-sm text-insight-gray">
                    Try searching with different keywords or browse our popular resources
                  </p>
                </div>
              </div>)
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearchBar;