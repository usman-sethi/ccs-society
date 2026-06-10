import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback/admin');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      } else {
        toast.error('Failed to fetch feedback');
      }
    } catch (error) {
      toast.error('Error fetching feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    // Optimistic update
    const previousFeedbacks = [...feedbacks];
    setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status } : f));
    
    try {
      const response = await fetch(`/api/feedback/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Feedback ${status}`);
        // Ensure accurate state from server
        setFeedbacks(feedbacks.map(f => f._id === id ? data.feedback : f));
      } else {
        toast.error(data.message || 'Failed to update status');
        setFeedbacks(previousFeedbacks);
      }
    } catch (error) {
      toast.error('Error updating status');
      setFeedbacks(previousFeedbacks);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-xs font-medium uppercase tracking-wider">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-medium uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md text-xs font-medium uppercase tracking-wider">Pending</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-[#EDEDED] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
            Manage Feedback
          </h1>
          <p className="text-[#888888] mt-1 text-sm font-light">Review and approve feedback to be posted on the Blog.</p>
        </div>
        <button 
          onClick={fetchFeedbacks}
          className="p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-[#888888]" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
          <MessageSquare className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
          <p className="text-[#888888] font-light">No feedback found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[#EDEDED]">{item.title}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-[#888888] text-sm leading-relaxed whitespace-pre-wrap">{item.content}</p>
                <div className="text-xs text-[#888888] flex items-center gap-4 pt-2">
                  <span>Author: <strong className="text-[#EDEDED] font-medium">{item.authorName}</strong></span>
                  <span>Submitted: {new Date(item.created_at).toLocaleDateString()}</span>
                  {item.authorEmail && <span>Email: {item.authorEmail}</span>}
                </div>
              </div>
              
              {item.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => handleStatusUpdate(item._id, 'approved')}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl transition-colors text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(item._id, 'rejected')}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
