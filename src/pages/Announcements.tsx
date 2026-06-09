import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Bell, Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        } else {
          console.error("Failed to load announcements");
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const matchesSearch = (announcement.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (announcement.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [announcements, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <Helmet>
        <title>Announcements | Core Computing Society</title>
        <meta name="description" content="Stay updated with the latest news, updates, and announcements from the Core Computing Society." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-8 shadow-sm backdrop-blur-md">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium tracking-wide uppercase">Notices</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-[1.1]">
            Announcements
          </h1>
          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto font-light leading-relaxed">
            Stay updated with the latest news, updates, and important notices from the society.
          </p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full max-w-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl transition-colors group-hover:bg-white/[0.04] group-hover:border-white/[0.15]">
              <Search className="absolute left-5 w-5 h-5 text-[#888888]" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-transparent focus:outline-none text-[#EDEDED] placeholder:text-[#888888] text-[15px] font-light"
              />
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-white/[0.08] rounded-full" />
                <div className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-[#888888] font-mono tracking-widest uppercase text-xs">Loading updates...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredAnnouncements.map((announcement: any, index) => {
              const announcementId = announcement._id || announcement.id;
              return (
              <motion.div
                key={announcementId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="p-0 relative z-10">
                  {/* MacOS style window header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A]/50 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <div className="text-[11px] font-mono text-[#888888] flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {announcement.created_at ? format(new Date(announcement.created_at), 'MMM d, yyyy') : 'Unknown Date'}
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 font-mono text-[14px]">
                    <div className="mb-6">
                      <span className="text-pink-400">const</span> <span className="text-blue-400">announcement</span> <span className="text-white">=</span> <span className="text-yellow-300">"{announcement.title}"</span><span className="text-white">;</span>
                    </div>
                    
                    {announcement.image && (
                      <div className="mb-8 rounded-xl overflow-hidden border border-white/[0.05] bg-white/[0.02]">
                        <img 
                          src={announcement.image} 
                          alt={announcement.title} 
                          className="w-full h-auto max-h-[400px] object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    <div className="text-[#A0A0A0] leading-relaxed">
                      <span className="text-emerald-400">/**</span><br/>
                      {announcement.content.split('\n').map((paragraph: string, i: number) => (
                        <div key={i} className="flex">
                          <span className="text-emerald-400 mr-2"> *</span>
                          <span>{paragraph}</span>
                        </div>
                      ))}
                      <span className="text-emerald-400"> */</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-32 bg-white/[0.02] rounded-3xl border border-white/[0.05]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6 shadow-inner">
                  <Bell className="w-6 h-6 text-[#888888]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">No announcements found</h3>
                <p className="text-[#888888] font-light">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
