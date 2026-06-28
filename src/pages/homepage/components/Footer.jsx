import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Explore Network", path: "/explore" },
        { name: "Community Forum", path: "/community" },
        { name: "Resources", path: "/resources-hub" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "Feedback", path: "/feedback" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Campus-pull", path: "/about-link-mate" },
        { name: "Our Mission", path: "/our-mission" },
        { name: "Careers", path: "/internships" }
      ]
    }
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: "Linkedin", url: "http://linkedin.com/company/campus-pull" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com/linkemate" },
    { name: "YouTube", icon: "Youtube", url: "https://youtube.com/@campuspull" }
  ];

  // Satyam, these numbers are now realistic and not exaggerated.
  const achievements = [
    { label: "Active Students", value: "500+" },
    { label: "Alumni Mentors", value: "50+" },
    { label: "Universities", value: "10+" },
    { label: "Connections Made", value: "1,200+" }
  ];

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden border-t border-white/5">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Icon name="GraduationCap" size={22} color="white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                CampusPull
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-sm">
              Bridging the gap between academic learning and professional success. Connect with mentors, explore opportunities, and accelerate your career journey.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              {achievements.map((item) => (
                <div key={item.label} className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-3.5 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.05)] transition-all duration-300 group/stat">
                  <div className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-0.5">
                    {item.value}
                  </div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-widest font-bold font-inter">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.path} 
                        className="text-slate-400 hover:text-white hover:translate-x-1.5 inline-block transition-all duration-300 text-xs font-medium"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 text-xs font-medium">
            © {currentYear} CampusPull. All rights reserved.
          </p>
          <div className="flex space-x-3">
            {socialLinks.map((social) => (
              <a 
                key={social.name} 
                href={social.url} 
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <Icon name={social.icon} size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;