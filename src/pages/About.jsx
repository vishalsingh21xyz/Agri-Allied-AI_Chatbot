import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">About Agri-Allied AI</h1>
        <p className="text-slate-600 leading-relaxed text-lg">
          This platform is an AI-powered full-stack crop advisory web platform engineered to provide rapid, localized troubleshooting for farmers and field supervisors. It leverages an LLM API to process natural language descriptions of agricultural issues and delivers context-aware recommendations optimized specifically for the unique mountain farming conditions of Uttarakhand.
        </p>
      </main>
      <Footer />
    </div>
  );
}