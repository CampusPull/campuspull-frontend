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
    "Hiring Dashboard",
    "Analytics",
    "Admin Dashboard",
    "Candidates",
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
  const { unreadCount } = useNotification();
  const { profile } = useContext(ProfileContext);
  const profileImage = profile?.profileImage || null;
  const initials = user?.name
    ? user.name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const mentorshipPath =
    user?.role === "alumni" ? "/mentorship/profile" : "/mentorship/mentors";
  const isAdmin = user?.role === "admin";
  const internshipsPath = isAdmin ? "/admin/hiring-dashboard" : "/internships";

  const allNavigationItems = [
    { name: "Resources Hub", path: "/resources-hub", icon: "BookOpen" },
    { name: "Explore", path: "/explore", icon: "Compass" },
    { name: "Mentorship", path: mentorshipPath, icon: "UsersRound" },
    { name: "Community", path: "/community", icon: "Users" },
    { name: "Announcement", path: "/announcements", icon: "Megaphone" },
    { name: "Events", path: "/events", icon: "Calendar" },
    { name: "Startup", path: "/startups", icon: "Rocket" },
    { name: "Hiring Dashboard", path: "/admin/hiring-dashboard", icon: "LayoutDashboard" },
    { name: "Analytics", path: "/admin/analytics", icon: "BarChart2" },
    { name: "Admin Dashboard", path: "/admin", icon: "ShieldCheck" },
    { name: "Candidates", path: "/admin/applications", icon: "Users" },
    { name: "Chat", path: "/chatPage", icon: "MessageSquare" },
    { name: "Alumni Stories", path: "/feedback", icon: "Quote" },
    { name: "Profile", path: "/profile", icon: "User" },
    { name: "About CampusPull", path: "/about-link-mate", icon: "Info" },
    { name: "Internships", path: internshipsPath, icon: "Briefcase" },
    { name: "My Applications", path: "/applications", icon: "ClipboardList" },
  ];

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
    allowedFeatures.includes(item.name) && item.name !== "Alumni Stories"
  );

  const hamburgerItemNames = [
    "Profile",
    "About CampusPull",
    "Alumni Stories",
    "Hiring Dashboard",
    "Analytics",
    "Admin Dashboard",
    "Candidates",
    "Chat",
    "Community",
    "Announcement",
    "Events",
  ];
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

  // Determine if this is a dark theme landing page (Homepage)
  const isDarkPage = location.pathname === "/homepage" || location.pathname === "/";

  // Centralized GPU Scroll Visibility & Liquid States
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Throttled Scroll Listener using requestAnimationFrame
  useEffect(() => {
    let ticked = false;

    const handleScroll = () => {
      if (!ticked) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Throttled states
          setScrolled(currentScrollY > 15);

          // Normalized progress capped at 150px scroll
          const progress = Math.min(currentScrollY / 150, 1);
          setScrollProgress(progress);

          // Visibility toggle
          if (prefersReducedMotion) {
            setIsVisible(true);
          } else {
            if (currentScrollY < 10) {
              setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
              setIsVisible(false); // Scrolling down
            } else {
              setIsVisible(true); // Scrolling up
            }
          }

          setLastScrollY(currentScrollY);
          ticked = false;
        });
        ticked = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, prefersReducedMotion]);

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
    <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 px-6 pointer-events-none">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -110 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 28 }}
        className="w-full max-w-[1100px] mt-4 flex items-center justify-between gap-4 relative"
      >
        {/* 1. Logo Pill (Left Side) */}
        <div
          className={`pointer-events-auto rounded-full border transition-all duration-300 flex items-center flex-nowrap shrink-0 relative overflow-hidden ${scrolled
              ? isDarkPage
                ? "h-10 px-4 bg-slate-950/80 border-indigo-500/20 backdrop-blur-2xl shadow-lg text-white"
                : "h-10 px-4 bg-white/85 border-slate-200/80 backdrop-blur-2xl shadow-sm text-slate-800"
              : isDarkPage
                ? "h-12 px-5 bg-slate-950/45 border-white/10 backdrop-blur-xl text-white"
                : "h-12 px-5 bg-white/70 border-slate-200/50 backdrop-blur-xl shadow-sm text-slate-800"
            }`}
          style={{
            boxShadow: isDarkPage
              ? `0 8px 32px rgba(0,0,0,0.3), 0 0 ${scrollProgress * 6}px rgba(99, 102, 241, ${scrollProgress * 0.08})`
              : "0 4px 20px rgba(0,0,0,0.03)"
          }}
        >
          {isDarkPage && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] transition-all duration-500"
                style={{
                  backgroundPosition: `${(1 - scrollProgress) * 200}% 0`
                }}
              />
            </div>
          )}
          <Link to="/homepage" className="flex items-center group">
            <motion.img
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              src="/assets/images/logocampus.png"
              alt="CampusPull Logo"
              className={`transition-all duration-300 w-auto object-contain ${scrolled ? "h-7" : "h-8"} ${isDarkPage ? "brightness-110" : "brightness-100"}`}
            />
          </Link>
        </div>

        {/* 2. Navigation Pill (Exact Center, Hidden on Mobile/Tablet) */}
        <nav
          className={`pointer-events-auto hidden xl:flex items-center flex-nowrap shrink-0 gap-1.5 rounded-full border transition-all duration-300 relative overflow-hidden ${scrolled
              ? isDarkPage
                ? "h-10 px-5 bg-slate-950/80 border-indigo-500/20 backdrop-blur-2xl shadow-lg text-white"
                : "h-10 px-5 bg-white/85 border-slate-200/80 backdrop-blur-2xl shadow-sm text-slate-800"
              : isDarkPage
                ? "h-12 px-6 bg-slate-950/45 border-white/10 backdrop-blur-xl text-white"
                : "h-12 px-6 bg-white/70 border-slate-200/50 backdrop-blur-xl shadow-sm text-slate-800"
            }`}
          style={{
            boxShadow: isDarkPage
              ? `0 8px 32px rgba(0,0,0,0.3), 0 0 ${scrollProgress * 6}px rgba(99, 102, 241, ${scrollProgress * 0.08})`
              : "0 4px 20px rgba(0,0,0,0.03)"
          }}
        >
          {isDarkPage && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] transition-all duration-500"
                style={{
                  backgroundPosition: `${(1 - scrollProgress) * 200}% 0`
                }}
              />
            </div>
          )}
          {mainNavItems.map((item) => (
            <motion.div key={item.path} whileHover={prefersReducedMotion ? {} : { y: -1.5 }} whileTap={{ scale: 0.96 }}>
              <Link
                to={item.path}
                className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-inter transition-all duration-300 border ${isActivePath(item.path)
                    ? isDarkPage
                      ? "bg-white/15 border-white/20 text-white shadow-sm"
                      : "bg-slate-900/10 border-slate-900/15 text-slate-950 font-bold shadow-sm"
                    : isDarkPage
                      ? "border-transparent text-slate-300 hover:text-white hover:bg-white/5"
                      : "border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100/50"
                  }`}
              >
                <Icon
                  name={item.icon}
                  size={15}
                  color={isActivePath(item.path) ? (isDarkPage ? "#ffffff" : "#0f172a") : (isDarkPage ? "#cbd5e1" : "#475569")}
                  className="transition-transform group-hover:scale-105"
                />
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* 3. Actions & Hamburger Pill (Right Side) */}
        <div
          className={`pointer-events-auto rounded-full border transition-all duration-300 flex items-center flex-nowrap shrink-0 gap-2.5 relative ${scrolled
              ? isDarkPage
                ? "h-10 px-4 bg-slate-950/80 border-indigo-500/20 backdrop-blur-2xl shadow-lg text-white"
                : "h-10 px-4 bg-white/85 border-slate-200/80 backdrop-blur-2xl shadow-sm text-slate-800"
              : isDarkPage
                ? "h-12 px-5 bg-slate-950/45 border-white/10 backdrop-blur-xl text-white"
                : "h-12 px-5 bg-white/70 border-slate-200/50 backdrop-blur-xl shadow-sm text-slate-800"
            }`}
          style={{
            boxShadow: isDarkPage
              ? `0 8px 32px rgba(0,0,0,0.3), 0 0 ${scrollProgress * 6}px rgba(99, 102, 241, ${scrollProgress * 0.08})`
              : "0 4px 20px rgba(0,0,0,0.03)"
          }}
          ref={menuRef}
        >
          {isDarkPage && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] transition-all duration-500"
                style={{
                  backgroundPosition: `${(1 - scrollProgress) * 200}% 0`
                }}
              />
            </div>
          )}

          {/* Guest Auth Buttons (Desktop only) */}
          {isGuest && (
            <div className="hidden lg:flex items-center gap-2 mr-1 relative z-10 flex-nowrap whitespace-nowrap shrink-0">
              <Link
                to="/auth"
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap shrink-0 ${isDarkPage
                    ? "text-slate-300 bg-white/5 hover:bg-white/15"
                    : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                  }`}
              >
                Log In
              </Link>
              <Link
                to="/auth?signup=true"
                className="px-4 py-1.5 text-xs font-bold shadow-sm rounded-full transition-colors text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap shrink-0"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* NOTIFICATION BELL ICON (Only for authenticated users) */}
          {!isGuest && (
            <Link
              to="/notifications"
              className={`relative p-2 rounded-full transition-colors duration-200 mr-0.5 z-10 ${isDarkPage
                  ? "text-slate-300 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
            >
              <Icon name="Bell" size={20} />

              {/* The Red Badge Logic */}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* AIRBNB STYLE HAMBURGER & PROFILE PILL TRIGGER */}
          <div className="relative z-10">
            <div
              className={`flex items-center border rounded-full shadow-sm transition-all duration-200 ${isDarkPage && !scrolled
                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "border-slate-200/80 bg-slate-50/50 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
            >
              {/* Hamburger Button (Toggles menu) */}
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="pl-3.5 pr-2 py-1.5 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Toggle navigation menu"
              >
                <Icon name="Menu" size={17} />
              </button>

              {/* Separator line */}
              <div className={`w-[1px] h-4 ${isDarkPage && !scrolled ? "bg-white/10" : "bg-slate-200"}`} />

              {/* Profile Avatar Link (Redirects directly to profile) */}
              <Link
                to={isGuest ? "/auth" : "/profile"}
                className="pl-2 pr-2 py-1.5 flex items-center justify-center relative z-20"
                aria-label="View profile"
              >
                {!isGuest ? (
                  <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bold text-[9px] shadow-sm hover:scale-105 transition-transform ${profileImage ? "" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    }`}>
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={user?.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDarkPage && !scrolled ? "bg-white/10 hover:bg-white/20 text-zinc-400" : "bg-slate-200/80 hover:bg-slate-300/80 text-slate-500"
                    }`}>
                    <Icon name="User" size={14} />
                  </div>
                )}
              </Link>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-12 right-0 w-64 sm:w-72 border backdrop-blur-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh] py-2 z-50 ${isDarkPage
                      ? "bg-slate-950/95 border-slate-800/80 text-slate-300"
                      : "bg-white/95 border-slate-200/90 text-slate-700 shadow-2xl"
                    }`}
                >
                  {/* Mobile/Tablet: Main items list (hidden on xl when desktop nav shows) */}
                  <div className={`xl:hidden border-b pb-2 mb-2 px-2 ${isDarkPage ? "border-slate-900" : "border-slate-100"}`}>
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActivePath(item.path)
                            ? isDarkPage ? "bg-white/10 text-white" : "bg-slate-100 text-slate-950 font-bold"
                            : isDarkPage ? "hover:bg-white/5 hover:text-white" : "hover:bg-slate-50 hover:text-slate-950"
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
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActivePath(item.path)
                            ? isDarkPage ? "bg-white/10 text-white" : "bg-slate-100 text-slate-950 font-bold"
                            : isDarkPage ? "hover:bg-white/5 hover:text-white" : "hover:bg-slate-50 hover:text-slate-950"
                          }`}
                      >
                        <Icon name={item.icon} size={18} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className={`h-px my-1 mx-4 ${isDarkPage ? "bg-slate-900" : "bg-slate-100"}`}></div>

                  <div className="px-2">
                    {isGuest ? (
                      <>
                        <Link
                          to="/auth"
                          onClick={() => setIsMenuOpen(false)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isDarkPage ? "text-indigo-400 hover:bg-white/5" : "text-indigo-600 hover:bg-slate-50"
                            }`}
                        >
                          <Icon name="LogIn" size={18} />
                          <span>Login</span>
                        </Link>
                        <Link
                          to="/auth?signup=true"
                          onClick={() => setIsMenuOpen(false)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isDarkPage ? "text-indigo-400 hover:bg-white/5" : "text-indigo-600 hover:bg-slate-50"
                            }`}
                        >
                          <Icon name="UserPlus" size={18} />
                          <span>Sign Up</span>
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isDarkPage ? "text-red-400 hover:bg-white/5" : "text-red-600 hover:bg-slate-50"
                          }`}
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
      </motion.div>
    </div>);
};

export default Header;
