import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Users, X } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function ManageTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({ team_name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        toast.error("Failed to load teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter(team => 
      (team.team_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/teams/${editingId}` : '/api/teams';
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
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} team`);
      }

      toast.success(`Team ${editingId ? 'updated' : 'created'} successfully!`);
      setFormData({ team_name: '', description: '' });
      setEditingId(null);
      setIsFormOpen(false);
      fetchTeams();
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
      console.error('Error saving team:', error);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/teams/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete team');
        }

        toast.success('Team deleted successfully');
        setDeleteId(null);
        fetchTeams();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.message || 'An error occurred while deleting');
      }
    }
  };

  const handleEdit = (team: any) => {
    setFormData({
      team_name: team.team_name,
      description: team.description,
    });
    setEditingId(team._id || team.id);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8 relative z-10">
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Team"
        message="Are you sure you want to delete this team? This action cannot be undone."
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
            <Users className="w-3.5 h-3.5" />
            Divisions
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Teams</h1>
          <p className="text-[#888888] font-light">Add, edit, or remove society teams.</p>
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
              setFormData({ team_name: '', description: '' });
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 text-sm tracking-wide whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Team
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
              className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 sm:p-10 max-w-xl w-full relative shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#EDEDED]">{editingId ? 'Edit Team' : 'Create Team'}</h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-full hover:bg-white/[0.05] transition-colors text-[#888888] hover:text-[#EDEDED]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Team Name</label>
                  <input type="text" required value={formData.team_name} onChange={e => setFormData({...formData, team_name: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light" placeholder="paradox" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Description</label>
                  <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light resize-none" placeholder="paradox" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#EDEDED] font-medium hover:bg-white/[0.08] transition-all duration-300 text-sm tracking-wide">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 text-sm tracking-wide">
                    {editingId ? <><Edit2 className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Create Team</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((team: any, index) => (
          <motion.div
            key={team._id || team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-8 transition-all duration-500 flex flex-col h-full relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#888888] group-hover:text-[#EDEDED] group-hover:bg-white/[0.08] transition-all duration-500">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleEdit(team)} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(team._id || team.id)} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 tracking-tight text-[#EDEDED]">{team.team_name}</h3>
              <p className="text-[#888888] font-light leading-relaxed flex-1 text-[15px]">{team.description}</p>
            </div>
          </motion.div>
        ))}
        {filteredTeams.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-3xl border border-white/[0.05] backdrop-blur-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.03] mb-6">
              <Search className="w-6 h-6 text-[#888888]" />
            </div>
            <h3 className="text-xl font-semibold text-[#EDEDED] mb-2">No teams found</h3>
            <p className="text-[#888888] font-light">Try adjusting your search or create a new team.</p>
          </div>
        )}
      </div>
    </div>
  );
}
