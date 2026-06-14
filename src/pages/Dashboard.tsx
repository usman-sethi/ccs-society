import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/auth';
import { Calendar, Users, Bell, Activity, MessageSquare, RefreshCw, ArrowRight, GitCommit } from 'lucide-react';
import { format } from 'date-fns';
import ActivityGraph from '../components/ActivityGraph';
import SubmitFeedbackModal from '../components/SubmitFeedbackModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fetchJson = async (url: string) => {
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        try {
          return text ? JSON.parse(text) : [];
        } catch (e) {
          console.error(`Failed to parse JSON from ${url}:`, text.substring(0, 100));
          return [];
        }
      };

      const [eventsData, teamsData, announcementsData, queriesData] = await Promise.all([
        fetchJson('/api/events'),
        fetchJson('/api/teams'),
        fetchJson('/api/announcements'),
        user?.role === 'Admin' ? fetchJson('/api/queries') : Promise.resolve([])
      ]);
      setEvents(eventsData);
      setTeams(teamsData);
      setAnnouncements(announcementsData);
      setQueries(queriesData);
    } catch (error: any) {
      // Ignore network errors which commonly happen during dev server hot-restarts
      if (error && (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))) {
        console.warn('Network error during background fetch (likely dev server reload)');
      } else {
        console.error('Failed to fetch dashboard data:', error);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const recentActivities = useMemo(() => {
    const activities: any[] = [];
    
    events.forEach(e => {
      activities.push({
        id: `event-${e.id}`,
        type: 'event',
        title: `New Event: ${e.title}`,
        date: e.created_at || new Date(parseInt(e.id)).toISOString(),
        icon: Calendar,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10 border-indigo-500/20'
      });
    });

    announcements.forEach(a => {
      activities.push({
        id: `announcement-${a.id}`,
        type: 'announcement',
        title: `Announcement: ${a.title}`,
        date: a.created_at || new Date(parseInt(a.id)).toISOString(),
        icon: Bell,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20'
      });
    });

    teams.forEach(t => {
      activities.push({
        id: `team-${t.id}`,
        type: 'team',
        title: `New Team Created: ${t.team_name}`,
        date: new Date(parseInt(t.id)).toISOString(),
        icon: Users,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/20'
      });
    });

    if (user?.role === 'Admin') {
      queries.forEach(q => {
        activities.push({
          id: `query-${q.id}`,
          type: 'query',
          title: `New Query from ${q.name}`,
          date: q.created_at || new Date(parseInt(q.id)).toISOString(),
          icon: MessageSquare,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20'
        });
      });
    }

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [events, announcements, teams, queries, user]);

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="perspective-[1000px]"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
            Welcome back, <span className="text-indigo-400">{user?.name}</span>
          </h1>
          <p className="text-[#888888] font-light text-lg">Here's what's happening in the society.</p>
        </motion.div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-full text-[13px] font-medium transition-all duration-300 text-white backdrop-blur-md"
          >
            <MessageSquare className="w-4 h-4" />
            Submit Feedback
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            onClick={fetchData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-full text-[13px] font-medium transition-all duration-300 disabled:opacity-50 text-[#EDEDED] backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-[#888888]'}`} />
            Refresh Stats
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: 5, rotateY: -5 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group relative overflow-hidden backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)]"
          onClick={() => window.location.href = '/events'}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-5 mb-2">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wide mb-1">Total Events</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{events.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group relative overflow-hidden backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)]"
          onClick={() => window.location.href = '/teams'}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-5 mb-2">
            <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wide mb-1">Active Teams</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{teams.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ scale: 1.02, rotateX: -5, rotateY: -5 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group relative overflow-hidden backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]"
          onClick={() => window.location.href = '/announcements'}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-5 mb-2">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Bell className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] text-[#888888] font-medium uppercase tracking-wide mb-1">Announcements</p>
              <h3 className="text-3xl font-bold text-[#EDEDED] tracking-tight">{announcements.length}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Activity Graph Section */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-[#EDEDED] tracking-tight">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <GitCommit className="w-4 h-4 text-emerald-400" />
              </div>
              Contribution Activity
            </h2>
            <ActivityGraph />
          </div>

          {/* Latest Events Section */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold flex items-center gap-3 text-[#EDEDED] tracking-tight">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                Latest Events
              </h2>
              <button onClick={() => window.location.href = '/events'} className="text-[13px] text-[#888888] hover:text-[#EDEDED] flex items-center gap-1 transition-colors group">
                View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-4">
            {events.slice(0, 3).map((event: any) => (
              <div key={event.id} className="flex flex-col sm:flex-row items-start gap-5 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 group cursor-pointer" onClick={() => window.location.href = '/events'}>
                <div className="w-full sm:w-24 h-24 sm:h-24 rounded-xl bg-white/[0.02] border border-white/[0.05] flex-shrink-0 overflow-hidden relative">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent sm:hidden" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-[#EDEDED] text-lg truncate group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
                      {event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'TBA'}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#888888] mt-2 line-clamp-2 font-light leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-12 border border-dashed border-white/[0.05] rounded-2xl">
                <Calendar className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-[#888888] text-[14px] font-light">No upcoming events.</p>
              </div>
            )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 text-[#EDEDED] tracking-tight">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            Recent Activity
          </h2>
          <div className="space-y-6">
            {recentActivities.map((activity: any, index: number) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-4 relative">
                  {index !== recentActivities.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-[1px] bg-white/[0.05]" />
                  )}
                  <div className={`p-2.5 rounded-xl border ${activity.bg} shrink-0 relative z-10`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="pt-1">
                    <p className="text-[14px] font-medium text-[#EDEDED] leading-snug">{activity.title}</p>
                    <p className="text-[12px] text-[#888888] mt-1 font-light">
                      {activity.date ? format(new Date(activity.date), 'MMM d, yyyy h:mm a') : 'Unknown time'}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentActivities.length === 0 && (
              <div className="text-center py-12 border border-dashed border-white/[0.05] rounded-2xl">
                <Activity className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-[#888888] text-[14px] font-light">No recent activity.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <SubmitFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        user={user}
      />
    </div>
  );
}
