import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import VideoSection from '../components/home/VideoSection';
import Contact from '../components/home/Contact';
import Footer from '../components/home/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar transparent={true} />
      <Hero />
      <About />
      <VideoSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;