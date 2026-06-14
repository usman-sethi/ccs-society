import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, MessageSquare, Send, Search, Filter, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function QueryManagement() {
  const [queries, setQueries] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchQueries = async () => {
    try {
      const response = await fetch('/api/queries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      } else {
        toast.error("Failed to load queries");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to load queries");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchesSearch = 
        (q.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.message || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [queries, searchQuery, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Status updated successfully');
      fetchQueries();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleReply = async (id: string) => {
    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reply: replyText, status: 'Resolved' })
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply sent successfully');
      fetchQueries();
    } catch (err: any) {
      console.error('Failed to send reply:', err);
      toast.error(err.message || 'Failed to send reply');
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-4 text-[11px] font-medium tracking-widest uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            Queries
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Query Management</h1>
          <p className="text-[#888888] font-light">View and respond to user feedback and questions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden backdrop-blur-xl transition-colors group-hover:bg-white/[0.04] group-hover:border-white/[0.15]">
              <Search className="absolute left-4 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                placeholder="paradox"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent focus:outline-none text-[#EDEDED] placeholder:text-[#888888] text-[14px] font-light"
              />
            </div>
          </div>
          <div className="relative w-full sm:w-40 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden backdrop-blur-xl transition-colors group-hover:bg-white/[0.04] group-hover:border-white/[0.15]">
              <Filter className="absolute left-4 w-4 h-4 text-[#888888]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent focus:outline-none text-[#EDEDED] text-[14px] font-light appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0A0A0A]">All Status</option>
                <option value="Pending" className="bg-[#0A0A0A]">Pending</option>
                <option value="Resolved" className="bg-[#0A0A0A]">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredQueries.map((query: any, index: number) => {
            const queryId = query._id || query.id;
            return (
            <motion.div
              key={queryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl transition-colors duration-300 ${
                query.status === 'Resolved' 
                  ? 'bg-white/[0.01] border-white/[0.03]' 
                  : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#EDEDED] tracking-tight">{query.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      query.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {query.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {query.status}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#888888] font-light">{query.email}</p>
                  <p className="text-[12px] text-[#888888] font-light mt-1 opacity-60">
                    {query.created_at ? format(new Date(query.created_at), 'MMM d, yyyy h:mm a') : 'Unknown time'}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  {query.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange(queryId, 'Resolved')}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[13px] font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {query.status === 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange(queryId, 'Pending')}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-[13px] font-medium hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                    >
                      Mark Pending
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6">
                <p className="text-[#EDEDED] font-light whitespace-pre-wrap leading-relaxed text-[15px]">{query.message}</p>
              </div>

              {query.reply ? (
                <div className="pl-6 border-l-2 border-indigo-500/50 ml-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 text-indigo-400" />
                    </div>
                    <span className="text-[13px] font-medium text-indigo-400 uppercase tracking-wide">Admin Reply</span>
                  </div>
                  <p className="text-[#888888] font-light text-[14px] leading-relaxed">{query.reply}</p>
                </div>
              ) : (
                <div className="mt-6">
                  {replyingTo === queryId ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="paradox"
                        className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none resize-none text-[#EDEDED] font-light transition-colors"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReply(queryId)}
                          disabled={!replyText.trim()}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#0A0A0A] text-[14px] font-medium hover:bg-[#EDEDED] transition-all duration-300 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" /> Send Reply
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                          className="px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#EDEDED] text-[14px] font-medium hover:bg-white/[0.08] transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(queryId)}
                      className="flex items-center gap-2 text-[14px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-500/10"
                    >
                      <MessageSquare className="w-4 h-4" /> Reply to Query
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )})}
        </AnimatePresence>
        
        {filteredQueries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-[#888888] font-light"
          >
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-[#888888]/50" />
            </div>
            No queries found matching your criteria.
          </motion.div>
        )}
      </div>
    </div>
  );
}
