import React from 'react';
import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-32 px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Terms of Service
          </h1>
          <div className="space-y-6 text-[#888888] font-light leading-relaxed">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p>
              Please read these Terms of Service carefully before using the Core Computer Society (CCS) platform. By accessing or using our services, you agree to be bound by these terms.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By joining CCS or using our platform, you agree to comply with and be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">2. Use of Service</h2>
            <p>
              You agree to use our platform and participate in our events in a respectful and professional manner. Harassment, discrimination, or any form of disruptive behavior will not be tolerated.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">3. User Accounts</h2>
            <p>
              When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              Content provided on our platform is the property of CCS or its members and is protected by intellectual property laws.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">5. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.
            </p>
            <h2 className="text-2xl font-semibold text-[#EDEDED] mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at demo@example.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
