import { useEffect, useRef } from 'react';

/**
 * @component Modal
 * @param {Object} props
 * @param {boolean} props.isOpen - Dictates layout visibility and structural render states
 * @param {Function} props.onClose - Action callback firing window dismissal sequences
 * @param {string} props.title - Modal structural window header text
 * @param {React.ReactNode} props.children - Dynamic structural container content elements
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus(); // Instantly traps browser focus onto modal activation
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-6 shadow-2xl focus:outline-none border dark:border-slate-800"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition text-lg">✕</button>
        </div>
        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">{children}</div>
      </div>
    </div>
  );
}