import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

export default function EventRegistrationModal({ isOpen, onClose, event }: EventRegistrationModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    program: '',
    section: '',
    mobile_number: '+92 ',
    email: ''
  });

  const [paymentProof, setPaymentProof] = useState<string>('');

  const getStorageKey = () => {
    return user?.email ? `event_registrations_${user.email}` : 'event_registrations_guest';
  };

  useEffect(() => {
    if (isOpen && event) {
      const eventId = event._id || event.id;
      // Check if already registered in local storage for this specific user
      const storageKey = getStorageKey();
      const storedRegs = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      if (storedRegs[eventId]) {
        const regId = storedRegs[eventId].id;
        setRegistrationId(regId);
        setStatus(storedRegs[eventId].status);
        setStep(4); // Show status

        // Fetch latest status from server
        const fetchStatus = async () => {
          try {
            const response = await fetch('/api/event-registrations');
            if (response.ok) {
              const registrations = await response.json();
              const currentReg = registrations.find((r: any) => (r._id || r.id) === regId);
              if (currentReg && currentReg.status !== storedRegs[eventId].status) {
                setStatus(currentReg.status);
                storedRegs[eventId].status = currentReg.status;
                localStorage.setItem(storageKey, JSON.stringify(storedRegs));
              }
            }
          } catch (err) {
            console.error('Failed to fetch latest status', err);
          }
        };
        fetchStatus();
      } else {
        setStep(1);
        setFormData({
          full_name: user?.name || '',
          program: '',
          section: '',
          mobile_number: '+92 ',
          email: user?.email || ''
        });
        setPaymentProof('');
        setError('');
      }
    }
  }, [isOpen, event, user]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+92 ')) {
      val = '+92 ';
    }
    setFormData({ ...formData, mobile_number: val });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    const mobileRegex = /^\+92 \d{3} \d{3} \d{4}$/;
    if (!mobileRegex.test(formData.mobile_number.replace(/-/g, ' '))) {
      // Allow some flexibility but enforce +92 and length
      const digits = formData.mobile_number.replace(/\D/g, '');
      if (digits.length !== 12) { // 92 + 10 digits
        setError('Mobile number must be in format +92 000 000 0000');
        return;
      }
    }

    setLoading(true);
    try {
      const eventId = event._id || event.id;
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          event_id: eventId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      const newRegId = data._id || data.id;

      setRegistrationId(newRegId);
      setStatus('registered');
      
      // Save to local storage
      const storageKey = getStorageKey();
      const storedRegs = JSON.parse(localStorage.getItem(storageKey) || '{}');
      storedRegs[eventId] = { id: newRegId, status: 'registered' };
      localStorage.setItem(storageKey, JSON.stringify(storedRegs));

      setStep(2); // Move to payment prompt
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentProof) {
      setError('Please upload a payment proof image');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (!registrationId) throw new Error("Registration ID missing");
      
      const response = await fetch(`/api/event-registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          payment_proof: paymentProof,
          status: 'pending_approval'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment proof');
      }

      setStatus('pending_approval');
      
      // Update local storage
      const eventId = event._id || event.id;
      const storageKey = getStorageKey();
      const storedRegs = JSON.parse(localStorage.getItem(storageKey) || '{}');
      storedRegs[eventId] = { id: registrationId, status: 'pending_approval' };
      localStorage.setItem(storageKey, JSON.stringify(storedRegs));

      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0A0A0A] rounded-3xl w-full max-w-md border border-white/[0.08] overflow-hidden shadow-2xl shadow-black flex flex-col max-h-[90vh] relative"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center p-6 border-b border-white/[0.05] shrink-0 relative z-10">
              <h2 className="text-xl font-semibold text-[#EDEDED] tracking-tight">Register for {event?.title}</h2>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="w-4 h-4 text-[#888888] group-hover:text-[#EDEDED] group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto relative z-10">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] text-[#EDEDED] transition-all duration-300 text-[15px] font-light placeholder:text-[#888888]/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Program *</label>
                    <input
                      type="text"
                      required
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] text-[#EDEDED] transition-all duration-300 text-[15px] font-light placeholder:text-[#888888]/50"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Section *</label>
                    <input
                      type="text"
                      required
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] text-[#EDEDED] transition-all duration-300 text-[15px] font-light placeholder:text-[#888888]/50"
                      placeholder="Section A"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.mobile_number}
                      onChange={handleMobileChange}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] text-[#EDEDED] transition-all duration-300 text-[15px] font-light placeholder:text-[#888888]/50"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#888888] mb-2 uppercase tracking-wide">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] text-[#EDEDED] transition-all duration-300 text-[15px] font-light placeholder:text-[#888888]/50"
                      placeholder="john@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-4 bg-white text-[#0A0A0A] hover:bg-[#EDEDED] rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-sm tracking-wide"
                  >
                    {loading ? 'Registering...' : 'Submit Registration'}
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#EDEDED] mb-3 tracking-tight">Successfully Registered!</h3>
                  <p className="text-[#888888] mb-10 font-light leading-relaxed">
                    Would you like to submit your payment proof now to complete the process?
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setStep(4);
                        setStatus('registered');
                      }}
                      className="flex-1 py-3.5 px-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[#EDEDED] rounded-xl font-medium transition-all duration-300 text-sm tracking-wide"
                    >
                      No, later
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3.5 px-4 bg-white text-[#0A0A0A] hover:bg-[#EDEDED] rounded-xl font-medium transition-all duration-300 text-sm tracking-wide"
                    >
                      Yes, submit now
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#EDEDED] mb-2 tracking-tight">Upload Payment Proof</h3>
                    <p className="text-[#888888] text-[15px] font-light">Upload a screenshot of your payment receipt.</p>
                  </div>

                  <div className="border border-dashed border-white/[0.15] bg-white/[0.01] rounded-2xl p-8 text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {paymentProof ? (
                      <img src={paymentProof} alt="Payment Proof" className="max-h-56 mx-auto rounded-xl shadow-lg border border-white/[0.1]" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-8 h-8 text-[#888888] group-hover:text-indigo-400 transition-colors duration-300" />
                        </div>
                        <p className="text-[#EDEDED] font-medium mb-1 tracking-wide">Click or drag image here</p>
                        <p className="text-[#888888] text-[13px] font-light">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading || !paymentProof}
                    className="w-full py-4 px-4 bg-white text-[#0A0A0A] hover:bg-[#EDEDED] rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                  >
                    {loading ? 'Submitting...' : 'Submit Payment Proof'}
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-10">
                  {status === 'approved' ? (
                    <>
                      <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#EDEDED] mb-3 tracking-tight">Registration Approved</h3>
                      <p className="text-green-400/80 font-light">Your payment has been accepted. See you there!</p>
                    </>
                  ) : status === 'rejected' ? (
                    <>
                      <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <X className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#EDEDED] mb-3 tracking-tight">Registration Rejected</h3>
                      <p className="text-[#888888] mb-8 font-light leading-relaxed">Your payment proof or registration was rejected by the admin.</p>
                      <button
                        onClick={() => setStep(3)}
                        className="py-3.5 px-6 bg-white text-[#0A0A0A] hover:bg-[#EDEDED] rounded-xl font-medium transition-all duration-300 text-sm tracking-wide"
                      >
                        Re-submit Payment Proof
                      </button>
                    </>
                  ) : status === 'pending_approval' ? (
                    <>
                      <div className="w-20 h-20 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                        <AlertCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#EDEDED] mb-3 tracking-tight">Payment Pending</h3>
                      <p className="text-[#888888] font-light leading-relaxed">Your payment proof has been submitted and is pending admin approval.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#EDEDED] mb-3 tracking-tight">Successfully Registered</h3>
                      <p className="text-[#888888] mb-8 font-light leading-relaxed">Please submit payment to the respective member to secure your spot.</p>
                      <button
                        onClick={() => setStep(3)}
                        className="py-3.5 px-6 bg-white text-[#0A0A0A] hover:bg-[#EDEDED] rounded-xl font-medium transition-all duration-300 text-sm tracking-wide"
                      >
                        Upload Payment Proof Now
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
