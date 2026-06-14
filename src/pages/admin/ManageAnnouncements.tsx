import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Bell, Search, Filter, Upload, Image as ImageIcon, MessageSquare, X } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { compressImage } from '../../lib/imageUtils';

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'info', image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        toast.error("Failed to load announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = 
        (announcement.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (announcement.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'All' || announcement.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [announcements, searchQuery, typeFilter]);

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
      if (editingId) {
        const response = await fetch(`/api/announcements/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update announcement');
        toast.success('Announcement updated successfully');
      } else {
        const response = await fetch('/api/announcements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to post announcement');
        toast.success('Announcement posted successfully');
      }

      setFormData({ title: '', content: '', type: 'info', image: '' });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'An error occurred while saving');
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/announcements/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete announcement');
        
        toast.success('Announcement deleted successfully');
        setDeleteId(null);
        fetchAnnouncements();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.message || 'An error occurred while deleting');
      }
    }
  };

  const handleEdit = (announcement: any) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type || 'info',
      image: announcement.image || '',
    });
    setEditingId(announcement._id || announcement.id);
  };

  return (
    <div className="space-y-8 relative z-10">
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-4 text-[11px] font-medium tracking-widest uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            Announcements
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Announcements</h1>
          <p className="text-[#888888] font-light">Create and manage society announcements.</p>
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent focus:outline-none text-[#EDEDED] text-[14px] font-light appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#0A0A0A]">All Types</option>
                <option value="info" className="bg-[#0A0A0A]">Info</option>
                <option value="success" className="bg-[#0A0A0A]">Success</option>
                <option value="warning" className="bg-[#0A0A0A]">Warning</option>
                <option value="error" className="bg-[#0A0A0A]">Urgent</option>
              </select>
            </div>
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
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-8 sticky top-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-[#EDEDED] tracking-tight">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-indigo-400" />
              </div>
              {editingId ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-[#888888] uppercase tracking-wide">Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none text-[#EDEDED] font-light transition-colors" 
                  placeholder="paradox"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-[#888888] uppercase tracking-wide">Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none text-[#EDEDED] font-light transition-colors appearance-none cursor-pointer"
                >
                  <option value="info" className="bg-[#0A0A0A]">Info (Blue)</option>
                  <option value="success" className="bg-[#0A0A0A]">Success (Green)</option>
                  <option value="warning" className="bg-[#0A0A0A]">Warning (Yellow)</option>
                  <option value="error" className="bg-[#0A0A0A]">Urgent (Red)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-[#888888] uppercase tracking-wide">Content</label>
                <textarea 
                  required 
                  rows={5} 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none text-[#EDEDED] font-light transition-colors resize-none" 
                  placeholder="paradox"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-[#888888] uppercase tracking-wide">Image (Optional)</label>
                <div className="flex items-center space-x-4">
                  {formData.image ? (
                    <div className="relative group">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded-xl border border-white/[0.08]"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-xl border border-white/[0.08] border-dashed flex items-center justify-center bg-white/[0.02]">
                      <ImageIcon className="w-6 h-6 text-[#888888]" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2 border border-white/[0.08] rounded-xl text-[14px] font-medium text-[#EDEDED] hover:bg-white/[0.05] transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2 text-[#888888]" />
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
                <button 
                  type="submit" 
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 text-sm tracking-wide"
                >
                  {editingId ? <><Edit2 className="w-4 h-4" /> Update</> : <><Plus className="w-4 h-4" /> Post</>}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({ title: '', content: '', type: 'info', image: '' }); }} 
                    className="px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-[#EDEDED] font-medium transition-all duration-300 text-sm tracking-wide"
                  >
                    Cancel
                  </button>
                )}
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
                    <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Announcement</th>
                    <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Date Posted</th>
                    <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnnouncements.map((announcement: any) => {
                    const announcementId = announcement._id || announcement.id;
                    let typeColor = 'border-l-indigo-500';
                    let badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                    if (announcement.type === 'success') {
                      typeColor = 'border-l-emerald-500';
                      badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    }
                    if (announcement.type === 'warning') {
                      typeColor = 'border-l-amber-500';
                      badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    }
                    if (announcement.type === 'error') {
                      typeColor = 'border-l-rose-500';
                      badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                    }

                    return (
                      <tr key={announcementId} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-300">
                        <td className="p-5">
                          <div className={`pl-4 border-l-2 ${typeColor} flex items-start gap-4`}>
                            {announcement.image && (
                              <img 
                                src={announcement.image} 
                                alt={announcement.title}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/[0.08]"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                  {announcement.type}
                                </span>
                              </div>
                              <div className="font-medium text-[#EDEDED] tracking-tight">{announcement.title}</div>
                              <div className="text-[14px] text-[#888888] font-light mt-1 line-clamp-2">{announcement.content}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-[14px] text-[#888888] font-light">
                          {announcement.created_at ? format(new Date(announcement.created_at), 'MMM d, yyyy') : 'Unknown'}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleEdit(announcement)} 
                              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteId(announcementId)} 
                              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAnnouncements.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-[#888888] font-light">No announcements found.</td>
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
