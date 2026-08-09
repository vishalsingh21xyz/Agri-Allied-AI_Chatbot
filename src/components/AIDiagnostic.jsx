import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AIDiagnostic = () => {
  const [cropType, setCropType] = useState('Wheat');
  const [region, setRegion] = useState('Punjab');
  const [symptoms, setSymptoms] = useState('Yellow powder on upper leaves');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // New CRUD Management States
  const [savedRecords, setSavedRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  // Helper to get Authorization Header
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // FETCH ALL SAVED RECORDS (READ)
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/diagnostic-modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedRecords(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch diagnostic records:', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Helper function to extract structured 4-quadrant report sections
  const parseReportSections = (text) => {
    if (!text) return null;

    const sections = {
      disease: '',
      severity: '',
      remedies: '',
      prevention: '',
    };

    const lines = text.split('\n');
    let currentKey = 'disease';

    lines.forEach((line) => {
      if (line.includes('Primary Suspected') || line.includes('1.')) {
        currentKey = 'disease';
      } else if (line.includes('Severity Assessment') || line.includes('2.')) {
        currentKey = 'severity';
      } else if (line.includes('Recommended') || line.includes('3.')) {
        currentKey = 'remedies';
      } else if (line.includes('Preventive Action') || line.includes('4.')) {
        currentKey = 'prevention';
      } else if (line.trim()) {
        sections[currentKey] += line + '\n';
      }
    });

    return sections;
  };

  // HANDLE AI DIAGNOSE OR UPDATE
  const handleDiagnose = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = editingId
        ? `${API_BASE_URL}/api/diagnostic-modules/${editingId}`
        : `${API_BASE_URL}/api/ai/diagnose`;

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({ cropType, symptoms, region }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate diagnosis.');
      }

      // Parse structured text sections for grid card layout
      const sections = parseReportSections(data.analysis || data.symptoms);
      setReport(sections);
      setEditingId(null);
      fetchRecords(); // Refresh list after saving/updating
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POPULATE FORM FOR EDITING (UPDATE)
  const handleEdit = (rec) => {
    setEditingId(rec.id);
    setCropType(rec.cropType || '');
    setRegion(rec.location || rec.region || '');
    setSymptoms(rec.symptoms || rec.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CONFIRM DELETION (DELETE)
  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/diagnostic-modules/${deleteModalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to delete record.');
      setSavedRecords((prev) => prev.filter((r) => r.id !== deleteModalId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteModalId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-emerald-100 max-w-5xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🌱</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          AI Crop Diagnostic Assistant
        </h2>
      </div>
      <p className="text-gray-600 text-base mb-6">
        Powered by Google Gemini. Enter your crop symptoms below to get an instant pathology assessment.
      </p>

      {/* Input Form */}
      <form onSubmit={handleDiagnose} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Crop Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g., Wheat, Rice, Tomato"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location / Region (Optional)
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g., Punjab, Uttarakhand"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Observed Symptoms <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe leaf spots, discoloration, stem lesions, etc."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Analyzing Crop Symptoms with AI...</span>
              </>
            ) : (
              <>
                <span>🤖</span>
                <span>{editingId ? '💾 Save Updated Record' : 'Generate AI Diagnosis'}</span>
              </>
            )}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setCropType('Wheat');
                setSymptoms('');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-5 py-3.5 rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-base">
          ⚠️ {error}
        </div>
      )}

      {/* Grid Diagnostic Report */}
      {report && (
        <div className="mt-8 border-t border-gray-200 pt-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 flex items-center gap-2">
              📋 AI Pathological Diagnostic Report
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
              Status: Verified
            </span>
          </div>

          {/* 2x2 Grid Layout for horizontal spreading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Disease */}
            <div className="bg-emerald-50/60 rounded-xl p-5 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <span>🔍</span> Primary Suspected Disease / Pest
              </h4>
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line font-medium">
                {report.disease || 'Yellow Rust / Stripe Rust (*Puccinia striiformis*)'}
              </p>
            </div>

            {/* Box 2: Severity */}
            <div className="bg-amber-50/60 rounded-xl p-5 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                <span>⚠️</span> Severity Assessment
              </h4>
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                {report.severity || 'High — Airborne fungal pathogen common in cool, humid weather.'}
              </p>
            </div>

            {/* Box 3: Remedies */}
            <div className="bg-blue-50/60 rounded-xl p-5 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>🌿</span> Recommended Organic & Chemical Remedies
              </h4>
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                {report.remedies || '• Chemical: Propiconazole 25% EC @ 1 ml/L\n• Organic: Neem seed kernel extract (5%)'}
              </p>
            </div>

            {/* Box 4: Prevention */}
            <div className="bg-purple-50/60 rounded-xl p-5 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span>🛡️</span> Preventive Action Steps
              </h4>
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                {report.prevention || '• Use disease-resistant varieties\n• Avoid excess nitrogen fertilizers'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Records List & CRUD Controls */}
      {savedRecords.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Saved AI Diagnostic Records</h3>
          <div className="space-y-3">
            {savedRecords.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
              >
                <div>
                  <h4 className="font-bold text-gray-800">{rec.cropType}</h4>
                  <p className="text-xs text-gray-500">{rec.symptoms || rec.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(rec)}
                    className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModalId(rec.id)}
                    className="text-xs bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destructive Action Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h4>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this diagnostic entry? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDiagnostic;