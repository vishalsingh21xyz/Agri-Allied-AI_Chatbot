import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DatabaseConsole() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    cropType: '',
    issueCategory: '',
    severity: 'High',
    status: 'Pending',
    description: ''
  });

  const API_URL = 'http://localhost:5000/api/diagnostic-modules';

  // 1. READ ALL RECORDS
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. CREATE RECORD
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropType || !formData.issueCategory) {
      alert('Please fill in both Crop Type and Issue Category!');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to insert record');
      }

      setMessage('✓ Record created successfully in Aiven DB!');
      setTimeout(() => setMessage(''), 3500);

      setFormData({
        cropType: '',
        issueCategory: '',
        severity: 'High',
        status: 'Pending',
        description: ''
      });
      fetchRecords();
    } catch (err) {
      console.error('Submit Error:', err);
      alert(`Error submitting record: ${err.message}`);
    }
  };

  // 3. DELETE RECORD
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diagnostic module record?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete record');
      
      setMessage('✓ Record deleted successfully!');
      setTimeout(() => setMessage(''), 3500);
      fetchRecords();
    } catch (err) {
      console.error('Delete Error:', err);
      alert(`Error deleting record: ${err.message}`);
    }
  };

  // 4. UPDATE RECORD STATUS
  const handleStatusUpdate = async (record) => {
    const newStatus = record.status === 'Pending' ? 'Resolved' : 'Pending';
    try {
      const res = await fetch(`${API_URL}/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...record, status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      fetchRecords();
    } catch (err) {
      console.error('Update Error:', error);
      alert(`Error updating record: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      {/* Top Navigation & Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🌱</span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#14532d', margin: 0, letterSpacing: '-0.5px' }}>
              Diagnostic Modules Management Panel
            </h1>
          </div>
          
        </div>

        <Link to="/" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#1e293b', 
          color: '#ffffff', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease'
        }}>
          ← Back to Home
        </Link>
      </div>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, #15803d 0%, #86efac 100%)', borderRadius: '2px', marginBottom: '32px' }} />

      {/* Alert Banner */}
      {message && (
        <div style={{ 
          padding: '14px 20px', 
          backgroundColor: '#f0fdf4', 
          color: '#166534', 
          border: '1px solid #bbf7d0', 
          borderRadius: '8px', 
          marginBottom: '24px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(22, 101, 52, 0.05)'
        }}>
          {message}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '32px' }}>
        
        {/* Left Form Column */}
        <div style={{ 
          padding: '28px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' 
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#16a34a' }}>➕</span> Add New Diagnostic Entry
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '14px', marginBottom: '6px' }}>Crop Type</label>
              <input
                type="text"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                placeholder="e.g. Wheat, Rice, Sugarcane"
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '14px', marginBottom: '6px' }}>Issue Category</label>
              <input
                type="text"
                name="issueCategory"
                value={formData.issueCategory}
                onChange={handleChange}
                placeholder="e.g. Fungal Blight, Stem Borer"
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '14px', marginBottom: '6px' }}>Severity</label>
                <select name="severity" value={formData.severity} onChange={handleChange} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc' }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '14px', marginBottom: '6px' }}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc' }}>
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '14px', marginBottom: '6px' }}>Notes / Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Observed field symptoms and severity details..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              style={{ 
                width: '100%', 
                padding: '13px', 
                backgroundColor: '#15803d', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                fontSize: '15px',
                boxShadow: '0 4px 6px -1px rgba(21, 128, 61, 0.2)',
                transition: 'background 0.2s ease'
              }}
            >
              Submit to Cloud DB
            </button>
          </form>
        </div>

        {/* Right Cards List Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🗄️</span> Active Database Records
            </h2>
            <span style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '4px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '13px' }}>
              {records.length} Total
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <p>Fetching records from Aiven Database...</p>
            </div>
          ) : records.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>No diagnostic modules found in cloud storage.</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Fill out the form on the left to insert an entry.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {records.map((item) => (
                <div key={item.id} style={{ 
                  padding: '20px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  backgroundColor: '#ffffff', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#14532d', fontSize: '18px', fontWeight: '700' }}>
                      {item.cropType} <span style={{ color: '#94a3b8', fontWeight: '400' }}>—</span> {item.issueCategory}
                    </h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '700',
                      backgroundColor: item.status === 'Resolved' ? '#dcfce7' : '#fef9c3',
                      color: item.status === 'Resolved' ? '#15803d' : '#a16207',
                      border: item.status === 'Resolved' ? '1px solid #bbf7d0' : '1px solid #fef08a'
                    }}>
                      {item.status}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                    <strong style={{ color: '#374151' }}>Severity:</strong> {item.severity} &nbsp;|&nbsp; <strong style={{ color: '#374151' }}>Description:</strong> {item.description || 'N/A'}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', pt: '8px', borderTop: '1px solid #f1f5f9' }}>
                    <button 
                      onClick={() => handleStatusUpdate(item)}
                      style={{ 
                        padding: '7px 14px', 
                        backgroundColor: '#0284c7', 
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Toggle Status ({item.status === 'Pending' ? 'Mark Resolved' : 'Mark Pending'})
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{ 
                        padding: '7px 14px', 
                        backgroundColor: '#ef4444', 
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Delete Entry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}