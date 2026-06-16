import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Farmer Dashboard</h1>
        <p className="text-slate-600 leading-relaxed text-lg">
          Welcome back! Here you will eventually find your saved crop health history, logged diagnostic tickets, and customized soil metrics tracking. Responsible AI Guardrails are active to ensure high-stakes decision verification.
        </p>
      </main>
      <Footer />
    </div>
  );
}