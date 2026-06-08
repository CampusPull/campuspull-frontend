import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FounderStory from './components/FounderStory';
import UniversityPartnerships from './components/UniversityPartnerships';
import TeamProfiles from './components/TeamProfiles';
import ValuesAndPrinciples from './components/ValuesAndPrinciples';
import Footer from '../homepage/components/Footer';

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
      <main className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        <HeroSection />
        <FounderStory />
        <UniversityPartnerships />
        <TeamProfiles />
        <ValuesAndPrinciples />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutLinkMate;
