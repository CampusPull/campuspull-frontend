import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/notificationContext";
import { ProfileContext } from "../../context/profileContext";

import { motion, AnimatePresence } from "framer-motion";

// --- Define Role Permissions ---
const roleFeatures = {
  admin: [
    "Home",
    "Feed", 
    "Resources Hub",
    "About CampusPull",
    "Community",
    "Events",
    "Announcement",
    "Profile",
    "Explore",
    "Chat",
    "Alumni Stories",
    "Mentorship",
    "Startup",
    "Admin Dashboard",
    "Internships",
  ],
  student: [
    "Home",
    "Feed",
    "Resources Hub",
    "About CampusPull",
    "Community",
    "Events",
    "Announcement",
    "Profile",
    "Explore",
    "Chat",
    "Alumni Stories",
    "Mentorship",
    "Startup",
    "Internships",
  ],
  alumni: [
    "Home",
    "Feed",
    "Resources Hub",
    "About CampusPull",
    "Community",
    "Events",
    "Profile",
    "Explore",
    "Chat",
    "Announcement",
    "Alumni Stories",
    "Mentorship",
    "Startup",
    "Internships",
  ],
  teacher: [
    "Home",
    "Feed",
    "Resources Hub",
    "About CampusPull",
    "Events",
    "Announcement",
    "Profile",
    "Explore",
    "Chat",
    "Alumni Stories",
    "Startup",
  ],
};
const Header = () => {
  const { user, logout } = useAuth();
  // 2. GET UNREAD COUNT
  const { unreadCount } = useNotification();
  // 3. GET PROFILE IMAGE (from profileContext)
  const { profile } = useContext(ProfileContext);
  const profileImage = profile?.profileImage || null;
  // Initials fallback from user name
  const initials = user?.name
    ? user.name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const mentorshipPath =
    user?.role === "alumni" ? "/mentorship/profile" : "/mentorship/mentors";

  const allNavigationItems = [
    { name: "Resources Hub", path: "/resources-hub", icon: "BookOpen" },
    { name: "Explore", path: "/explore", icon: "Compass" },
    { name: "Mentorship", path: mentorshipPath, icon: "UsersRound" },
    { name: "Community", path: "/community", icon: "Users" },
    { name: "Announcement", path: "/announcements", icon: "Megaphone" },
    { name: "Events", path: "/events", icon: "Calendar" },
    { name: "Startup", path: "/startups", icon: "Rocket" },
    { name: "Admin Dashboard", path: "/admin", icon: "ShieldCheck" },
    { name: "Chat", path: "/chatPage", icon: "MessageSquare" },
    { name: "Alumni Stories", path: "/feedback", icon: "Quote" },
    { name: "Profile", path: "/profile", icon: "User" },
    { name: "About CampusPull", path: "/about-link-mate", icon: "Info" },
    { name: "Internships", path: "/internships", icon: "Briefcase" },
  ];

  // const allowedFeatures = roleFeatures[user?.role] || [];
  const isGuest = !user;

    const guestFeatures = [ 
    "Resources Hub",
    "Explore",
    "Mentorship",
    "Community",
    "Events",
    "Startup",
    "Internships",
    "About CampusPull",
  ];

  const allowedFeatures = isGuest
    ? guestFeatures
    : roleFeatures[user?.role] || [];

  const authorizedItems = allNavigationItems.filter((item) =>
    allowedFeatures.includes(item.name) && item.name !== "Alumni Stories" && item.name !== "Profile"
  );

  const hamburgerItemNames = [
    "Profile",
    "About CampusPull",
    "Alumni Stories",
    "Admin Dashboard",
    "Chat",
    "Community",
    "Announcement",
    "Events",
  ]; // These will go in the hamburger menu
  const mainNavItems = authorizedItems.filter(
    (item) => !hamburgerItemNames.includes(item.name),
  );
  const menuNavItems = authorizedItems.filter((item) =>
    hamburgerItemNames.includes(item.name),
  );

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/homepage" className="flex items-center group">
              <motion.img 
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                src="/assets/images/logocampus.png" 
                alt="CampusPull Logo" 
                className="h-10 w-auto object-contain transition-all duration-300"
              />
            </Link> 
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden lg:flex items-center space-x-1"> */}
          {/* <nav className="flex items-center space-x-1"> */}
          <nav className="hidden xl:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <motion.div key={item.path} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-inter font-semibold transition-all duration-300 overflow-hidden group ${
                    isActivePath(item.path)
                      ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color={isActivePath(item.path) ? "#4338ca" : "currentColor"}
                     className="transition-transform group-hover:scale-110"
                  />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions (Notifications + Hamburger) */}
          <div className="flex items-center gap-2" ref={menuRef}>
            {/* Guest Auth Buttons (Desktop only) */}
            {isGuest && (
              <div className="hidden lg:flex items-center gap-2 mr-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-academic-blue bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?signup=true"
                  className="px-4 py-2 text-sm font-medium text-white bg-academic-blue hover:bg-blue-700 shadow-md rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* NOTIFICATION BELL ICON (Only for authenticated users) */}
            {!isGuest && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-full text-wisdom-charcoal hover:bg-slate-100 transition-colors mr-1"
              >
                <Icon name="Bell" size={24} />

                {/* The Red Badge Logic */}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* PROFILE AVATAR (Only for authenticated users) */}
            {!isGuest && (
              <Link
                to="/profile"
                title="My Profile"
                className={`relative flex-shrink-0 w-9 h-9 rounded-full ring-2 transition-all duration-200 overflow-hidden ${
                  location.pathname === "/profile"
                    ? "ring-academic-blue shadow-brand-sm"
                    : "ring-white/60 hover:ring-academic-blue hover:shadow-brand-sm"
                }`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
              </Link>
            )}

            {/* Hamburger Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-wisdom-charcoal hover:text-academic-blue"
              >
                <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
              </Button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-64 sm:w-72 bg-white/80 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh] py-2"
                  >
                    {/* Mobile/Tablet: Main items list (hidden on xl when desktop nav shows) */}
                    <div className="xl:hidden border-b border-slate-200/50 pb-2 mb-2 px-2">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-inter font-medium transition-colors ${
                            isActivePath(item.path)
                              ? "bg-indigo-50/80 text-indigo-700"
                              : "text-slate-700 hover:bg-white/60"
                          }`}
                        >
                          <Icon name={item.icon} size={18} />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Hamburger Only Items */}
                    <div className="px-2">
                      {menuNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-inter font-medium transition-colors ${
                            isActivePath(item.path)
                              ? "bg-indigo-50/80 text-indigo-700"
                              : "text-slate-700 hover:bg-white/60"
                          }`}
                        >
                          <Icon name={item.icon} size={18} />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-slate-200/50 my-1 mx-4"></div>

                    <div className="px-2">
                      {isGuest ? (
                        <Link
                          to="/auth"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-inter font-medium text-academic-blue hover:bg-blue-50/80 transition-colors"
                        >
                          <Icon name="LogIn" size={18} />
                          <span>Login</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-inter font-medium text-red-600 hover:bg-red-50/80 transition-colors"
                        >
                          <Icon name="LogOut" size={18} />
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
