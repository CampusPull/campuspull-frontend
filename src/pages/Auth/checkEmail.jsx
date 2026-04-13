import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaEnvelopeOpenText, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CheckEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Ping animation effect */}
            <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-50"></div>
            <div className="relative bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-full border border-white shadow-inner">
              <FaEnvelopeOpenText className="text-5xl text-indigo-600" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your mail</h2>
        <p className="text-sm text-gray-500 mb-8">
          We have sent a verification link to <br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
          <FaExclamationCircle className="text-indigo-400 mt-0.5 flex-shrink-0" size={16} />
          <p className="text-xs text-indigo-800 leading-relaxed font-medium">
            It might take a few minutes to arrive. Please check your spam folder if you don't see it in your inbox.
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm">
            Open Email App
          </button>
          
          <Link 
            to="/auth" 
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <FaArrowLeft size={12} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckEmail;