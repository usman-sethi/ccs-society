import { motion } from 'motion/react';
import { Sparkles, Target, Users, Zap, Shield, Globe, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  const aims = [
    { icon: <Users className="w-5 h-5" />, text: "Provide equal participation for all semesters" },
    { icon: <Zap className="w-5 h-5" />, text: "Encourage skills development and tech learning activities" },
    { icon: <Globe className="w-5 h-5" />, text: "Build unity among all computing departments" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Give freshers a voice and platform" },
    { icon: <Award className="w-5 h-5" />, text: "Organize workshops, competitions, and events without favouritism" },
    { icon: <Shield className="w-5 h-5" />, text: "Promote a positive culture of respect, learning and representation" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 relative overflow-hidden selection:bg-indigo-500/30">
      <Helmet>
        <title>About - Core Computing Society (CCS)</title>
        <meta name="description" content="Learn about the mission, vision, and core values of the Core Computing Society at the University of Peshawar." />
        <link rel="canonical" href="https://ccs-uop.vercel.app/about" />
      </Helmet>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-8 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium tracking-wide uppercase">Our Story</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-[#888888] font-light italic max-w-2xl mx-auto">
            "For Students — By Students"
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-10 md:p-16 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden group hover:bg-white/[0.04] transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 shadow-inner">
                <Target className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold mb-4 tracking-tight text-[#EDEDED]">Our Mission</h2>
                <p className="text-[#888888] leading-relaxed text-lg md:text-xl font-light max-w-3xl">
                  Our Mission is to create a fair, inclusive, and empowering environment for all computing students. We believe in building a community where every voice is heard and every idea has the potential to change the world.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Aim Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-10 md:p-16 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden group hover:bg-white/[0.04] transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 shadow-inner">
                  <Globe className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-[#EDEDED]">Our Aim</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aims.map((aim, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                    className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-emerald-400 flex items-center justify-center shadow-inner">
                      {aim.icon}
                    </div>
                    <span className="text-[#888888] font-light leading-relaxed pt-2">
                      {aim.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
