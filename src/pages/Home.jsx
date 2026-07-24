import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b' }}>
      
      {/* Navbar Header */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#15803d', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌱</span> Agri-Allied AI
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', cursor: 'pointer' }}>Dashboard</span>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', cursor: 'pointer' }}>UI Demo</span>
          <Link 
            to="/database-console" 
            style={{ 
              backgroundColor: '#15803d', 
              color: '#ffffff', 
              padding: '9px 18px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '700', 
              fontSize: '13.5px',
              boxShadow: '0 2px 4px rgba(21, 128, 61, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⚙️ Manage Diagnostic Modules
          </Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <section style={{ backgroundColor: '#ecfdf5', padding: '64px 20px', textAlign: 'center', borderBottom: '1px solid #d1fae5' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#064e3b', margin: '0 0 16px 0', letterSpacing: '-0.8px', lineHeight: '1.2' }}>
            Intelligent Crop Advisory for Mountain Farming
          </h1>
          <p style={{ fontSize: '18px', color: '#047857', maxWidth: '750px', margin: '0 auto 28px auto', lineHeight: '1.6', fontWeight: '500' }}>
            Empowering Uttarakhand farmers with context-aware, real-time AI troubleshooting for pest infestations, crop symptoms, and nutrient deficiencies.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <Link 
              to="/database-console" 
              style={{ padding: '12px 28px', backgroundColor: '#15803d', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}
            >
              Access Database Console →
            </Link>
          </div>
        </div>
      </section>

      {/* Static Core Features Container */}
      <main style={{ maxWidth: '1150px', margin: '48px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Core AI Diagnostic Capability Showcase
          </h2>
        </div>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', display: 'grid', gap: '24px' }}>
          
          {/* Card 1 */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌾</div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#166534', margin: '0 0 8px 0' }}>
              Wheat & Grain Disease Identification
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
              AI vision analysis model specialized in identifying Yellow Rust, Leaf Blight, and Smut in terrace wheat crops across agro-climatic zones.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#166534', margin: '0 0 8px 0' }}>
              Paddy & Rice Pest Diagnostics
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
              Early detection algorithms targeting Stem Borer, Brown Planthopper, and Bacterial Leaf Blight in highland valley rice fields.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧪</div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#166534', margin: '0 0 8px 0' }}>
              Soil Health & NPK Deficiency Engine
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
              Integrated diagnostic rule engine providing targeted organic and chemical remedy recommendations based on soil NPK levels.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '24px', textAlign: 'center', fontSize: '13px', borderTop: '1px solid #1e293b' }}>
        © 2026 Agri-Allied AI Platform • Optimized for Uttarakhand Agro-Climatic Regions
      </footer>

    </div>
  );
}