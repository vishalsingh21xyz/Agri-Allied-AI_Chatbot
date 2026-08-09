import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live user-scoped data from Express backend
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please sign in.');
      }

      const response = await fetch(`${API_BASE_URL}/api/diagnostic-modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard records.');
      }

      setUserItems(data.data || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Farmer Dashboard
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Welcome back! Review your saved crop health history and diagnostic telemetry.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="self-start md:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Responsible AI Notice */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl mb-8">
          <p className="text-emerald-900 text-sm font-medium">
            🛡️ Responsible AI Guardrails are active to ensure high-stakes crop decision verification.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your diagnostic history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && userItems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm">
            <span className="text-4xl">📂</span>
            <h3 className="text-lg font-bold text-slate-800 mt-3">No Diagnostic Records Found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              Your saved crop history is currently empty. Head over to the AI Crop Assistant to run and save your first diagnosis.
            </p>
          </div>
        )}

        {/* Data Cards Grid */}
        {!loading && !error && userItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {item.cropType || item.category || 'Wheat'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {item.title || item.cropType || `Diagnostic #${index + 1}`}
                </h4>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {item.symptoms || item.description || 'Verified pathology report logged to cloud database.'}
                </p>
                {item.location && (
                  <div className="text-xs text-slate-500 flex items-center gap-1 border-t border-slate-100 pt-3">
                    <span>📍</span> {item.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}