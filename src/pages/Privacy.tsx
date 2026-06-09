import React from 'react';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-[#888888] font-light leading-relaxed">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p>
              At Core Computer Society (CCS), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform and participate in our events.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you register for an account, sign up for events, or contact us. This may include your name, email address, university roll number, and other relevant details.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to manage memberships, organize events, communicate with you about our activities, and improve our services.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">3. Information Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our platform, provided they agree to keep this information confidential.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">4. Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at demo@example.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
