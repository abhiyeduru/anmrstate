import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// lazy-load pages to avoid top-level import-time failures
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Draw = lazy(() => import("./pages/Draw"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Unhandled error caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-zinc-900 border border-red-600 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold" style={{ color: "var(--accent)" }}>Something went wrong</h2>
            <p className="mt-3 text-sm text-zinc-300">An unexpected error occurred while loading the app. Details are shown below.</p>
            <pre className="mt-3 text-xs text-red-400 bg-black/20 p-3 rounded break-words">{String(this.state.error)}</pre>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded" style={{ backgroundColor: "var(--accent)", color: "#000" }}>Reload</button>
              <button onClick={() => this.setState({ hasError: false, error: null })} className="px-4 py-2 rounded border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Dismiss</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    console.log("App mounted — use npm start to run the dev server (start -> vite)");
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-gray-100"
      style={{ ["--accent"]: "#D4AF37" }}
    >
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ErrorBoundary>
          <Suspense fallback={<div className="text-center text-zinc-400">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/draw" element={<Draw />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
