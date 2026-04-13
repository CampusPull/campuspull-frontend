import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api'; 
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await api.put(`/auth/verify-email/${token}`);
        
        setStatus('success');
        toast.success("Verified! Logging you in..."); 
        
        setTimeout(() => {
           window.location.href = '/homepage'; 
        }, 2000); 

      } catch (error) {
        setStatus('error');
        const errorMsg = error.response?.data?.message || "Verification failed";
        toast.error(errorMsg);
      }
    };

    if (token) {
      verifyAccount();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl text-center"
      >
        <AnimatePresence mode="wait">
          {status === 'verifying' && (
            <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <div className="relative mb-6 mt-4">
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <div className="absolute inset-0 border-4 border-transparent border-b-purple-400 rounded-full animate-spin shadow-inner" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Verifying Email...</h2>
              <p className="text-gray-500 text-sm mb-4">Hang tight, we are confirming your identity.</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <div className="relative mb-6 mt-4">
                <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-50" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                  <FaCheck className="text-white text-3xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Email Verified!</h2>
              <p className="text-gray-500 text-sm mb-8">Your identity has been confirmed. Redirecting...</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden relative">
                <motion.div 
                  initial={{ width: "0%" }} 
                  animate={{ width: "100%" }} 
                  transition={{ duration: 2, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div key="error" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200 mb-6 mt-4">
                <FaTimes className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Verification Failed</h2>
              <p className="text-gray-500 text-sm mb-8">The link is invalid or has expired.</p>
              
              <button 
                onClick={() => navigate('/auth')}
                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                Go to Login <FaArrowRight size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default VerifyEmail;