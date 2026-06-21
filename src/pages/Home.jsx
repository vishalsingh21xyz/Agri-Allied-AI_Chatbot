import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  // Local theme mirroring state
  const [isDark, setIsDark] = useState(false);

  // Checks the document element class to see if dark mode is active
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return () => observer.disconnect();
  }, []);

  return (
    // Dynamically shifts background and base text colors while keeping your structural layout intact
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Navbar */}
      <Navbar />
      
      {/* 2. Hero Section */}
      <Hero />
      
      {/* 3. Main Area with a Grid layout for Cards */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <h2 className={`text-2xl font-bold mb-6 border-b pb-2 transition-colors duration-200 ${isDark ? 'text-slate-100 border-slate-800' : 'text-slate-900 border-slate-200'}`}>
          Diagnostic Core Modules
        </h2>
        
        {/* Displaying Card components in a responsive grid layout */}
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          <Card 
            icon="🐛"
            title="Pest & Disease Identification" 
            description="Upload an image or describe crop symptoms in plain language to get localized, instant mitigation strategies optimized for mountain terrains." 
          />
          <Card 
            icon="🌱"
            title="Soil & Nutrient Optimization" 
            description="Input historical soil data or observation logs to receive tailored organic and synthetic fertilizer optimization guidelines." 
          />
        </div>
      </main>
      
      {/* 4. Footer */}
      <Footer />
    </div>
  );
}