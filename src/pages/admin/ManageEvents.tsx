import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Upload, Search } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';

export default function ManageEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', image: '', registration_link: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => 
      (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Image = await compressImage(file);
      setFormData({ ...formData, image: base64Image });
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Failed to process image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          created_by: user?.id || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      toast.success(`Event ${editingId ? 'updated' : 'added'} successfully`);
      setFormData({ title: '', description: '', date: '', image: '', registration_link: '' });
      setEditingId(null);
      fetchEvents();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'An error occurred while saving');
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/events/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete event');
        }

        toast.success('Event deleted successfully');
        setDeleteId(null);
        fetchEvents();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.message || 'An error occurred while deleting');
      }
    }
  };

  const handleEdit = (event: any) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      image: event.image,
      registration_link: event.registration_link,
    });
    setEditingId(event._id || event.id);
  };

  return (
    <div className="space-y-8 relative z-10">
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Events</h1>
          <p className="text-[#888888] font-light">Add, edit, or remove society events.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-1"
        >
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 sticky top-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-8 tracking-tight text-[#EDEDED]">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light resize-none" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Image URL or Upload</label>
                <div className="flex gap-3">
                  <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center text-[#888888] hover:text-[#EDEDED]"
                    title="Upload Image"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Registration Link</label>
                <input type="url" value={formData.registration_link} onChange={e => setFormData({...formData, registration_link: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
                <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', date: '', image: '', registration_link: '' }); }} className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-[#EDEDED] font-medium transition-all duration-300 text-sm tracking-wide">
                  Cancel
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 text-sm tracking-wide">
                  {editingId ? <><Edit2 className="w-4 h-4" /> Update</> : <><Plus className="w-4 h-4" /> Add Event</>}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                    <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Event</th>
                    <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Date</th>
                    <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event: any) => (
                    <tr key={event._id || event.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="p-5">
                        <div className="font-medium text-[#EDEDED] tracking-tight">{event.title}</div>
                        <div className="text-[14px] text-[#888888] font-light truncate max-w-xs mt-1">{event.description}</div>
                      </td>
                      <td className="p-5 text-[14px] text-[#888888] font-light">{event.date}</td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleEdit(event)} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(event._id || event.id)} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-[#888888] font-light">No events found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
