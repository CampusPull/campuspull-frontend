import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  // Satyam, I removed links like "Press", "Copyright", and "Technical Support" 
  // until you actually build those pages. 
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Explore Network", path: "/explore" },
        { name: "Community Forum", path: "/community" },
        { name: "Resources", path: "/resources" }
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
        { name: "About Campus-pull", path: "/about" },
        { name: "Our Mission", path: "/mission" },
        { name: "Careers", path: "/careers" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Guidelines", path: "/guidelines" }
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
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={24} color="white" />
              </div>
              <span className="text-xl font-bold">Campus-pull</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Bridging the gap between academic learning and professional success. Connect with mentors and accelerate your career.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((item) => (
                <div key={item.label}>
                  <div className="text-lg font-bold text-white">{item.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-slate-400 hover:text-white text-sm transition-colors">
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
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Campus-pull. Build with grit by Satyam.
          </p>
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} className="text-slate-500 hover:text-white transition-colors">
                <Icon name={social.icon} size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;