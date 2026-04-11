import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast, Toaster } from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center gap-2 text-xs font-semibold transition-colors duration-300 ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
    {met ? <FaCheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />}
    <span>{text}</span>
  </div>
);

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirm, setShowConfirm] = useState(false);

  // 1. Real-time complexity validation
  const validation = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[\W_]/.test(password),
  };

  const strengthScore = Object.values(validation).filter(Boolean).length;
  const isPasswordSecure = strengthScore === 4;
  const isMatching = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordSecure) return toast.error("Password is too weak!");
    if (!isMatching) return toast.error("Passwords do not match!");

    setLoading(true);

    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      toast.success(data.message);
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
            <FaLock className="text-indigo-600" size={24} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
        <p className="text-center text-sm text-gray-500 mb-8">Create a new secure password for your CampusPull account.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="text-indigo-400" size={15} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium text-sm"
                placeholder="New password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="flex gap-1 h-1.5 px-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      i <= strengthScore ? (strengthScore === 4 ? 'bg-emerald-500' : strengthScore >= 3 ? 'bg-yellow-400' : 'bg-red-400') : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Checklist */}
            <div className="bg-white/50 rounded-xl p-4 space-y-2 border border-gray-100">
               <RequirementItem met={validation.hasLength} text="At least 8 characters" />
               <RequirementItem met={validation.hasUpper} text="One uppercase letter (A-Z)" />
               <RequirementItem met={validation.hasNumber} text="One number (0-9)" />
               <RequirementItem met={validation.hasSpecial} text="One special character (@#$!)" />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="text-indigo-400" size={15} />
            </div>
            <input 
              type={showConfirm ? "text" : "password"} 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-11 pr-12 py-3 bg-white/80 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 font-medium text-sm transition-all ${
                confirmPassword.length > 0 
                  ? isMatching 
                    ? 'border-emerald-400 focus:ring-emerald-100 focus:border-emerald-500' 
                    : 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
              }`}
              placeholder="Confirm new password"
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
            
            {/* Live Match Icon floating next to the eye toggle if matching */}
            {confirmPassword.length > 0 && isMatching && (
              <div className="absolute inset-y-0 right-10 pr-2 flex items-center pointer-events-none text-emerald-500">
                <FaCheckCircle size={14} />
              </div>
            )}
            {confirmPassword.length > 0 && !isMatching && (
              <div className="absolute inset-y-0 right-10 pr-2 flex items-center pointer-events-none text-red-500">
                <FaExclamationCircle size={14} />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !isPasswordSecure || !isMatching}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;