import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Search, Image as ImageIcon, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ManageRegistrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/event-registrations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (!eventsRes.ok || !registrationsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const eventsData = await eventsRes.json();
      const registrationsData = await registrationsRes.json();

      setEvents(eventsData);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/event-registrations/${id}`, {
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
      fetchData(); // Refresh data
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  const getEventName = (eventId: string) => {
    const event = events.find(e => (e._id || e.id) === eventId);
    return event ? event.title : 'Unknown Event';
  };

  const filteredRegistrations = registrations.filter(reg => 
    (reg.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (reg.mobile_number || '').includes(searchQuery) ||
    getEventName(reg.event_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <FileText className="w-3.5 h-3.5" />
            Registrations
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Registrations</h1>
          <p className="text-[#888888] font-light">Review and manage event registrations.</p>
        </div>
        <div className="relative w-full md:w-72 group">
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
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 backdrop-blur-xl"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-[15px] font-light">{error}</p>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Event</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Participant</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Details</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Payment Proof</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id || reg.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-300">
                  <td className="p-5">
                    <div className="font-medium text-[#EDEDED] tracking-tight">{getEventName(reg.event_id)}</div>
                    <div className="text-[14px] text-[#888888] font-light mt-1">{format(new Date(reg.created_at), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-medium text-[#EDEDED] tracking-tight">{reg.full_name}</div>
                    <div className="text-[14px] text-[#888888] font-light mt-1">{reg.mobile_number}</div>
                  </td>
                  <td className="p-5">
                    <div className="text-[14px] text-[#EDEDED] font-light">Prog: <span className="text-[#888888]">{reg.program}</span></div>
                    <div className="text-[14px] text-[#EDEDED] font-light mt-1">Sec: <span className="text-[#888888]">{reg.section}</span></div>
                  </td>
                  <td className="p-5">
                    {reg.payment_proof ? (
                      <button 
                        onClick={() => setSelectedImage(reg.payment_proof)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[#EDEDED] hover:bg-white/[0.08] transition-all duration-300 text-[13px] font-medium"
                      >
                        <ImageIcon className="w-4 h-4" />
                        View Proof
                      </button>
                    ) : (
                      <span className="text-[#888888] text-[13px] font-light italic">No proof</span>
                    )}
                  </td>
                  <td className="p-5">
                    <select
                      value={reg.status}
                      onChange={(e) => handleStatusChange(reg._id || reg.id, e.target.value)}
                      className={`text-[13px] font-medium rounded-lg px-3 py-1.5 border border-white/[0.08] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-colors appearance-none cursor-pointer ${
                        reg.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        reg.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        reg.status === 'pending_approval' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-white/[0.03] text-[#888888]'
                      }`}
                    >
                      <option value="registered" className="bg-[#0A0A0A] text-[#888888]">Registered</option>
                      <option value="pending_approval" className="bg-[#0A0A0A] text-amber-400">Pending</option>
                      <option value="approved" className="bg-[#0A0A0A] text-emerald-400">Approved</option>
                      <option value="rejected" className="bg-[#0A0A0A] text-rose-400">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#888888] font-light">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full" 
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 rounded-full hover:bg-white/[0.05] transition-colors text-[#888888] hover:text-[#EDEDED]"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={selectedImage} alt="Payment Proof" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl border border-white/[0.08] shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
