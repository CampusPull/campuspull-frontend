import React from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import ResourcePreviewGrid from './components/ResourcePreviewGrid';
import AlumniSpotlight from './components/AlumniSpotlight';
import CommunityFeed from './components/CommunityFeed';
import MobileSearchBar from './components/MobileSearchBar';
import Footer from './components/Footer';
import PodcastSection from './components/podcastSection';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Mobile Search Bar */}
      <MobileSearchBar />
      
      {/* Main Content */}
      <main className="pt-16 lg:pt-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Podcast Section */}
        <PodcastSection />
        
        {/* Alumni Spotlight */}
        <AlumniSpotlight />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;