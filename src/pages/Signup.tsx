import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Terminal, UserPlus, ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Signup failed');
      }

      if (data.success && data.data) {
        login(data.data.token, data.data.user);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <Helmet>
        <title>Sign Up | Core Computing Society</title>
        <meta name="description" content="Create an account for the Core Computing Society." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full space-y-8 bg-[#050505]/80 p-8 md:p-10 rounded-[2rem] border border-white/[0.05] backdrop-blur-3xl relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden group"
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-700" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700" />
        
        <div className="relative z-10">
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-white/[0.02] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-6 overflow-hidden shadow-inner backdrop-blur-md relative group-hover:border-white/[0.15] transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/logo.jpeg" alt="CCS Logo" className="w-full h-full object-contain relative z-10" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }} />
              <Terminal className="w-6 h-6 text-[#EDEDED] hidden relative z-10" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-[#EDEDED] mb-2">Create an account</h2>
            <p className="text-[15px] text-[#888888] font-light">
              Join the Core Computing Society
            </p>
          </div>
          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group/input relative">
                <label className="block text-[12px] font-medium text-[#888888] mb-2 uppercase tracking-widest group-focus-within/input:text-indigo-400 transition-colors duration-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#888888] group-focus-within/input:text-indigo-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/40 shadow-inner"
                    placeholder="paradox"
                  />
                </div>
              </div>
              <div className="group/input relative">
                <label className="block text-[12px] font-medium text-[#888888] mb-2 uppercase tracking-widest group-focus-within/input:text-indigo-400 transition-colors duration-300">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#888888] group-focus-within/input:text-indigo-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/40 shadow-inner"
                    placeholder="paradox"
                  />
                </div>
              </div>
              <div className="group/input relative">
                <label className="block text-[12px] font-medium text-[#888888] mb-2 uppercase tracking-widest group-focus-within/input:text-indigo-400 transition-colors duration-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#888888] group-focus-within/input:text-indigo-400 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/40 shadow-inner"
                    placeholder="paradox"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#888888] hover:text-[#EDEDED] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[#0A0A0A] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-sm tracking-wide group/btn overflow-hidden bg-[#EDEDED] hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">{loading ? 'Creating account...' : 'Sign up'}</span>
              <ArrowRight className={`relative z-10 w-4 h-4 ${loading ? 'animate-pulse' : 'group-hover/btn:translate-x-1 transition-transform duration-300'}`} />
            </button>
          </form>
          <div className="mt-8 text-center text-[14px] text-[#888888] font-light">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#EDEDED] hover:text-indigo-400 transition-colors duration-300 relative inline-block group/link">
              Sign in
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-400 transition-all duration-300 group-hover/link:w-full" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
