import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/auth';
import { UserCircle, Save, Camera, Upload, Shield } from 'lucide-react';
import { compressImage } from '../lib/imageUtils';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profile_pic: user?.profile_pic || '',
    password: '',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Image = await compressImage(file);
      setFormData({ ...formData, profile_pic: base64Image });
      toast.success('Image compressed and ready to save');
    } catch (error: any) {
      console.error('Error compressing image:', error);
      toast.error(error.message || 'Failed to process image');
      setStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      // Only send password if it was changed
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        updateUser(updatedUser);
        setStatus('success');
        toast.success('Profile updated successfully!');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to update profile');
        setStatus('error');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Profile Settings</h1>
        <p className="text-[#888888] font-light">Manage your account details and preferences.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50 pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-white/[0.05]">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-white/[0.03] flex items-center justify-center overflow-hidden border border-white/[0.1] shadow-xl">
                {formData.profile_pic ? (
                  <img src={formData.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-14 h-14 text-white/20" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm">
                <Camera className="w-6 h-6 text-[#EDEDED]" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h3 className="text-2xl font-semibold text-[#EDEDED] tracking-tight">{user?.name}</h3>
              <p className="text-[15px] text-[#888888] font-light">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                {user?.role}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                Profile Picture URL or Upload
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={formData.profile_pic}
                  onChange={(e) => setFormData({ ...formData, profile_pic: e.target.value })}
                  className="flex-1 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/50"
                  placeholder="https://example.com/avatar.jpg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-2 text-[#EDEDED] font-medium text-[14px]"
                >
                  <Upload className="w-4 h-4 text-[#888888]" />
                  <span className="hidden sm:inline">Upload</span>
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
              <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light resize-none placeholder:text-[#888888]/50"
                placeholder="Software Engineering Student, passionate about AI..."
              />
            </div>

            <div className="pt-8 border-t border-white/[0.05]">
              <h4 className="text-lg font-medium text-[#EDEDED] mb-6 tracking-tight">Change Password</h4>
              <div>
                <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.04] outline-none transition-all duration-300 text-[#EDEDED] text-[15px] font-light placeholder:text-[#888888]/50"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
            <div className="flex-1">
              {status === 'success' && <span className="text-emerald-400 text-[13px] font-medium">Profile updated successfully!</span>}
              {status === 'error' && <span className="text-red-400 text-[13px] font-medium">Failed to update profile.</span>}
            </div>
            
            <button
              type="submit"
              disabled={status === 'saving'}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium hover:bg-[#EDEDED] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide group"
            >
              {status === 'saving' ? 'Saving...' : 'Save Changes'}
              <Save className={`w-4 h-4 ${status === 'saving' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform duration-300'}`} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
