import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DatabaseConsole() {
  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState({
    cropType: '',
    issueCategory: '',
    severity: 'Medium',
    status: 'Pending',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/diagnostic-modules';

  const fetchModules = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) showToast('Record updated successfully!');
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) showToast('Record created successfully!');
      }
      setFormData({ cropType: '', issueCategory: '', severity: 'Medium', status: 'Pending', description: '' });
      setEditingId(null);
      fetchModules();
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleEdit = (mod) => {
    setEditingId(mod.id);
    setFormData({
      cropType: mod.cropType,
      issueCategory: mod.issueCategory,
      severity: mod.severity,
      status: mod.status,
      description: mod.description
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this module record?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Record deleted successfully!');
          fetchModules();
        }
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1200px', margin: '0 auto', color: '#333' }}>
      
      {/* Appealing, High-Quality Header Block */}
      <header style={{ 
        borderBottom: '2px solid #16a34a', 
        paddingBottom: '20px', 
        marginBottom: '35px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{ 
            color: '#16a34a', 
            margin: 0, 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            letterSpacing: '-0.025em'
          }}>
            🌿 Diagnostic Modules Management Panel
          </h1>
        </div>
        <Link to="/" style={{ 
          padding: '10px 20px', 
          background: '#1e293b', 
          color: '#f8fafc', 
          textDecoration: 'none', 
          borderRadius: '8px', 
          fontWeight: '600',
          fontSize: '0.95rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.background = '#334155'}
        onMouseOut={(e) => e.target.style.background = '#1e293b'}
        >
          ← Back to Home
        </Link>
      </header>

      {message && (
        <div style={{ background: '#D4EDDA', color: '#155724', padding: '15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #C3E6CB' }}>
          ✓ {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* Form Workspace */}
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>{editingId ? '📝 Edit Diagnostic Entry' : '➕ Add New Diagnostic Entry'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Crop Type</label>
              <input type="text" name="cropType" value={formData.cropType} onChange={handleChange} placeholder="e.g. Wheat, Tomato" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Issue Category</label>
              <input type="text" name="issueCategory" value={formData.issueCategory} onChange={handleChange} placeholder="e.g. Fungal Blight, Stem Borer" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Severity</label>
                <select name="severity" value={formData.severity} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Notes / Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Symptoms or countermeasures..." style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
            </div>

            <button type="submit" style={{ width: '100%', padding: '10px', background: editingId ? '#0288d1' : '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'Update Record' : 'Submit to Cloud DB'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ cropType: '', issueCategory: '', severity: 'Medium', status: 'Pending', description: '' }); }} style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            )}
          </form>
        </div>

        {/* Database List Display */}
        <div>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>🗄️ Active Database Records ({modules.length})</h3>
          {modules.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px', color: '#888', border: '1px dashed #ccc' }}>
              No data entries found in the cloud table layout. Use the form on the left to add a record.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {modules.map((mod) => (
                <div key={mod.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#2c3e50' }}>{mod.cropType}</span>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.8em', fontWeight: 'bold', background: mod.severity === 'High' ? '#FFCDD2' : mod.severity === 'Medium' ? '#FFE0B2' : '#C8E6C9', color: mod.severity === 'High' ? '#B71C1C' : mod.severity === 'Medium' ? '#E65100' : '#1B5E20' }}>
                        {mod.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '5px' }}><strong>Category:</strong> {mod.issueCategory}</div>
                    <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '5px' }}><strong>Status:</strong> <span style={{ textDecoration: 'underline' }}>{mod.status}</span></div>
                    <p style={{ fontSize: '0.9em', color: '#666', background: '#f9f9f9', padding: '8px', borderRadius: '4px', marginTop: '8px', minHeight: '40px' }}>{mod.description || 'No notes.'}</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <button onClick={() => handleEdit(mod)} style={{ flex: 1, padding: '6px', background: '#FFE0B2', color: '#E65100', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                    <button onClick={() => handleDelete(mod.id)} style={{ flex: 1, padding: '6px', background: '#FFCDD2', color: '#B71C1C', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
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