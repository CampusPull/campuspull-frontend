import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FounderStory from './components/FounderStory';
import UniversityPartnerships from './components/UniversityPartnerships';
import ImpactMetrics from './components/ImpactMetrics';
import TeamProfiles from './components/TeamProfiles';
import PlatformEvolution from './components/PlatformEvolution';
import ValuesAndPrinciples from './components/ValuesAndPrinciples';

const AboutLinkMate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Campus-Pull - Knowledge Without Boundaries | Educational Networking Platform</title>
        <meta name="description" content="Discover LinkMate's mission to transform university networking by connecting students with successful alumni. Learn about our founding story, impact metrics, team, and values that drive educational excellence." />
        <meta name="keywords" content="LinkMate about, educational networking, student mentorship, alumni connections, university partnerships, educational platform story" />
        <meta property="og:title" content="About LinkMate - Knowledge Without Boundaries" />
        <meta property="og:description" content="Learn how LinkMate is revolutionizing educational networking by bridging the gap between students and alumni through meaningful connections and quality resources." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/about-link-mate" />
      </Helmet>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <FounderStory />
        <UniversityPartnerships />
        <ImpactMetrics />
        <TeamProfiles />
        <PlatformEvolution />
        <ValuesAndPrinciples />
      </main>
      {/* Footer */}
      <footer className="bg-wisdom-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-academic-blue to-credibility-indigo rounded-lg flex items-center justify-center">
                  <span className="text-white font-poppins font-bold text-lg">L</span>
                </div>
                <div>
                  <h3 className="text-2xl font-poppins font-bold">Campus-Pull</h3>
                  <p className="text-sm opacity-80 font-inter">Knowledge Without Boundaries</p>
                </div>
              </div>
              <p className="text-opacity-80 text-white font-inter leading-relaxed mb-6 max-w-md">
                Transforming university networking by connecting ambitious students with successful alumni through meaningful mentorship and quality resources.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-academic-blue transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-inter">f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-academic-blue transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-inter">t</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-academic-blue transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-inter">in</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-academic-blue transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-inter">ig</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-poppins font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/homepage" },
                  { name: "Resources Hub", href: "/resources-hub" },
                  { name: "About Us", href: "/about-link-mate" },
                  { name: "Contact", href: "#" }
                ]?.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link?.href}
                      className="text-white/80 hover:text-achievement-amber transition-colors duration-300 font-inter"
                    >
                      {link?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-poppins font-semibold mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <div className="text-white/80 font-inter">
                  <p className="text-sm">Email us at:</p>
                  <p className="text-achievement-amber">campuspull.in@gmail.com</p>
                </div>
                <div className="text-white/80 font-inter">
                  <p className="text-sm">Call us:</p>
                  <p className="text-achievement-amber">+91 9045341537</p>
                  <p className="text-achievement-amber">+91 9289483759</p>
                </div>
                <div className="text-white/80 font-inter">
                  <p className="text-sm">Address:</p>
                  <p>Ghaziabad, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 font-inter text-sm">
              © {new Date()?.getFullYear()} Campus-Pull. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 font-inter text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 font-inter text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 font-inter text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutLinkMate;
