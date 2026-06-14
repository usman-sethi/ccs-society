import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, MessageCircle, AlertCircle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { createPortal } from 'react-dom';

export default function Blog() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/feedback/blog');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-[#EDEDED] mb-2">Community Blog</h1>
          <p className="text-[#888888] text-lg font-light">Read feedback and thoughts from our community.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Submit Feedback
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
          <MessageCircle className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-[#EDEDED] mb-2">No blogs yet</h3>
          <p className="text-[#888888] font-light">Be the first to share your feedback with the community.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map((feedback, idx) => (
            <motion.article 
              key={feedback._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 sm:p-8 hover:bg-white/[0.04] transition-colors"
            >
              <h2 className="text-2xl font-bold text-[#EDEDED] mb-4 tracking-tight">{feedback.title}</h2>
              <p className="text-[#888888] leading-relaxed whitespace-pre-wrap mb-6">{feedback.content}</p>
              
              <div className="flex items-center gap-4 text-sm text-[#888888] border-t border-white/[0.05] pt-4 mt-auto">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{feedback.authorName}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/[0.2]" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(feedback.approved_at || feedback.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {showModal && (
        <SubmitFeedbackModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)}
          user={user}
        />
      )}
    </div>
  );
}

function SubmitFeedbackModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
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
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/80 backdrop-blur-xl">
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
                  placeholder="paradox"
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
                    placeholder="paradox"
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
                  placeholder="paradox"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888888] mb-2 uppercase tracking-wide">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:border-indigo-500/50 text-[#EDEDED] text-sm min-h-[120px] resize-none"
                  placeholder="paradox"
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
      )}
    </AnimatePresence>,
    document.body
  );
}
