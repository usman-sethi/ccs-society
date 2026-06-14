import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, MessageSquare, ShieldAlert, ArrowRight, UserCircle, Database, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, teams: 0, members: 0, queries: 0 });
  const [isMigrating, setIsMigrating] = useState(false);
  const [showMigrateConfirm, setShowMigrateConfirm] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fetchJson = async (url: string) => {
          const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          return res.json();
        };

        const [events, teams, members, queries] = await Promise.all([
          fetchJson('/api/events'),
          fetchJson('/api/teams'),
          fetchJson('/api/members'),
          fetchJson('/api/queries')
        ]);

        setStats({
          events: events.length || 0,
          teams: teams.length || 0,
          members: members.length || 0,
          queries: queries.length || 0
        });
      } catch (err: any) {
        if (err && (err.message === 'Failed to fetch' || err.message.includes('NetworkError'))) {
           console.warn('Network error during background fetch (likely dev server reload)');
        } else {
           console.error('Failed to fetch dashboard stats:', err);
        }
      }
    };

    fetchStats();
  }, []);

  const handleMigrate = async () => {
    setShowMigrateConfirm(false);
    setIsMigrating(true);
    try {
      const res = await fetch('/api/migrate', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Migration completed successfully!');
        console.log('Migration results:', data.results);
      } else {
        toast.error('Migration failed: ' + data.error);
      }
    } catch (error) {
      toast.error('An error occurred during migration.');
      console.error(error);
    } finally {
      setIsMigrating(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Events',
      description: 'Add, edit, or remove society events.',
      icon: Calendar,
      path: '/admin/events',
      colorClass: 'bg-indigo-500/10 text-indigo-400'
    },
    {
      title: 'Manage Teams',
      description: 'Create and update specialized teams.',
      icon: Users,
      path: '/admin/teams',
      colorClass: 'bg-purple-500/10 text-purple-400'
    },
    {
      title: 'Manage Members',
      description: 'Assign users to teams and set roles.',
      icon: UserCircle,
      path: '/admin/members',
      colorClass: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      title: 'Manage Users',
      description: 'View registered users and block/remove them.',
      icon: ShieldAlert,
      path: '/admin/users',
      colorClass: 'bg-rose-500/10 text-rose-400'
    },
    {
      title: 'Manage Registrations',
      description: 'Review and approve event registrations.',
      icon: ClipboardList,
      path: '/admin/registrations',
      colorClass: 'bg-blue-500/10 text-blue-400'
    }
  ];

  return (
    <div className="space-y-12 relative z-10">
      <ConfirmModal
        isOpen={showMigrateConfirm}
        title="Migrate Data"
        message="Are you sure you want to migrate data from SQLite to Google Sheets? This will only append data to empty sheets."
        onConfirm={handleMigrate}
        onCancel={() => setShowMigrateConfirm(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 perspective-[1000px]"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Admin Dashboard</h1>
          <p className="text-[#888888] font-light text-lg">Overview of society metrics and quick actions.</p>
        </div>
        <button
          onClick={() => setShowMigrateConfirm(true)}
          disabled={isMigrating}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[#EDEDED] rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
        >
          <Database className="w-4 h-4 text-[#888888]" />
          {isMigrating ? 'Migrating...' : 'Migrate SQLite to Sheets'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: 5, rotateY: -5 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 group backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)]"
          onClick={() => window.location.href = '/admin/events'}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">Total Events</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{stats.events}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-300 group backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)]"
          onClick={() => window.location.href = '/admin/teams'}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">Total Teams</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{stats.teams}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: -5, rotateY: -5 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-300 group backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
          onClick={() => window.location.href = '/admin/members'}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <UserCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">Total Members</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{stats.members}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: -5, rotateY: 5 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-rose-500/30 transition-all duration-300 group backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(244,63,94,0.15)]"
          onClick={() => window.location.href = '/admin/queries'}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">Total Queries</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{stats.queries}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-8 tracking-tight text-[#EDEDED]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link 
                key={action.title} 
                to={action.path}
                className="group p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between backdrop-blur-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3.5 rounded-2xl ${action.colorClass} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#EDEDED] tracking-tight">{action.title}</h3>
                    <p className="text-[14px] text-[#888888] font-light mt-1">{action.description}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors duration-300">
                  <ArrowRight className="w-5 h-5 text-[#888888] group-hover:text-[#EDEDED] transition-colors group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
