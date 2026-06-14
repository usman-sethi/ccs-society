import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X, Search, ChevronRight, Code, Cpu, Globe, Database, Shield, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Helper to get a random icon based on team name
const getTeamIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('web') || n.includes('front')) return <Globe className="w-6 h-6" />;
  if (n.includes('data') || n.includes('back')) return <Database className="w-6 h-6" />;
  if (n.includes('sec') || n.includes('cyber')) return <Shield className="w-6 h-6" />;
  if (n.includes('ai') || n.includes('ml')) return <Cpu className="w-6 h-6" />;
  if (n.includes('design') || n.includes('ui')) return <Zap className="w-6 h-6" />;
  return <Code className="w-6 h-6" />;
};

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, membersRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/members')
        ]);
        
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData);
        }
        
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTeam]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      return (team.team_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
             (team.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [teams, searchQuery]);

  const teamMembers = selectedTeam 
    ? members.filter((m: any) => m.team_id === (selectedTeam._id || selectedTeam.id))
    : [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <Helmet>
        <title>Teams | Core Computing Society</title>
        <meta name="description" content="Discover the specialized teams that power the Core Computing Society." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-8 shadow-sm backdrop-blur-md">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium tracking-wide uppercase">Divisions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-[1.1]">
            Our Teams
          </h1>
          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto font-light leading-relaxed">
            The specialized forces driving innovation within the Core Computing Society. Find your tribe and start building.
          </p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full max-w-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl transition-colors group-hover:bg-white/[0.04] group-hover:border-white/[0.15]">
              <Search className="absolute left-5 w-5 h-5 text-[#888888]" />
              <input
                type="text"
                placeholder="Search teams by name..."
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
                <div className="absolute inset-0 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="text-[#888888] font-mono tracking-widest uppercase text-xs">Initializing...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team: any, index) => (
              <motion.div
                key={team._id || team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedTeam(team)}
                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-[#888888] group-hover:text-indigo-400 shadow-inner">
                    {getTeamIcon(team.team_name)}
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3 tracking-tight text-[#EDEDED]">
                    {team.team_name}
                  </h3>
                  
                  <p className="text-[#888888] flex-1 leading-relaxed font-light text-[15px]">
                    {team.description}
                  </p>
                  
                  <div className="mt-8 flex items-center text-[13px] font-medium text-[#888888] group-hover:text-[#EDEDED] transition-colors duration-300">
                    <span className="tracking-wide">View Members</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredTeams.length === 0 && (
              <div className="col-span-full text-center py-32">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6 shadow-inner">
                  <Search className="w-6 h-6 text-[#888888]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">No teams found</h3>
                <p className="text-[#888888] font-light">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Team Members */}
      {createPortal(
        <AnimatePresence>
          {selectedTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0A]/80 backdrop-blur-xl"
              onClick={() => setSelectedTeam(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-black flex flex-col"
              >
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none rounded-t-3xl" />
                
                <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10 shrink-0">
                  <div className="pr-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-4 md:mb-6 text-[10px] sm:text-xs font-medium tracking-wide uppercase shadow-sm backdrop-blur-md">
                      Team Roster
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-[#EDEDED] leading-[1.1]">
                      {selectedTeam.team_name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="p-2 sm:p-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0 inline-flex items-center justify-center mt-1 sm:mt-0"
                  >
                    <X className="w-5 h-5 text-[#888888] group-hover:text-[#EDEDED] group-hover:rotate-90 transition-all duration-300" />
                  </button>
                </div>

                {teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10 shrink-0 pb-4">
                    {teamMembers.map((member: any, idx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        key={member._id || member.id} 
                        className="group flex flex-col items-center text-center p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500"
                      >
                        <div className="relative mb-5 md:mb-6">
                          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-white/[0.1] group-hover:border-indigo-400/50 transition-colors duration-500"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          ) : (
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/[0.05] border border-white/[0.1] group-hover:border-indigo-400/50 flex items-center justify-center transition-colors duration-500 shadow-inner">
                              <Users className="w-6 h-6 md:w-8 md:h-8 text-[#888888] group-hover:text-indigo-400 transition-colors duration-500" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold text-base md:text-lg tracking-tight mb-1 text-[#EDEDED]">{member.name}</h4>
                        <p className="text-indigo-400/80 text-xs font-medium tracking-wide uppercase mb-3">{member.role}</p>
                        {member.bio && (
                          <p className="text-[#888888] text-[13px] leading-relaxed font-light">{member.bio}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6 shadow-inner">
                      <Users className="w-6 h-6 text-[#888888]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">Empty Roster</h3>
                    <p className="text-[#888888] font-light">No members have been assigned to this team yet.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
