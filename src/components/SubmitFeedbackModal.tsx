import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

export default function SubmitFeedbackModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  const [formData, setFormData] = useState({
    authorName: user?.name || '',
    authorEmail: user?.email || '',
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Feedback submitted! Awaiting admin approval.');
        onClose();
        if (window.location.pathname === '/blog') {
          setTimeout(() => window.location.reload(), 2000);
        }
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0A0A0A] rounded-3xl w-full max-w-lg border border-white/[0.08] overflow-hidden shadow-2xl flex flex-col relative"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/[0.05]">
            <h2 className="text-xl font-semibold text-[#EDEDED]">Submit Feedback</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4 text-[#888888]" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#888888] mb-2 uppercase tracking-wide">Name</label>
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={(e) => setFormData(p => ({ ...p, authorName: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:border-indigo-500/50 text-[#EDEDED] text-sm"
                placeholder="John Doe"
              />
            </div>
            
            {!user && (
              <div>
                <label className="block text-xs font-medium text-[#888888] mb-2 uppercase tracking-wide">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData(p => ({ ...p, authorEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:border-indigo-500/50 text-[#EDEDED] text-sm"
                  placeholder="john@example.com"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#888888] mb-2 uppercase tracking-wide">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:border-indigo-500/50 text-[#EDEDED] text-sm"
                placeholder="Give your feedback a title"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#888888] mb-2 uppercase tracking-wide">Content</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:border-indigo-500/50 text-[#EDEDED] text-sm min-h-[120px] resize-none"
                placeholder="Share your thoughts..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Post'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
