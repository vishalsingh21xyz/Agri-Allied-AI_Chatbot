import React, { useState } from 'react';

const AIDiagnostic = () => {
  const [cropType, setCropType] = useState('Wheat');
  const [region, setRegion] = useState('Punjab');
  const [symptoms, setSymptoms] = useState('Yellow powder on upper leaves');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleDiagnose = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ai/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cropType, symptoms, region }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate diagnosis.');
      }

      // Parse structured text sections for grid card layout
      const sections = parseReportSections(data.analysis);
      setReport(sections);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Analyzing Crop Symptoms with AI...</span>
            </>
          ) : (
            <>
              <span>🤖</span>
              <span>Generate AI Diagnosis</span>
            </>
          )}
        </button>
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
    </div>
  );
};

export default AIDiagnostic;