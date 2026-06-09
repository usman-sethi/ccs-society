import { Link } from 'react-router-dom';
import { Terminal, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.05] pt-24 pb-12 relative z-10 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <Link to="/" className="flex items-center gap-3 mb-6 group outline-none rounded-lg w-fit">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-white/[0.05] group-hover:scale-105 group-hover:border-indigo-500/30 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <img src="/logo.jpeg" alt="CCS Logo" width="40" height="40" className="w-full h-full object-contain" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }} />
                <Terminal className="w-5 h-5 text-indigo-400 hidden" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#EDEDED] group-hover:text-indigo-400 transition-colors duration-300">
                Core Computer Society
              </span>
            </Link>
            <p className="text-[#888888] text-sm leading-relaxed max-w-sm mb-8 font-light">
              Empowering students through technology, innovation, and collaborative learning. We don't just write code—we architect the future.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="GitHub Profile" className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[#888888] hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all duration-300 hover:scale-110">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram Profile" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[#888888] hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all duration-300 hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[#888888] hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all duration-300 hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 md:col-start-8"
          >
            <h3 className="text-[#EDEDED] text-sm font-semibold tracking-wider uppercase mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/teams" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors">Teams</Link></li>
              <li><Link to="/events" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors">Events</Link></li>
              <li><Link to="/announcements" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors">Announcements</Link></li>
              <li><Link to="/developers" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors">Developers</Link></li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2"
          >
            <h3 className="text-[#EDEDED] text-sm font-semibold tracking-wider uppercase mb-6">Connect</h3>
            <ul className="space-y-4">
              <li><a href="mailto:demo@example.com" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> demo@example.com</a></li>
              <li><Link to="/contact" className="text-[14px] text-[#888888] hover:text-indigo-400 transition-colors">Contact Form</Link></li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-[#888888] text-[13px] font-light">
            © {new Date().getFullYear()} Core Computer Society. Designed & Developed by Paradox.
          </p>
          <div className="flex items-center gap-8 text-[13px] text-[#888888] font-light">
            <Link to="/privacy" className="hover:text-[#EDEDED] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#EDEDED] transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
