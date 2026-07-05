import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">About Our Platform</h1>
        <p>Providing cutting-edge diagnostic solutions for smart agriculture.</p>
      </main>
      <Footer />
    </div>
  );
}