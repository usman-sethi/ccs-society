import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Wand2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', bg: 'bg-transparent', txt: 'text-transparent', w: 'w-0' };
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, text: 'Weak', bg: 'bg-red-500', txt: 'text-red-500', w: 'w-1/4' };
    if (score === 2) return { score, text: 'Fair', bg: 'bg-yellow-500', txt: 'text-yellow-500', w: 'w-2/4' };
    if (score === 3) return { score, text: 'Good', bg: 'bg-blue-500', txt: 'text-blue-500', w: 'w-3/4' };
    return { score, text: 'Strong', bg: 'bg-green-500', txt: 'text-green-500', w: 'w-full' };
  };

  const strength = getPasswordStrength(password);

  const suggestStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let suggested = "";
    for (let i = 0; i < 12; i++) {
        suggested += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // ensure at least one upper, one lower, one number, one special
    suggested = "A" + "b" + "1" + "!" + suggested;
    setPassword(suggested);
    setShowPassword(true);
    toast.success("Strong password generated");
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
        throw new Error(data.error || data.message || 'Signup failed');
      }
      
      if (data.data?.token) {
        login(data.data.token, data.data.user);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Could not verify details. Please try again.');
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
        <title>Sign Up | Core Computing Society</title>
        <meta name="description" content="Create an account for the Core Computing Society." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative group z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700" />
        
        <div className="bg-black/20 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl z-10 relative">
          <div className="text-center mb-8">
            <h2 className="text-[#EDEDED] font-bold text-2xl tracking-tight mb-2">Create Account</h2>
            <p className="text-[#888888] font-light text-sm">
              Join the Core Computing Society
            </p>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-[#888888] text-[12px] uppercase tracking-widest font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.05] text-[#EDEDED] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl py-3 px-4 outline-none transition-all"
                placeholder="Freshman Student"
              />
            </div>
            <div>
              <label className="block text-[#888888] text-[12px] uppercase tracking-widest font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.05] text-[#EDEDED] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl py-3 px-4 outline-none transition-all"
                placeholder="paradox@gmail.com"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-[#888888] text-[12px] uppercase tracking-widest font-medium">Password</label>
                <button type="button" onClick={suggestStrongPassword} className="text-[#888888] hover:text-purple-400 flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium transition-colors">
                  <Wand2 className="w-3 h-3" /> Auto-generate
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.05] text-[#EDEDED] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl py-3 px-4 pr-10 outline-none transition-all"
                  placeholder="*********"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#888888]">Password Strength</span>
                    <span className={strength.txt}>{strength.text}</span>
                  </div>
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.w} ${strength.bg} transition-all duration-300`}></div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#EDEDED] hover:bg-white text-[#0A0A0A] font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
            <p className="text-[#888888] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
