import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(error => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setStatus('submitting');
    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'Pending',
          created_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-8 shadow-sm backdrop-blur-md">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium tracking-wide uppercase">Get in touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-[1.1]">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-[#888888] mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Have a question, feedback, or want to collaborate? We'd love to hear from you.
          </p>
          <a 
            href="mailto:demo@example.com" 
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/[0.02] border border-white/[0.08] text-[#EDEDED] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-300 backdrop-blur-md group"
          >
            <Mail className="w-4 h-4 text-[#888888] group-hover:text-indigo-400 transition-colors duration-300" />
            <span className="text-[15px] font-medium tracking-wide">demo@example.com</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight text-[#EDEDED]">Message Sent!</h2>
                <p className="text-[#888888] mb-10 font-light leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#EDEDED] font-medium hover:bg-white/[0.08] transition-all duration-300 text-sm tracking-wide"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-5 py-4 rounded-xl bg-white/[0.02] border ${errors.name ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/50`}
                      placeholder="paradox"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-2 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-5 py-4 rounded-xl bg-white/[0.02] border ${errors.email ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/50`}
                      placeholder="paradox"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-2 font-medium">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-5 py-4 rounded-xl bg-white/[0.02] border ${errors.message ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/50 resize-none`}
                    placeholder="paradox"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-2 font-medium">{errors.message}</p>}
                </div>
                
                {status === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[13px] font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Failed to send message. Please try again later.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm tracking-wide group"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  <Send className={`w-4 h-4 ${status === 'submitting' ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300'}`} />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
