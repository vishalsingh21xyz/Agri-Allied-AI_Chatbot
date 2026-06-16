import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-emerald-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold flex items-center gap-2">
          <span>🌾</span> Agri-Allied AI
        </div>
        <div className="flex gap-6 font-medium">
          <Link to="/" className="hover:text-emerald-200 transition">Home</Link>
          <Link to="/about" className="hover:text-emerald-200 transition">About</Link>
          <Link to="/dashboard" className="hover:text-emerald-200 transition">Dashboard</Link>
          <Link to="/login" className="hover:text-emerald-200 transition">Login</Link>
        </div>
      </div>
    </nav>
  );
}