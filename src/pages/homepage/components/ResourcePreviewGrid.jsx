import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ResourcePreviewGrid = () => {
  const [hoveredResource, setHoveredResource] = useState(null);
  const navigate = useNavigate(); // ✅ Must be inside the component

  const trendingResources = [
    {
      id: 1,
      title: "Data Structures & Algorithms Complete Guide",
      type: "Study Material",
      subject: "Computer Science",
      downloads: 2847,
      rating: 4.9,
      difficulty: "Intermediate",
      thumbnail: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus Pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["DSA", "Coding", "Interviews"],
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Google Software Engineer Interview Questions 2024",
      type: "Interview PYQs",
      subject: "Technical Interviews",
      downloads: 1923,
      rating: 4.8,
      difficulty: "Advanced",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["Google", "System Design", "Coding"],
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      title: "Full Stack Developer Roadmap 2024",
      type: "Career Roadmap",
      subject: "Web Development",
      downloads: 3156,
      rating: 4.9,
      difficulty: "Beginner",
      thumbnail: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["React", "Node.js", "MongoDB"],
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      title: "Machine Learning Mathematics Essentials",
      type: "Study Material",
      subject: "Mathematics",
      downloads: 1654,
      rating: 4.7,
      difficulty: "Advanced",
      thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["Linear Algebra", "Statistics", "ML"],
      lastUpdated: "5 days ago"
    },
    {
      id: 5,
      title: "Product Management Case Studies",
      type: "Career Roadmap",
      subject: "Business",
      downloads: 987,
      rating: 4.6,
      difficulty: "Intermediate",
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["Strategy", "Analytics", "Leadership"],
      lastUpdated: "1 day ago"
    },
    {
      id: 6,
      title: "GATE Computer Science Previous Year Papers",
      type: "Interview PYQs",
      subject: "Competitive Exams",
      downloads: 4231,
      rating: 4.9,
      difficulty: "Advanced",
      thumbnail: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campuss pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["GATE", "CS", "Preparation"],
      lastUpdated: "4 days ago"
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Study Material': return 'BookOpen';
      case 'Interview PYQs': return 'MessageSquare';
      case 'Career Roadmap': return 'Map';
      default: return 'FileText';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-progress-emerald bg-emerald-50';
      case 'Intermediate': return 'text-achievement-amber bg-amber-50';
      case 'Advanced': return 'text-action-crimson bg-red-50';
      default: return 'text-insight-gray bg-gray-50';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal mb-4">
            Trending Resources
          </h2>
          <p className="text-xl text-insight-gray font-inter max-w-2xl mx-auto">
            Discover the most popular study materials, interview questions, and career roadmaps shared by our community
          </p>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {trendingResources?.map((resource) => (
            <div
              key={resource.id}
              className="knowledge-card bg-white rounded-xl overflow-hidden shadow-brand-md border border-slate-100 group cursor-pointer"
              onMouseEnter={() => setHoveredResource(resource.id)}
              onMouseLeave={() => setHoveredResource(null)}
            >
              {/* Resource Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 left-3">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <Icon name={getTypeIcon(resource.type)} size={14} color="var(--color-academic-blue)" />
                    <span className="text-xs font-inter font-medium text-academic-blue">{resource.type}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-inter font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                {hoveredResource === resource.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center text-white">
                      <div className="flex items-center justify-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                          <Icon name="Download" size={16} color="white" />
                          <span className="text-sm font-inter">{resource.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={16} color="#F59E0B" />
                          <span className="text-sm font-inter">{resource.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs opacity-80">Click to view details</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resource Content */}
              <div className="p-5">
                <h3 className="text-lg font-inter font-semibold text-wisdom-charcoal leading-tight group-hover:text-academic-blue transition-colors duration-300 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-insight-gray font-inter mb-4">{resource.subject}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-surface text-xs font-inter font-medium text-insight-gray rounded-md">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image src={resource.authorAvatar} alt={resource.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-inter font-medium text-wisdom-charcoal">{resource.author}</p>
                      <p className="text-xs text-insight-gray">{resource.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-insight-gray">
                    <div className="flex items-center space-x-1">
                      <Icon name="Download" size={12} />
                      <span>{resource.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={12} color="#F59E0B" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Resources Button */}
        <div className="text-center">
          <button
  onClick={() => navigate("/resources-hub")} // ✅ match the route exactly
  className="inline-flex items-center space-x-2 px-8 py-3 bg-academic-blue hover:bg-blue-700 text-white font-inter font-medium rounded-lg shadow-brand-md hover:shadow-brand-lg transition-all duration-300"
>
  <span>Explore All Resources</span>
  <Icon name="ArrowRight" size={18} />
</button>

        </div>
      </div>
    </section>
  );
};

export default ResourcePreviewGrid;
