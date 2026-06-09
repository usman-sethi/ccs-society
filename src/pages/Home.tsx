import { motion, useScroll, useTransform } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Calendar, Users, Cpu, ArrowRight, Sparkles, Globe, Code, Zap, Shield } from 'lucide-react';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import MagneticButton from '../components/MagneticButton';
import CanvasBackground from '../components/CanvasBackground';
import TextReveal from '../components/TextReveal';

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const marqueeItems = [
    "CORE COMPUTING SOCIETY", "CORE COMPUTING SOCIETY", "CORE COMPUTING SOCIETY", "CORE COMPUTING SOCIETY"
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#EDEDED] overflow-hidden selection:bg-indigo-500/30">
      <Helmet>
        <title>Core Computing Society (CCS) - Code and Build the Future</title>
        <meta name="description" content="Welcome to the Core Computing Society. We are a collective of relentless builders, hackers, and visionaries. Architect the future and forge lifelong connections." />
        <meta name="keywords" content="Core Computing Society, Tech, Coding, University, Programming, Hackathons, Open Source, Development" />
        <link rel="canonical" href="https://ccs-uop.vercel.app/" />
        <meta property="og:title" content="Core Computing Society (CCS) - University of Peshawar" />
        <meta property="og:description" content="Welcome to the Core Computing Society. We are a collective of relentless builders, hackers, and visionaries." />
      </Helmet>
      
      <CanvasBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20 px-6">
        <motion.div 
          style={{ y, opacity }}
          className="max-w-7xl mx-auto text-center w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center perspective-[1000px]"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-[#888888] mb-8 shadow-sm backdrop-blur-3xl animated-border">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono tracking-widest uppercase">Core Computer Society</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter mb-6 leading-[1.05] relative pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
              <TextReveal text="Build the future." />
              <div className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20">
                <TextReveal text="Line by line." delay={0.4} />
              </div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg md:text-2xl text-[#888888] max-w-3xl mx-auto mb-12 leading-relaxed font-light pointer-events-none"
            >
              Welcome to the Core Computer Society. We are a collective of relentless builders, hackers, and visionaries. Here, we don't just write code—we architect the future and forge lifelong connections.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto relative z-50 pointer-events-auto transform-style-3d"
            >
              <MagneticButton
                onClick={() => navigate('/signup')}
                className="group relative inline-flex items-center justify-center gap-3 w-full px-10 py-5 text-base font-medium text-[#0A0A0A] bg-[#EDEDED] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <span className="relative z-10 flex items-center gap-2 font-semibold">
                  Join the Society <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </MagneticButton>
              <MagneticButton
                onClick={() => navigate('/events')}
                className="inline-flex items-center justify-center w-full px-10 py-5 rounded-full bg-white/[0.02] text-[#EDEDED] text-base font-medium hover:bg-white/[0.06] transition-colors border border-white/[0.08] backdrop-blur-xl outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <span className="relative z-10">Explore Events</span>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-[#EDEDED]">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">grow.</span>
            </h2>
            <p className="text-[#888888] max-w-2xl mx-auto text-xl font-light">
              We provide the resources, network, and platform to accelerate your journey in tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
            {/* Feature 1 - Large */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 relative rounded-[2.5rem] glass-card glass-card-hover group overflow-hidden perspective-[1000px] transform-style-3d shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-colors duration-700" />
              
              <div className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                  <Code className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight text-[#EDEDED]">Technical Excellence</h3>
                  <p className="text-[#888888] font-light leading-relaxed max-w-lg text-lg">
                    Master your craft through our exclusive workshops, rigorous hackathons, and collaborative open-source projects led by senior society members.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 - Small */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2.5rem] glass-card glass-card-hover group overflow-hidden perspective-[1000px] transform-style-3d shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight text-[#EDEDED]">Global Network</h3>
                  <p className="text-[#888888] font-light leading-relaxed">
                    Join an elite brotherhood and sisterhood of developers. Connect with CCS alumni thriving at top-tier tech giants.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 - Small */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ scale: 1.02, rotateX: -2, rotateY: -2 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2.5rem] glass-card glass-card-hover group overflow-hidden perspective-[1000px] transform-style-3d shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight text-[#EDEDED]">Epic Events</h3>
                  <p className="text-[#888888] font-light leading-relaxed">
                    Experience our flagship hackathons, late-night coding sessions, and tech symposiums that define the CCS culture.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 4 - Large */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ scale: 1.02, rotateX: -2, rotateY: 2 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 relative rounded-[2.5rem] glass-card glass-card-hover group overflow-hidden perspective-[1000px] transform-style-3d shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors duration-700" />
              
              <div className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight text-[#EDEDED]">Real-world Impact</h3>
                  <p className="text-[#888888] font-light leading-relaxed max-w-lg text-lg">
                    The Core Computer Society builds solutions that matter. We partner with real organizations to deliver software that creates tangible change.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="relative z-10 py-10 border-y border-white/[0.05] overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((text, i) => (
            <span key={i} className="mx-8 text-2xl md:text-4xl font-mono font-bold text-white/[0.05] tracking-widest">
              {text} <span className="text-indigo-500/20 mx-4">//</span>
            </span>
          ))}
        </div>
      </section>
      
      {/* Bottom CTA */}
      <section 
        className="relative z-10 py-32 sm:py-48 px-6 border-t border-white/[0.05] overflow-hidden group min-h-[60vh] flex flex-col items-center justify-center bg-black"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
        }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/logo.jpeg"
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
        >
          <source src="/video.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80 z-0 pointer-events-none" />

        {/* Torch Effect */}
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0 hidden sm:block"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)`
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-8 px-4"
          >
            Ready to join <br className="hidden sm:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">the Core?</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative z-50 pointer-events-auto px-4"
          >
            <MagneticButton
              onClick={() => navigate('/signup')}
              className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-bold text-[#0A0A0A] bg-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
