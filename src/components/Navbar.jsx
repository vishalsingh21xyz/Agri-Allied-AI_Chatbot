import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Toggles the 'dark' utility class on the HTML root element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center transition-colors dark:bg-slate-900 dark:border-slate-800">
      <Link to="/" className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
        Agri-Allied AI
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-sm font-medium hover:text-emerald-600 dark:text-slate-300">
          Dashboard
        </Link>
        <Link to="/demo" className="text-sm font-medium hover:text-emerald-600 dark:text-slate-300">
          UI Demo
        </Link>
        
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all font-medium text-sm"
          aria-label="Toggle Theme Mode"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}