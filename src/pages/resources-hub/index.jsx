import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import ResourceCard from './components/ResourceCard';
import CareerRoadmapCard from './components/CareerRoadmapCard';
import InterviewPYQSection from './components/InterviewPYQSection';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { ResourceContext } from '../../context/resourceContext';
import UploadModal from './components/uploadModel';
import EditResourceModal from './components/EditResourceModal';
import DeleteResourceModal from './components/DeleteResouceModal';
import { useAuth } from '../../context/AuthContext';

const ResourcesHub = () => {
  const {
    resources,
    roadmaps,
    pyqs,
    loading,
    canEditResource,
    deleteResource,
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

  // ===== Upload permissions (backend-aligned)
  const canUploadNotes = ['admin', 'teacher', 'alumni'].includes(user?.role);
  const canUploadAll = user?.role === 'admin';
  const canUpload = canUploadNotes || canUploadAll;

  // ===== Filter logic
  const filteredResources = resources?.filter(resource => {
    if (
      searchQuery &&
      !resource?.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    for (const [key, values] of Object.entries(filters)) {
      if (values?.length > 0 && !values.includes(resource?.[key])) return false;
    }

    return true;
  });

  const sortedResources = [...(filteredResources || [])].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
      case 'downloads':
        return (b.downloads || 0) - (a.downloads || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const filteredRoadmaps = roadmaps?.filter(r =>
    !searchQuery ||
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPyqs = pyqs?.filter(p =>
    !searchQuery ||
    p.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===== Counts
  let displayedCount = 0;
  if (activeSection === 'all') {
    displayedCount =
      (sortedResources?.length || 0) +
      (filteredRoadmaps?.length || 0) +
      (filteredPyqs?.length || 0);
  } else if (activeSection === 'notes') {
    displayedCount = sortedResources?.length || 0;
  } else if (activeSection === 'roadmaps') {
    displayedCount = filteredRoadmaps?.length || 0;
  } else if (activeSection === 'pyqs') {
    displayedCount = filteredPyqs?.length || 0;
  }

  const totalRawCount =
    (resources?.length || 0) +
    (roadmaps?.length || 0) +
    (pyqs?.length || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex">
          <div className="w-80 bg-white border-r border-slate-200 shadow-brand-sm p-4">
            <div className="h-8 bg-slate-200 rounded animate-pulse mb-4"></div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-200 rounded animate-pulse mb-2"></div>
            ))}
          </div>
          <div className="flex-1 p-6">
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

      <div className="min-h-screen bg-background relative">
        <Header />

        <div className="pt-16 flex">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile={false}
              onClose={() => {}}
            />
          </div>

          {isMobileFilterOpen && (
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile
              onClose={() => setIsMobileFilterOpen(false)}
            />
          )}

          <div className="flex-1 min-w-0 p-4 lg:p-6 space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-r from-academic-blue to-credibility-indigo rounded-2xl p-8 text-white">
              <h1 className="font-poppins font-bold text-3xl lg:text-4xl mb-4">
                Resources Hub
              </h1>
              <p className="text-lg text-white text-opacity-90 mb-6">
                Discover comprehensive study materials, career roadmaps, and interview questions.
              </p>
            </div>

            {/* Search */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
              isMobile={typeof window !== 'undefined' && window.innerWidth < 1024}
            />

            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-1 shadow-brand-sm overflow-x-auto">
              {[
                { key: 'all', label: `All Resources (${totalRawCount})`, icon: 'Grid3X3' },
                { key: 'notes', label: `Study Notes (${resources?.length || 0})`, icon: 'FileText' },
                { key: 'roadmaps', label: `Career Roadmaps (${roadmaps?.length || 0})`, icon: 'Route' },
                { key: 'pyqs', label: `Interview PYQs (${pyqs?.length || 0})`, icon: 'MessageCircle' },
              ].map(section => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeSection === section.key
                      ? 'bg-academic-blue text-white shadow-brand-sm'
                      : 'text-wisdom-charcoal hover:bg-surface'
                  }`}
                >
                  <Icon name={section.icon} size={16} />
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

            {/* ===== NOTES ===== */}
            {(activeSection === 'all' || activeSection === 'notes') && (
              <div className="space-y-4">
                {activeSection === 'all' && (
                  <h3 className="text-xl font-bold text-wisdom-charcoal">
                    Study Notes
                  </h3>
                )}

                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {sortedResources.map(resource => (
                    <ResourceCard
                      key={resource._id}
                      resource={resource}
                      viewMode={viewMode}
                      canEdit={canEditResource(resource, 'notes')}
                      onEditClick={() =>
                        setEditingResource({ data: resource, type: 'notes' })
                      }
                      onDeleteClick={() =>
                        deleteResource(resource._id, 'notes')
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ===== ROADMAPS ===== */}
            {(activeSection === 'all' || activeSection === 'roadmaps') && (
              <div className="space-y-4">
                {activeSection === 'all' && (
                  <h3 className="text-xl font-bold text-wisdom-charcoal">
                    Career Roadmaps
                  </h3>
                )}

                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 lg:grid-cols-2'
                    : 'grid-cols-1'
                }`}>
                  {filteredRoadmaps.map(roadmap => (
                    <CareerRoadmapCard
                      key={roadmap._id}
                      roadmap={roadmap}
                      viewMode={viewMode}
                      canEdit={canEditResource(roadmap, 'roadmaps')}
                      onEditClick={() =>
                        setEditingResource({ data: roadmap, type: 'roadmaps' })
                      }
                      onDeleteClick={() =>
                        deleteResource(roadmap._id, 'roadmaps')
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ===== PYQS ===== */}
            {(activeSection === 'all' || activeSection === 'pyqs') && (
              <div className="space-y-4">
                {activeSection === 'all' && (
                  <h3 className="text-xl font-bold text-wisdom-charcoal">
                    Interview PYQs
                  </h3>
                )}

                <InterviewPYQSection
                  pyqs={filteredPyqs}
                  viewMode={viewMode}
                  canEdit={pyq => canEditResource(pyq, 'pyqs')}
                  onEditClick={pyq =>
                    setEditingResource({ data: pyq, type: 'pyqs' })
                  }
                  onDeleteClick={pyq =>
                    deleteResource(pyq._id, 'pyqs')
                  }
                />
              </div>
            )}
          </div>
        </div>

        {canUpload && (
          <button
            className="fixed bottom-6 right-6 bg-academic-blue hover:bg-academic-blue-dark text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-transform hover:scale-105"
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
      </div>
    </>
  );
};

export default ResourcesHub;
