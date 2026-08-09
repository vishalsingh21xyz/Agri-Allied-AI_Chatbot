import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AIDiagnostic from '../components/AIDiagnostic';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/diagnostic-modules`;

export default function DatabaseConsole() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    cropType: '',
    issueCategory: '',
    severity: 'Medium',
    status: 'Pending',
    description: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Helper to get Authorization Header & check token validity
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Your session has expired. Please log in again.');
      navigate('/login');
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Helper to handle authentication errors gracefully
  const handleAuthError = (res, data) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Session expired or invalid token. Redirecting to login.');
      navigate('/login');
      return true;
    }
    return false;
  };

  // 1. FETCH ALL RECORDS (GET)
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch records from database.');
      const data = await res.json();
      
      // Support array or object formats (e.g. { data: [...] })
      const recordsList = Array.isArray(data) ? data : (data.data || []);
      setRecords(recordsList);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 2. CREATE RECORD (POST with Bearer Token)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (handleAuthError(res, data)) return;

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create record.');
      }

      // Reset form
      setFormData({
        cropType: '',
        issueCategory: '',
        severity: 'Medium',
        status: 'Pending',
        description: ''
      });
      
      // Update local state directly for instant feedback and fetch latest data
      const newEntry = data.data || data;
      if (newEntry && newEntry.id) {
        setRecords((prev) => [newEntry, ...prev]);
      }
      fetchRecords();
    } catch (err) {
      alert(`Error submitting record: ${err.message}`);
    }
  };

  // 3. UPDATE STATUS (PUT with Bearer Token)
  const handleStatusChange = async (id, newStatus) => {
    const target = records.find(r => r.id === id);
    if (!target) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...target, status: newStatus })
      });

      const data = await res.json();
      
      if (handleAuthError(res, data)) return;

      if (!res.ok) throw new Error(data.error || data.message || 'Failed to update record.');

      fetchRecords();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // 4. DELETE RECORD (DELETE with Bearer Token)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diagnostic entry?')) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers
      });

      const data = await res.json();

      if (handleAuthError(res, data)) return;

      if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete record.');

      // Remove item immediately from UI
      setRecords((prev) => prev.filter((r) => r.id !== id));
      fetchRecords();
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  // 5. LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>🌱</span> Diagnostic Module Cloud Console
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Logged in as: <strong className="text-green-700">{user.email || 'Authenticated User'}</strong>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              Sign Out
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* AI Diagnostic Assistant Component */}
        <div className="mb-8">
          <AIDiagnostic />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create Record Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>➕</span> Add New Diagnostic Entry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Crop Type</label>
                <input
                  type="text"
                  placeholder="e.g. Wheat, Paddy, Tomato"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Issue Category</label>
                <input
                  type="text"
                  placeholder="e.g. Yellow Rust, Stem Borer"
                  value={formData.issueCategory}
                  onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-600 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Notes / Description</label>
                <textarea
                  rows="3"
                  placeholder="Symptoms observed..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg text-sm transition shadow-sm"
              >
                Submit to Cloud DB
              </button>
            </form>
          </div>

          {/* Records Table View */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Live Cloud Database Records
              </h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {records.length} Total
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 font-medium">
                Syncing with Cloud Database...
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                {error}
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                No diagnostic modules found in cloud storage.<br />
                Fill out the form on the left to insert an entry.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Crop / Issue</th>
                      <th className="py-3 px-3">Severity</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((rec, idx) => (
                      <tr key={rec.id || idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{rec.cropType}</div>
                          <div className="text-xs text-slate-500">{rec.issueCategory || rec.category}</div>
                          {rec.description && (
                            <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{rec.description}</div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            rec.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                            rec.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            rec.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {rec.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={rec.status || 'Pending'}
                            onChange={(e) => handleStatusChange(rec.id, e.target.value)}
                            className="text-xs font-medium border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-600"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}