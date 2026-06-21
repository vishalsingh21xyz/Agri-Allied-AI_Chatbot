import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Input, Modal, Loader, Toast } from '../components/ui/Index';

export default function Demo() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Local theme mirroring state
  const [isDark, setIsDark] = useState(false);

  // Checks the document element class to see if dark mode is active
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.length < 3 && val.length > 0) {
      setInputError('Input validation flag: Must be at least 3 characters.');
    } else {
      setInputError('');
    }
  };

  const triggerLoader = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    // Forces dark mode styling manually based on local component theme mirroring state
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className={`text-3xl font-extrabold mb-2 ${isDark ? 'text-emerald-500' : 'text-emerald-800'}`}>UI Component Showcase</h1>
        <p className={`mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Testing dashboard for Deliverable 2 framework verification.</p>
        
        <div className={`space-y-8 p-8 rounded-xl shadow-xs border transition-colors duration-200 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          {/* 1. Button Library Section */}
          <section className={`border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className="text-xl font-bold mb-4">1. Reusable Button Elements</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" size="md">Primary Button</Button>
              <Button variant="secondary" size="md">Secondary Button</Button>
              <Button variant="outline" size="md">Outline Variant</Button>
              <Button variant="primary" size="sm">Small Size</Button>
              <Button variant="primary" size="lg">Large Size</Button>
              <Button variant="primary" disabled={true}>Disabled State</Button>
            </div>
          </section>

          {/* 2. Form Input Section */}
          <section className={`border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className="text-xl font-bold mb-4">2. Documented Text Input</h2>
            <Input 
              label="Farmer Diagnostic Credential Key" 
              placeholder="Enter text here to evaluate error states..." 
              value={inputValue}
              onChange={handleInputChange}
              error={inputError}
            />
          </section>

          {/* 3. Action Overlays Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">3. Overlay Control Toggles</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Focus-Trapped Modal</Button>
              <Button variant="secondary" onClick={() => setIsToastVisible(true)}>Trigger Brief Toast Alert</Button>
              <Button variant="outline" onClick={triggerLoader}>Simulate 2s Screen Spinner</Button>
            </div>
          </section>

        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="System Diagnostics Container">
        <p>This modal container successfully isolates interactions. Pressing the <kbd className={`p-1 rounded border font-mono text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-700'}`}>ESC</kbd> key will immediately trigger a window closing event loop sequence.</p>
      </Modal>

      <Toast message="Notification token confirmed: Form process completed successfully!" isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
      
      {isLoading && <Loader fullScreen={true} />}

      <Footer />
    </div>
  );
}