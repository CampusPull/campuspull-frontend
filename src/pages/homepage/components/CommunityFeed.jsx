import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CommunityFeed = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discussions');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = currentTime;
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatEventDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date?.toLocaleDateString('en-US', options);
  };

  const recentDiscussions = [
    {
      id: 1,
      title: "Best approach for System Design interviews at FAANG?",
      author: "Priya Sharma",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      category: "Interview Prep",
      replies: 23,
      likes: 45,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      tags: ["System Design", "FAANG", "Interviews"],
      isHot: true
    },
    {
      id: 2,
      title: "Data Structures study group - Week 3 progress",
      author: "Rahul Kumar",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      category: "Study Groups",
      replies: 12,
      likes: 28,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      tags: ["DSA", "Study Group", "Progress"],
      isHot: false
    }
  ];

  const newResources = [
    {
      id: 1,
      title: "Complete React.js Interview Questions 2024",
      author: "Vikram Singh",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      type: "Interview PYQs",
      downloads: 234,
      rating: 4.8,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      thumbnail: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "System Design Masterclass with Google Engineer",
      speaker: "Amit Gupta",
      speakerAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Google",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "7:00 PM IST",
      attendees: 234,
      type: "Webinar",
      isLive: false
    }
  ];

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: 'MessageSquare', count: recentDiscussions?.length },
    { id: 'resources', label: 'New Resources', icon: 'BookOpen', count: newResources?.length },
    { id: 'events', label: 'Events', icon: 'Calendar', count: upcomingEvents?.length }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal mb-4">
            Live Community Activity
          </h2>
          <p className="text-xl text-insight-gray font-inter max-w-2xl mx-auto">
            Stay connected with real-time discussions, fresh resources, and upcoming events from our vibrant community
          </p>
        </div>

        {/* Activity Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex bg-surface rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-inter font-medium transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-white text-academic-blue shadow-brand-sm' : 'text-insight-gray hover:text-wisdom-charcoal'
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-academic-blue text-white' : 'bg-white text-insight-gray'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {/* Discussions */}
          {activeTab === 'discussions' &&
            recentDiscussions.map((discussion) => (
              <div key={discussion.id} className="knowledge-card bg-white rounded-xl p-6 shadow-md mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src={discussion.authorAvatar} alt={discussion.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{discussion.title}</h3>
                    <p className="text-sm text-gray-500">{discussion.author} • {discussion.category}</p>
                  </div>
                </div>
              </div>
            ))
          }

          {/* Resources */}
          {activeTab === 'resources' &&
            newResources.map((resource) => (
              <div key={resource.id} className="knowledge-card bg-white rounded-xl p-6 shadow-md mb-4 flex space-x-4">
                <div className="w-16 h-16 overflow-hidden rounded-lg">
                  <Image src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.author} • {resource.type}</p>
                </div>
              </div>
            ))
          }

          {/* Events */}
          {activeTab === 'events' &&
            upcomingEvents.map((event) => (
              <div key={event.id} className="knowledge-card bg-white rounded-xl p-6 shadow-md mb-4 flex space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white">
                  <span className="text-xs">{formatEventDate(event.date)?.split(' ')[0]}</span>
                  <span className="text-lg font-bold">{formatEventDate(event.date)?.split(' ')[2]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.speaker} • {event.company} • {event.time}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Join Community Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/community')}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-white hover:bg-academic-blue text-academic-blue hover:text-white border-2 border-academic-blue rounded-lg transition-all duration-300"
          >
            <span>Join Community</span>
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;
