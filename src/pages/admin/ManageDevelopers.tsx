import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Code2, Loader2, X, Github, Linkedin, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import { compressImage } from '../../lib/imageUtils';

interface Developer {
  _id: string;
  name: string;
  role: string;
  bio: string;
  github: string;
  linkedin: string;
  image: string;
  skills: string[];
}

export default function ManageDevelopers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    github: '',
    linkedin: '',
    skills: ''
  });

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const res = await fetch('/api/developers');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (Array.isArray(data)) {
        setDevelopers(data);
      } else {
        setDevelopers([]);
      }
    } catch (error) {
      toast.error('Failed to fetch developers');
      setDevelopers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      try {
        const base64Image = await compressImage(file);
        setImagePreview(base64Image);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Failed to process image');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        image: imagePreview,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      const url = editingDeveloper ? `/api/developers/${editingDeveloper._id}` : '/api/developers';
      const method = editingDeveloper ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Developer ${editingDeveloper ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        fetchDevelopers();
        resetForm();
      } else {
        const data = await res.json();
        toast.error(data.error || `Failed to ${editingDeveloper ? 'update' : 'add'} developer`);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!developerToDelete) return;

    try {
      const res = await fetch(`/api/developers/${developerToDelete}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Developer deleted successfully');
        setDevelopers(developers.filter(d => d._id !== developerToDelete));
      } else {
        toast.error('Failed to delete developer');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setDeleteModalOpen(false);
      setDeveloperToDelete(null);
    }
  };

  const openEditModal = (developer: Developer) => {
    setEditingDeveloper(developer);
    setFormData({
      name: developer.name,
      role: developer.role,
      bio: developer.bio,
      github: developer.github,
      linkedin: developer.linkedin,
      skills: developer.skills.join(', ')
    });
    setImagePreview(developer.image);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', github: '', linkedin: '', skills: '' });
    setEditingDeveloper(null);
    setImagePreview('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-indigo-500 font-mono tracking-widest animate-pulse">Paradoxing.......</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Developers</h1>
          <p className="text-[#888888] font-light">Add, edit, or remove developers from the team.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Developer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((developer) => (
          <motion.div
            key={developer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.1]">
                  {developer.image ? (
                    <img src={developer.image} alt={developer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-[#888888]" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#EDEDED]">{developer.name}</h3>
                  <p className="text-sm text-indigo-400">{developer.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(developer)}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#888888] hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setDeveloperToDelete(developer._id);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-[#888888] mb-4 line-clamp-2">{developer.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {developer.skills.slice(0, 3).map(skill => (
                <span key={skill} className="text-xs px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[#888888]">
                  {skill}
                </span>
              ))}
              {developer.skills.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[#888888]">
                  +{developer.skills.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
              {developer.github && (
                <a href={developer.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-[#888888] hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {developer.linkedin && (
                <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-[#888888] hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}

        {developers.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-white/[0.1] rounded-3xl bg-white/[0.01]">
            <Code2 className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[#EDEDED] mb-2">No developers found</h3>
            <p className="text-[#888888]">Add your first developer to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-white/[0.1] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[calc(100vh-4rem)]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.05] shrink-0">
              <h2 className="text-xl font-bold text-[#EDEDED]">
                {editingDeveloper ? 'Edit Developer' : 'Add Developer'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#888888] hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-white/[0.05] border-2 border-dashed border-white/[0.2] group-hover:border-indigo-500/50 transition-colors flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[#888888]" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-medium text-white">Upload</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="paradox"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Role</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="paradox"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#888888] mb-2">Bio</label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors h-24 resize-none"
                    placeholder="paradox"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#888888] mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="paradox"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="paradox"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="paradox"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 border-t border-white/[0.05] shrink-0 bg-[#111111]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-[#888888] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingDeveloper ? 'Update Developer' : 'Add Developer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Developer"
        message="Are you sure you want to delete this developer? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeveloperToDelete(null);
        }}
      />
    </div>
  );
}
