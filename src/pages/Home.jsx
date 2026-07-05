import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Hooked up React Router Navigation Link
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  // Local theme mirroring state
  const [isDark, setIsDark] = useState(false);

  // Live full-stack telemetry data states
  const [diagnostics, setDiagnostics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Checks the document element class to see if dark mode is active
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return () => observer.disconnect();
  }, []);

  // 📡 Live API Integration Link
  useEffect(() => {
    const fetchDiagnosticModules = async () => {
      try {
        setIsLoading(true);
        // Unified to match your active Prisma backend endpoint path
        const response = await fetch('http://localhost:5000/api/diagnostic-modules');
        
        if (!response.ok) {
          throw new Error(`HTTP pipeline connection error: ${response.status}`);
        }
        
        const data = await response.json();
        setDiagnostics(data);
      } catch (err) {
        console.warn('Backend offline or CORS restricted. Initializing local fallback data matrix.', err);
        // Fallback baseline array matching your assignment specifications if backend disconnects
        setDiagnostics([
          {
            id: 1,
            cropType: 'Mountain Crops',
            issueCategory: 'Pest',
            severity: 'High',
            status: 'active',
            description: 'Upload an image or describe crop symptoms in plain language to get localized, instant mitigation strategies optimized for mountain terrains.'
          },
          {
            id: 2,
            cropType: 'Soil Profiles',
            issueCategory: 'Nutrient',
            severity: 'Medium',
            status: 'active',
            description: 'Input historical soil data or observation logs to receive tailored organic and synthetic fertilizer optimization guidelines.'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosticModules();
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
        
        {/* Top Header Layout containing Title and the Management Button link */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6 gap-4">
          <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Diagnostic Core Modules
          </h2>
          
          {/* Convenient, customer-friendly button named according to function */}
          <Link
            to="/database-console"
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] text-center
              ${isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            ⚙️ Manage Diagnostic Modules
          </Link>
        </div>
        
        {/* Render loading spacer placeholder if async handshake is processing */}
        {isLoading ? (
          <div className="flex justify-center py-12 text-lg font-medium animate-pulse">
            Loading Live Telemetry From Backend Server...
          </div>
        ) : (
          /* Displaying Card components in your original responsive layout structure */
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            {diagnostics.map((item) => (
              <Card 
                key={item.id}
                icon={item.issueCategory === 'Pest' ? '🐛' : item.issueCategory === 'Nutrient' ? '🌱' : '🍂'}
                title={item.id <= 2 && diagnostics.length === 2 ? item.title || `${item.cropType} & Disease Identification` : `${item.cropType} - ${item.issueCategory} Optimization`} 
                description={item.description} 
              />
            ))}
          </div>
        )}
      </main>
      
      {/* 4. Footer */}
      <Footer />
    </div>
  );
}