import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';
import { Loader, Toast } from '../components/ui/Index'; // Tracks loading states and error notifications

export default function Home() {
  // Local theme mirroring state
  const [isDark, setIsDark] = useState(false);
  
  // Async communication states
  const [diagnostics, setDiagnostics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorToast, setErrorToast] = useState('');

  // Checks the document element class to see if dark mode is active
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return () => observer.disconnect();
  }, []);

  // Fetches live dynamic records directly from your Express backend server
  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/diagnostics');
        
        if (!response.ok) {
          throw new Error(`Server returned status code: ${response.status}`);
        }
        
        const data = await response.json();
        setDiagnostics(data);
      } catch (err) {
        console.error('API Connection Error:', err);
        setErrorToast('Could not fetch latest diagnostics from backend. Running offline mode.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnostics();
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
        
        {/* Render loading animation block if async data transfer is pending */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader fullScreen={false} />
          </div>
        ) : (
          /* Displaying Card components in a responsive grid layout dynamically mapped from your backend */
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            {diagnostics.map((item) => (
              <Card 
                key={item.id}
                icon={item.issueCategory === 'Pest' ? '🐛' : item.issueCategory === 'Nutrient' ? '🌱' : '🍂'}
                title={`${item.cropType} - ${item.issueCategory}`} 
                description={`${item.description} [Status: ${item.status.toUpperCase()} | Severity: ${item.severity}]`} 
              />
            ))}
          </div>
        )}
      </main>
      
      {/* 4. Footer */}
      <Footer />

      {/* Pop up warning notification banner if the network request fails */}
      {errorToast && (
        <Toast 
          message={errorToast} 
          isVisible={!!errorToast} 
          onClose={() => setErrorToast('')} 
        />
      )}
    </div>
  );
}