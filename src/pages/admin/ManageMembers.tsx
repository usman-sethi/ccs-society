import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Upload, Search, Users, X, Shield } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function ManageMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', role: '', team_id: '', image: '', bio: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [membersRes, teamsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/teams')
      ]);

      if (!membersRes.ok || !teamsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const membersData = await membersRes.json();
      const teamsData = await teamsRes.json();

      setMembers(membersData);
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

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
      const url = editingId ? `/api/members/${editingId}` : '/api/members';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} member`);
      }

      toast.success(`Member ${editingId ? 'updated' : 'created'} successfully!`);
      setFormData({ name: '', role: '', team_id: '', image: '', bio: '' });
      setEditingId(null);
      setIsFormOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
      console.error('Error saving member:', error);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/members/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete member');
        }

        toast.success('Member deleted successfully');
        setDeleteId(null);
        fetchData();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.message || 'An error occurred while deleting');
      }
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name || '',
      role: member.role || '',
      team_id: member.team_id || '',
      image: member.image || '',
      bio: member.bio || '',
    });
    setEditingId(member._id || member.id);
    setIsFormOpen(true);
  };

  const getTeamName = (teamId: string) => {
    const team: any = teams.find((t: any) => (t._id || t.id) === teamId);
    return team ? team.team_name : 'Unknown Team';
  };

  return (
    <div className="space-y-8 relative z-10">
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
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
            <Shield className="w-3.5 h-3.5" />
            Roster
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Members</h1>
          <p className="text-[#888888] font-light">Add, edit, or remove team members.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72 group">
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
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', role: '', team_id: '', image: '', bio: '' });
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 text-sm tracking-wide whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Member
          </button>
        </div>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 sm:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#EDEDED]">{editingId ? 'Edit Member' : 'Add Member'}</h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-full hover:bg-white/[0.05] transition-colors text-[#888888] hover:text-[#EDEDED]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" placeholder="paradox" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Role</label>
                    <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" placeholder="paradox" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Team</label>
                  <select required value={formData.team_id} onChange={e => setFormData({...formData, team_id: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light appearance-none">
                    <option value="" disabled className="bg-[#0A0A0A] text-[#888888]">Select a team</option>
                    {teams.map((team: any) => (
                      <option key={team._id || team.id} value={team._id || team.id} className="bg-[#0A0A0A] text-[#EDEDED]">{team.team_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Bio</label>
                  <textarea required rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light resize-none" placeholder="paradox" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Profile Image</label>
                  <div className="flex gap-4 items-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border border-white/[0.08]" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#888888]" />
                      </div>
                    )}
                    <div className="flex-1 flex gap-3">
                      <input type="url" placeholder="paradox" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" />
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
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
                  <button type="button" onClick={() => { setIsFormOpen(false); setEditingId(null); setFormData({ name: '', role: '', team_id: '', image: '', bio: '' }); }} className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#EDEDED] font-medium hover:bg-white/[0.08] transition-all duration-300 text-sm tracking-wide">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 text-sm tracking-wide">
                    {editingId ? <><Edit2 className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Add Member</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member: any, index) => (
          <motion.div
            key={member._id || member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button onClick={() => handleEdit(member)} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-md">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(member._id || member.id)} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 backdrop-blur-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                {member.image ? (
                  <img src={member.image} alt={member.name} className="relative w-24 h-24 rounded-full object-cover border-2 border-white/[0.08] group-hover:border-indigo-400/50 transition-colors duration-500" />
                ) : (
                  <div className="relative w-24 h-24 rounded-full bg-white/[0.02] border-2 border-white/[0.08] group-hover:border-indigo-400/50 flex items-center justify-center transition-colors duration-500">
                    <Users className="w-8 h-8 text-[#888888] group-hover:text-indigo-400/80 transition-colors duration-500" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-1 tracking-tight text-[#EDEDED]">{member.name}</h3>
              <p className="text-indigo-400 text-sm font-medium tracking-wide uppercase mb-3">{member.role}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] text-xs mb-4">
                <Shield className="w-3 h-3" />
                {getTeamName(member.team_id)}
              </div>
              <p className="text-[#888888] font-light text-[14px] line-clamp-3 w-full">{member.bio}</p>
            </div>
          </motion.div>
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-3xl border border-white/[0.05] backdrop-blur-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.03] mb-6">
              <Search className="w-6 h-6 text-[#888888]" />
            </div>
            <h3 className="text-xl font-semibold text-[#EDEDED] mb-2">No members found</h3>
            <p className="text-[#888888] font-light">Try adjusting your search or add a new member.</p>
          </div>
        )}
      </div>
    </div>
  );
}
