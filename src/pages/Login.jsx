import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Account Portal</h1>
        <p className="text-slate-600 leading-relaxed text-lg">
          Please log in to your account here to access personalized mountain farming advisories, track your supervisor tickets, and manage platform preferences securely.
        </p>
      </main>
      <Footer />
    </div>
  );
}