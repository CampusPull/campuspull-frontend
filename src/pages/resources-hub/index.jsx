import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import ResourceCard from './components/ResourceCard';
import CareerRoadmapCard from './components/CareerRoadmapCard';
import InterviewPYQSection from './components/InterviewPYQSection';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import { ResourceContext } from '../../context/resourceContext';
import UploadModal from './components/uploadModel';
import EditResourceModal from './components/EditResourceModal';
import DeleteResourceModal from './components/DeleteResouceModal';
import SignupModal from '../../components/ui/SignupModal';
import { useAuth } from '../../context/AuthContext';

// ─── Stats pill ───────────────────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center px-6 py-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:bg-white/20 transition-all duration-300">
    <span className="text-2xl font-black text-white tracking-tight">{value}</span>
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mt-1">{label}</span>
  </div>
);

const ResourcesHub = () => {
  const {
    resources,
    roadmaps,
    pyqs,
    loading,
    canEditResource,
    isGuest,
    showAuthModal,
    setShowAuthModal,
  } = useContext(ResourceContext);

  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);

  const handleFilterChange = (section, values) => {
    setFilters(prev => ({ ...prev, [section]: values }));
  };
  const handleClearFilters = () => setFilters({});

  // Guests can never upload
  const canUploadNotes = !isGuest && ['admin', 'teacher', 'alumni'].includes(user?.role);
  const canUploadAll = !isGuest && user?.role === 'admin';
  const canUpload = canUploadNotes || canUploadAll;

  const filteredResources = resources?.filter(resource => {
    if (
      searchQuery &&
      !resource?.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;
    for (const [key, values] of Object.entries(filters)) {
      if (values?.length > 0) {
        const targetKey = key === 'subject' ? 'branch' : key;
        const fieldValue = resource?.[targetKey] !== undefined ? resource?.[targetKey] : resource?.[key];

        if (Array.isArray(fieldValue)) {
          if (!fieldValue.some(val => values.includes(String(val)))) return false;
        } else {
          if (!values.includes(String(fieldValue))) return false;
        }
      }
    }
    return true;
  });

  const sortedResources = [...(filteredResources || [])].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
      case 'downloads': return (b.downloads || 0) - (a.downloads || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  const filteredRoadmaps = roadmaps?.filter(r =>
    !searchQuery ||
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPyqs = pyqs?.filter(p =>
    !searchQuery || p.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let displayedCount = 0;
  if (activeSection === 'all') {
    displayedCount = (sortedResources?.length || 0) + (filteredRoadmaps?.length || 0) + (filteredPyqs?.length || 0);
  } else if (activeSection === 'notes') displayedCount = sortedResources?.length || 0;
  else if (activeSection === 'roadmaps') displayedCount = filteredRoadmaps?.length || 0;
  else if (activeSection === 'pyqs') displayedCount = filteredPyqs?.length || 0;

  const totalRawCount = (resources?.length || 0) + (roadmaps?.length || 0) + (pyqs?.length || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 text-slate-800 pb-20 select-none pt-10">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-16 pb-16 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="h-8 bg-white/10 rounded-lg w-1/3 animate-pulse mb-3" />
            <div className="h-12 bg-white/10 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex gap-8">
          <div className="hidden lg:block w-72 bg-white/80 border border-slate-100 rounded-3xl p-6 flex-shrink-0 shadow-sm">
            <div className="h-8 bg-slate-100 rounded animate-pulse mb-4"></div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-slate-100 rounded animate-pulse mb-2"></div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <LoadingSkeleton viewMode={viewMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Resources Hub - Campus-Pull | Knowledge Without Boundaries</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 text-slate-800 selection:bg-indigo-500/20 pb-20 pt-10">

        {/* ── Hero Header ── */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-16 pb-16 px-4 sm:px-8 relative overflow-hidden">
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-inner-sm">
                    <Icon name="BookOpen" size={18} className="text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-black uppercase tracking-widest">Knowledge Hub</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  Resources <br className="sm:hidden" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400">Hub</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base font-semibold max-w-md leading-relaxed">
                  Discover comprehensive study materials, career roadmaps, and verified company interview previous year questions.
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <StatPill value={resources?.length || "0"} label="Study Notes" />
                <StatPill value={roadmaps?.length || "0"} label="Roadmaps" />
                <StatPill value={pyqs?.length || "0"} label="PYQs" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Guest Banner ── */}
        {isGuest && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-6 mb-0 relative z-20">
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-100 p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
              style={{ boxShadow: "0 10px 30px -10px rgba(79,70,229,0.15)" }}
            >
              <p className="text-slate-700 font-semibold text-sm leading-relaxed">
                👋 <strong className="text-indigo-600 font-extrabold">Browsing as guest.</strong> Create a free account to download resources and bookmark them.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black rounded-xl hover:shadow-md hover:shadow-indigo-500/10 hover:scale-102 transition-all duration-200 cursor-pointer border-none"
              >
                Join Now
              </button>
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 flex justify-between items-center">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-700 shadow-sm hover:border-indigo-400 hover:shadow-brand-sm transition-all duration-300 cursor-pointer"
            >
              <Icon name="Sliders" size={15} className="text-indigo-500" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0 text-left">
              <div className="sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isMobile={false}
                  onClose={() => { }}
                />
              </div>
            </aside>

            {isMobileFilterOpen && (
              <div className="relative z-50">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isMobile
                  onClose={() => setIsMobileFilterOpen(false)}
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 min-w-0 space-y-6">

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterToggle={() => setIsMobileFilterOpen(true)}
                isMobile={typeof window !== 'undefined' && window.innerWidth < 1024}
              />

              {/* Tabs */}
              <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto scrollbar-hide">
                {[
                  { key: 'all', label: `All Resources (${totalRawCount})`, icon: 'Grid3X3' },
                  { key: 'notes', label: `Study Notes (${resources?.length || 0})`, icon: 'FileText' },
                  { key: 'roadmaps', label: `Career Roadmaps (${roadmaps?.length || 0})`, icon: 'Route' },
                  { key: 'pyqs', label: `Interview PYQs (${pyqs?.length || 0})`, icon: 'MessageCircle' },
                ].map(section => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer border-none ${activeSection === section.key
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50'
                      }`}
                  >
                    <Icon name={section.icon} size={15} />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>

              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResults={displayedCount}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* NOTES */}
              {(activeSection === 'all' || activeSection === 'notes') && (
                <div className="space-y-8 text-left">
                  {activeSection === 'all' && (
                    <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-800 border-b border-slate-100 pb-3">Study Notes by Category</h3>
                  )}
                  {sortedResources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
                      <Icon name="FolderOpen" size={48} className="text-slate-400 mb-4 opacity-75" />
                      <h4 className="text-lg font-bold text-slate-700 mb-1">No resources found</h4>
                      <p className="text-sm text-slate-400 font-semibold">Try adjusting your search or filters.</p>
                    </div>
                  ) : (
                    Object.entries(
                      sortedResources.reduce((acc, resource) => {
                        const category = resource.branch || resource.subject || 'Uncategorized';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(resource);
                        return acc;
                      }, {})
                    ).map(([category, resourcesInCategory]) => (
                      <div key={category} className="space-y-4">
                        <h4 className="text-base sm:text-lg font-extrabold text-indigo-600 capitalize flex items-center gap-2.5">
                          <Icon name="Folder" size={18} className="text-indigo-500" />
                          <span>{category.replace(/-/g, ' ')}</span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full shadow-sm">
                            {resourcesInCategory.length}
                          </span>
                        </h4>
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                          {resourcesInCategory.map(resource => (
                            <ResourceCard
                              key={resource._id}
                              resource={resource}
                              viewMode={viewMode}
                              canEdit={!isGuest && canEditResource(resource, 'notes')}
                              onEditClick={() => setEditingResource({ data: resource, type: 'notes' })}
                              onDeleteClick={() => setDeletingResource({ ...resource, type: 'notes' })}
                              isGuest={isGuest}
                              onRestrictedAction={() => setShowAuthModal(true)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ROADMAPS */}
              {(activeSection === 'all' || activeSection === 'roadmaps') && (
                <div className="space-y-4 text-left">
                  {activeSection === 'all' && (
                    <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-800 border-b border-slate-100 pb-3">Career Roadmaps</h3>
                  )}
                  {filteredRoadmaps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
                      <p className="text-sm text-slate-400 font-semibold">No roadmaps match your criteria.</p>
                    </div>
                  ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                      {filteredRoadmaps.map(roadmap => (
                        <CareerRoadmapCard
                          key={roadmap._id}
                          roadmap={roadmap}
                          viewMode={viewMode}
                          canEdit={!isGuest && canEditResource(roadmap, 'roadmaps')}
                          onEditClick={() => setEditingResource({ data: roadmap, type: 'roadmaps' })}
                          onDeleteClick={(roadmap) => setDeletingResource({ ...roadmap, type: 'roadmap' })}
                          isGuest={isGuest}
                          onRestrictedAction={() => setShowAuthModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PYQS */}
              {(activeSection === 'all' || activeSection === 'pyqs') && (
                <div className="space-y-4 text-left">
                  {activeSection === 'all' && (
                    <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-800 border-b border-slate-100 pb-3">Interview PYQs</h3>
                  )}
                  <InterviewPYQSection
                    pyqs={filteredPyqs}
                    viewMode={viewMode}
                    canEdit={pyq => !isGuest && canEditResource(pyq, 'pyqs')}
                    onEditClick={pyq => setEditingResource({ data: pyq, type: 'pyqs' })}
                    onDeleteClick={pyq => setDeletingResource({ ...pyq, type: 'pyq' })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload button — logged-in managers only */}
        {canUpload && (
          <button
            className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white p-4.5 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-indigo-400/20"
            onClick={() => setIsUploadOpen(true)}
            title="Upload Resource"
          >
            <Icon name="Plus" size={20} />
          </button>
        )}

        {isUploadOpen && (
          <UploadModal
            isOpen
            onClose={() => setIsUploadOpen(false)}
            canUploadNotes={canUploadNotes}
            canUploadAll={canUploadAll}
          />
        )}

        {editingResource && (
          <EditResourceModal
            isOpen
            resource={editingResource.data}
            type={editingResource.type}
            onClose={() => setEditingResource(null)}
          />
        )}

        {deletingResource && (
          <DeleteResourceModal
            isOpen
            resource={deletingResource}
            onClose={() => setDeletingResource(null)}
          />
        )}

        {/* Signup modal */}
        {showAuthModal && (
          <SignupModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            message="Create an account to download and bookmark resources"
          />
        )}
      </div>
    </>
  );
};

export default ResourcesHub;