/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './lib/auth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';

// Utility to handle dynamic import failures (common in Vite HMR and restarts)
const lazyWithRetry = (componentImport: () => Promise<any>) => {
  return React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );
    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });
};

// Lazy load pages for performance
const Home = lazyWithRetry(() => import('./pages/Home'));
const About = lazyWithRetry(() => import('./pages/About'));
const Teams = lazyWithRetry(() => import('./pages/Teams'));
const Events = lazyWithRetry(() => import('./pages/Events'));
const Announcements = lazyWithRetry(() => import('./pages/Announcements'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const Developers = lazyWithRetry(() => import('./pages/Developers'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Signup = lazyWithRetry(() => import('./pages/Signup'));
const Privacy = lazyWithRetry(() => import('./pages/Privacy'));
const Terms = lazyWithRetry(() => import('./pages/Terms'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));

// Protected Pages
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));

// Admin Pages
const AdminDashboard = lazyWithRetry(() => import('./pages/admin/AdminDashboard'));
const ManageEvents = lazyWithRetry(() => import('./pages/admin/ManageEvents'));
const ManageTeams = lazyWithRetry(() => import('./pages/admin/ManageTeams'));
const ManageMembers = lazyWithRetry(() => import('./pages/admin/ManageMembers'));
const ManageUsers = lazyWithRetry(() => import('./pages/admin/ManageUsers'));
const ManageRegistrations = lazyWithRetry(() => import('./pages/admin/ManageRegistrations'));
const QueryManagement = lazyWithRetry(() => import('./pages/admin/QueryManagement'));
const ManageAnnouncements = lazyWithRetry(() => import('./pages/admin/ManageAnnouncements'));
const ManageDevelopers = lazyWithRetry(() => import('./pages/admin/ManageDevelopers'));
const ManageFeedback = lazyWithRetry(() => import('./pages/admin/ManageFeedback'));

import Footer from './components/Footer';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-[#888888] font-medium tracking-wide text-sm">Loading...</p>
    </div>
  </div>
);

const ProtectedLayout = ({ requireAdmin = false }: { requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-4">
        <span className="text-xl font-bold tracking-tight">
          CCS Portal
        </span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#888888] hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 ml-0 md:ml-64 flex flex-col overflow-hidden pt-16 md:pt-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`min-h-screen ${isAuthPage ? 'bg-[#050505]' : 'mesh-bg'} text-[#EDEDED] flex flex-col selection:bg-indigo-500/30 overflow-x-hidden w-full relative`}>
      {isAuthPage && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source src="/bg-video.webm" type="video/webm" />
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full max-w-full overflow-x-hidden relative flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

const AnimatedPublicRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#111111',
                color: '#EDEDED',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 500
              }
            }} 
          />
          <Routes>
            {/* Public Routes with Animation */}
            <Route element={<PublicLayout />}>
              <Route path="/*" element={<AnimatedPublicRoutes />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedLayout requireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/teams" element={<ManageTeams />} />
              <Route path="/admin/members" element={<ManageMembers />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/registrations" element={<ManageRegistrations />} />
              <Route path="/admin/announcements" element={<ManageAnnouncements />} />
              <Route path="/admin/developers" element={<ManageDevelopers />} />
              <Route path="/admin/queries" element={<QueryManagement />} />
              <Route path="/admin/feedback" element={<ManageFeedback />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
