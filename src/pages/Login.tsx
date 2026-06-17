import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Parse error on:', text);
        throw new Error(`Invalid server response: ${text.substring(0, 50)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }
      
      if (data.data?.token) {
         login(data.data.token, data.data.user);
         toast.success('Successfully logged in!');
         navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="fixed inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/auth-bg.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Helmet>
        <title>Login | Core Computing Society</title>
        <meta name="description" content="Sign in to your Core Computing Society account." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative group z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-700" />
        
        <div className="bg-black/20 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl z-10 relative">
          <div className="text-center mb-8">
            <h2 className="text-[#EDEDED] font-bold text-2xl tracking-tight mb-2">Welcome Back</h2>
            <p className="text-[#888888] font-light text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[#888888] text-[12px] uppercase tracking-widest font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.05] text-[#EDEDED] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 px-4 outline-none transition-all"
                placeholder="paradox@gmail.com"
              />
            </div>
            <div>
              <label className="block text-[#888888] text-[12px] uppercase tracking-widest font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.05] text-[#EDEDED] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 px-4 outline-none transition-all"
                placeholder="*********"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#EDEDED] hover:bg-white text-[#0A0A0A] font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
            <p className="text-[#888888] text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
