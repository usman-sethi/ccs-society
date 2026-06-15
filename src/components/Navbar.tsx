import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import MagneticButton from './MagneticButton';

const BrandLogo = () => {
  const fullText = "CORE COMPUTER SOCIETY";
  const mobileText = "CCS";
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    const textToType = isMobile ? mobileText : fullText;
    let i = 0;
    setDisplayedText("");
    setShowCursor(true);
    
    const typingInterval = setInterval(() => {
      if (i < textToType.length) {
        setDisplayedText(textToType.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowCursor(false);
        }, 2000);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center font-mono text-[14px] sm:text-[12px] md:text-[13px] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 whitespace-nowrap"
    >
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? [1, 0] : 0 }}
        transition={{ repeat: showCursor ? Infinity : 0, duration: 0.8, ease: "linear" }}
        className="inline-block w-[4px] sm:w-[6px] h-[14px] sm:h-[15px] bg-indigo-400 ml-[4px] sm:ml-[6px] align-middle shadow-[0_0_8px_rgba(129,140,248,0.6)]"
      />
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Teams', path: '/teams' },
    { name: 'Events', path: '/events' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Developers', path: '/developers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none pt-4 sm:pt-6">
        <div 
          className={`pointer-events-auto w-full max-w-6xl flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled 
              ? 'bg-[#050505]/70 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl py-3 px-4 sm:px-6' 
              : 'bg-transparent border-transparent py-2 px-0'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
            <div className="relative w-10 h-10 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-white/[0.08] group-hover:scale-105 group-hover:border-indigo-500/30 shadow-inner">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/logo.jpeg" alt="CCS Logo" width="40" height="40" className="w-full h-full object-contain relative z-10" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }} />
              <Terminal className="w-4 h-4 text-[#EDEDED] hidden relative z-10" />
            </div>
            <div className="flex items-center h-[24px]">
              <BrandLogo />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-white/[0.02] border border-white/[0.05] rounded-full p-1 backdrop-blur-md shadow-inner overflow-x-auto no-scrollbar">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-1.5 xl:px-5 xl:py-2 rounded-full text-[12px] xl:text-[13px] font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-[#888888] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-3 py-2"
                >
                  Dashboard
                </Link>
                <div className="w-[1px] h-4 bg-white/[0.1]"></div>
                <button
                  onClick={logout}
                  className="text-[13px] font-medium text-red-400/80 hover:text-red-400 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md px-3 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full px-4 py-2"
                >
                  Log in
                </Link>
                  <MagneticButton
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/signup');
                    }}
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-white/[0.05] border border-white/[0.1] rounded-full overflow-hidden transition-all hover:bg-white/[0.1] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="relative z-10">Sign up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </MagneticButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#888888] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg bg-white/[0.02] border border-white/[0.05]"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Side Menu */}
            <motion.div
              initial={{ x: "100%", rotateY: -10 }}
              animate={{ x: 0, rotateY: 0 }}
              exit={{ x: "100%", rotateY: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-50 lg:hidden bg-[#050505]/95 backdrop-blur-3xl border-l border-white/[0.05] flex flex-col pt-24 px-6 overflow-y-auto shadow-[-20px_0_40px_rgba(0,0,0,0.5)] perspective-[1000px]"
            >
              <div className="flex flex-col gap-2 transform-style-3d">
                {links.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20, rotateX: 10 }}
                      animate={{ opacity: 1, x: 0, rotateX: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl text-lg font-medium transition-all duration-300 active:scale-95 ${
                          isActive
                            ? 'bg-white/[0.08] text-white border border-white/[0.05] shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                            : 'text-[#888888] hover:bg-white/[0.04] hover:text-white border border-transparent'
                        }`}
                      >
                        {link.name}
                        {isActive && <ChevronRight className="w-5 h-5 text-indigo-400" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent my-8" 
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 pb-12"
              >
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full px-6 py-4 rounded-xl text-base font-medium text-white bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center w-full px-6 py-4 rounded-xl text-base font-medium text-red-400/80 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full px-6 py-4 rounded-xl text-base font-medium text-white bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="relative flex items-center justify-center w-full px-6 py-4 rounded-xl text-base font-medium text-[#0A0A0A] bg-[#EDEDED] overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      <span className="relative z-10">Sign up</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Navbar);
