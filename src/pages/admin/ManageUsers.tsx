import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { UserCircle, Shield, User, Trash2, Search, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../lib/auth';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const { user: currentUser } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleDeleteClick = (id: string, role: string) => {
    if (role === 'Admin') {
      toast.error('Cannot delete an Admin user.');
      return;
    }
    if (id === currentUser?.id) {
      toast.error('Cannot delete yourself.');
      return;
    }
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/users/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        toast.success('User deleted successfully!');
        setDeleteId(null);
        fetchUsers();
      } catch (error: any) {
        toast.error(error.message || 'An unexpected error occurred');
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
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
            Users
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#EDEDED]">Manage Users</h1>
          <p className="text-[#888888] font-light">View all registered users and their roles.</p>
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
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">User</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Email</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Role</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide">Joined</th>
                <th className="p-5 text-[13px] font-medium text-[#888888] uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => {
                const userId = user._id || user.id;
                return (
                <tr key={userId} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-300">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0">
                        {user.profile_pic ? (
                          <img src={user.profile_pic} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle className="w-6 h-6 text-[#888888]" />
                        )}
                      </div>
                      <div className="font-medium text-[#EDEDED] tracking-tight">{user.name}</div>
                    </div>
                  </td>
                  <td className="p-5 text-[14px] text-[#888888] font-light">{user.email}</td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${
                      user.role === 'Admin' 
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-white/[0.05] text-[#888888] border border-white/[0.1]'
                    }`}>
                      {user.role === 'Admin' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="p-5 text-[14px] text-[#888888] font-light">
                    {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'Unknown'}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleDeleteClick(userId, user.role)}
                      disabled={user.role === 'Admin' || userId === currentUser?.id}
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#888888] hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )})}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#888888] font-light">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
