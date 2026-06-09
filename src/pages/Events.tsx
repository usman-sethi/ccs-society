import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, ExternalLink, Search, Filter, MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import EventRegistrationModal from '../components/EventRegistrationModal';
import MagneticButton from '../components/MagneticButton';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, registrationsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/event-registrations')
        ]);
        
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }
        
        if (registrationsRes.ok) {
          const registrationsData = await registrationsRes.json();
          setRegistrations(registrationsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getParticipantCount = (eventId: string) => {
    return registrations.filter(reg => reg.event_id === eventId).length;
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (event.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filter === 'upcoming') {
        return event.date ? isFuture(new Date(event.date)) : true;
      }
      if (filter === 'past') {
        return event.date ? isPast(new Date(event.date)) : false;
      }
      return true;
    });
  }, [events, searchQuery, filter]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 relative overflow-hidden selection:bg-indigo-500/30">
      <Helmet>
        <title>Events - Core Computing Society (CCS)</title>
        <meta name="description" content="Discover upcoming hackathons, workshops, coding sessions, and tech symposiums hosted by the Core Computing Society." />
        <link rel="canonical" href="https://ccs-uop.vercel.app/events" />
      </Helmet>
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <Helmet>
        <title>Events | Core Computing Society</title>
        <meta name="description" content="Join us for exciting workshops, hackathons, and tech talks organized by the Core Computing Society." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#888888] mb-8 shadow-sm backdrop-blur-md">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium tracking-wide uppercase">Calendar</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-[1.1]">
            Society Events
          </h1>
          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto font-light leading-relaxed">
            Join us for exciting workshops, hackathons, and tech talks. Expand your knowledge and network with peers.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-16 items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full md:w-96 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl transition-colors group-hover:bg-white/[0.04] group-hover:border-white/[0.15]">
              <Search className="absolute left-5 w-5 h-5 text-[#888888]" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-transparent focus:outline-none text-[#EDEDED] placeholder:text-[#888888] text-[15px] font-light"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 w-full md:w-auto"
          >
            <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl transition-colors hover:bg-white/[0.04] hover:border-white/[0.15]">
              <Filter className="absolute left-5 w-5 h-5 text-[#888888] pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-48 pl-14 pr-10 py-4 bg-transparent focus:outline-none text-[#EDEDED] text-[15px] font-light appearance-none cursor-pointer"
              >
                <option value="all" className="bg-[#0A0A0A]">All Events</option>
                <option value="upcoming" className="bg-[#0A0A0A]">Upcoming</option>
                <option value="past" className="bg-[#0A0A0A]">Past Events</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
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
              <p className="text-[#888888] font-mono tracking-widest uppercase text-xs">Loading events...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any, index) => (
              <motion.div
                key={event._id || event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {event.image ? (
                  <div className="relative h-56 overflow-hidden border-b border-white/[0.05]">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      loading="lazy" 
                    />
                    {event.date && isFuture(new Date(event.date)) && (
                      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-indigo-500/90 text-white text-xs font-medium tracking-wide shadow-lg backdrop-blur-md">
                        Upcoming
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-56 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50" />
                    <Calendar className="w-16 h-16 text-white/[0.1] group-hover:text-indigo-500/30 transition-colors duration-500 relative z-10" />
                    {event.date && isFuture(new Date(event.date)) && (
                      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-indigo-500/90 text-white text-xs font-medium tracking-wide shadow-lg backdrop-blur-md">
                        Upcoming
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-8 flex-1 flex flex-col relative z-10">
                  <div className="flex items-center gap-4 text-[13px] text-[#888888] font-medium mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>{event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'TBA'}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-2xl font-semibold tracking-tight text-[#EDEDED] leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.05] text-[#888888] shrink-0" title="Registered Participants">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{getParticipantCount(event._id || event.id)}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#888888] mb-8 flex-1 line-clamp-3 font-light leading-relaxed text-[15px]">
                    {event.description}
                  </p>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-[13px] text-[#888888] mb-6">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                  
                  {(!event.date || isFuture(new Date(event.date))) && (
                    <MagneticButton
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="group/btn relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-medium transition-all duration-300 hover:bg-[#EDEDED] mt-auto overflow-hidden"
                    >
                      <span className="relative z-10 tracking-wide text-sm">Register Now</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </MagneticButton>
                  )}
                  {event.date && isPast(new Date(event.date)) && (
                    <div className="w-full px-6 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[#888888] font-medium text-center mt-auto text-sm tracking-wide">
                      Event Concluded
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-32">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6 shadow-inner">
                  <Calendar className="w-6 h-6 text-[#888888]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">No events found</h3>
                <p className="text-[#888888] font-light">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
