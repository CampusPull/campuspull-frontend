import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/notificationContext';

// --- Define Role Permissions ---
const roleFeatures = {
  admin: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Announcement', 'Profile', 'Explore', 'Chat', 'Alumni Stories', 'Mentorship', 'Startup Page', 'Admin Dashboard', 'Jobs & Internships'],
  student: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Announcement', 'Profile', 'Explore', 'Chat', 'Alumni Stories', 'Mentorship', 'Startup Page', 'Jobs & Internships'],
  alumni: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Community', 'Events', 'Profile', 'Explore', 'Chat', 'Announcement', 'Alumni Stories', 'Mentorship', 'Startup Page', 'Jobs & Internships'],
  teacher: ['Home', 'Feed', 'Resources Hub', 'About CampusPull', 'Events', 'Announcement', 'Profile', 'Explore', 'Chat', 'Alumni Stories','Startup Page', 'Jobs & Internships'],
};

const Header = () => {
  const { user, logout } = useAuth();
  // 2. GET UNREAD COUNT
  const { unreadCount } = useNotification(); 
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const mentorshipPath =
  user?.role === "alumni"
    ? "/mentorship/profile"
    : "/mentorship/mentors";

  const allNavigationItems = [
    { name: 'Resources Hub', path: '/resources-hub', icon: 'BookOpen' },
    { name: 'Explore', path: '/explore', icon: 'Compass' },
    { name: 'Mentorship', path: mentorshipPath, icon: 'UsersRound' },
    { name: 'Community', path: '/community', icon: 'Users' },
    { name: 'Announcement', path: '/announcements', icon: 'Megaphone' },
    { name: 'Events', path: '/events', icon: 'Calendar' },
    {name: 'Startup Page', path: '/startups', icon: 'Rocket'},
    {name: 'Jobs & Internships', path: '/jobs', icon: 'Briefcase'},
    {name: 'Admin Dashboard', path: '/admin', icon: 'ShieldCheck' },
    { name: 'Chat', path: '/chatPage', icon: 'MessageSquare' },
    { name: 'Alumni Stories', path: '/feedback', icon: 'Quote' },
    { name: 'Profile', path: '/profile', icon: 'User' },
    { name: 'About CampusPull', path: '/about-link-mate', icon: 'Info' },
  ];

  const allowedFeatures = roleFeatures[user?.role] || [];
  const authorizedItems = allNavigationItems.filter(item =>
    allowedFeatures.includes(item.name)
  );

  const hamburgerItemNames = [ 'Profile', 'About CampusPull', 'Alumni Stories', 'Admin Dashboard' ]; // These will go in the hamburger menu
  const mainNavItems = authorizedItems.filter(item => !hamburgerItemNames.includes(item.name));
  const menuNavItems = authorizedItems.filter(item => hamburgerItemNames.includes(item.name));

  const isActivePath = (path) => {
  if (path.startsWith("/mentorship")) {
    return location.pathname.startsWith("/mentorship");
  }
  return location.pathname === path;
};

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-brand-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/homepage" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-all duration-300">
                  <Icon name="GraduationCap" size={24} color="white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-achievement-amber rounded-full flex items-center justify-center">
                  <Icon name="Sparkles" size={10} color="white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-poppins font-bold text-wisdom-charcoal group-hover:text-academic-blue transition-colors duration-300">
                  CampusPull
                </h1>
                <p className="text-xs text-insight-gray font-inter">Knowledge Without Boundaries</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-inter font-medium transition-all duration-300 ${
                  isActivePath(item.path)
                    ? 'bg-academic-blue text-white shadow-brand-sm'
                    : 'text-wisdom-charcoal hover:bg-surface hover:text-academic-blue'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  color={isActivePath(item.path) ? 'white' : 'currentColor'}
                />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions (Notifications + Hamburger) */}
          <div className="flex items-center gap-2" ref={menuRef}>

            {/* 3. NOTIFICATION BELL ICON */}
            <Link 
              to="/notifications" 
              className="relative p-2 rounded-full text-wisdom-charcoal hover:bg-slate-100 transition-colors mr-1"
            >
              <Icon name="Bell" size={24} />
              
              {/* The Red Badge Logic */}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Hamburger Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-wisdom-charcoal hover:text-academic-blue"
              >
                <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
              </Button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-12 right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-brand-lg overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Mobile-only: Main items list */}
                  <div className="lg:hidden border-b border-slate-100 pb-2 mb-2">
                     {mainNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm font-inter font-medium transition-colors ${
                          isActivePath(item.path)
                            ? 'bg-blue-50 text-academic-blue'
                            : 'text-wisdom-charcoal hover:bg-slate-50'
                        }`}
                      >
                        <Icon name={item.icon} size={18} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Hamburger Only Items */}
                  {menuNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-inter font-medium transition-colors ${
                        isActivePath(item.path)
                          ? 'bg-blue-50 text-academic-blue'
                          : 'text-wisdom-charcoal hover:bg-slate-50'
                      }`}
                    >
                      <Icon name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  <div className="h-px bg-slate-100 my-1 mx-4"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-inter font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Icon name="LogOut" size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;