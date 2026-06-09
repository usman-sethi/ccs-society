import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Code2, Terminal, Cpu, Loader2 } from 'lucide-react';

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

export default function Developers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        console.error('Failed to fetch developers:', error);
        setDevelopers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-indigo-500 font-mono tracking-widest animate-pulse">Paradoxing.......</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#EDEDED] pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-[#888888] mb-8 shadow-sm backdrop-blur-3xl animated-border">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono tracking-widest uppercase">Our Team</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Meet the Developers
          </h1>
          <p className="text-[#888888] max-w-2xl mx-auto text-xl font-light">
            The minds behind the Core Computer Society platform. We build the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {developers.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Code2 className="w-16 h-16 text-[#888888] mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-medium text-[#EDEDED] mb-2">No developers found</h3>
              <p className="text-[#888888]">The team is currently being assembled.</p>
            </div>
          ) : (
            developers.map((dev, idx) => (
              <motion.div
                key={dev._id}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl perspective-[1000px] transform-style-3d shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] group flex flex-col"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-indigo-500/30 group-hover:border-indigo-400 transition-colors shrink-0">
                  {dev.image ? (
                    <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/[0.05] flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-[#888888]" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#EDEDED] mb-1">{dev.name}</h3>
                <p className="text-indigo-400 text-sm font-medium mb-4">{dev.role}</p>
                <p className="text-[#888888] font-light mb-6 leading-relaxed flex-1">{dev.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {dev.skills.map(skill => (
                    <span key={skill} className="text-xs px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#888888]">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {dev.github && (
                    <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.1] text-[#888888] hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {dev.linkedin && (
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.1] text-[#888888] hover:text-white transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
