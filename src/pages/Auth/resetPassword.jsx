import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast, Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true); // Default to seen

  // 1. Real-time complexity validation
  const validation = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[\W_]/.test(password),
  };

  const isPasswordSecure = Object.values(validation).every(Boolean);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
        <p className="text-center text-gray-500 mb-8">Update your credentials for CampusPull</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Field (Visible/Hidden Toggle) */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter strong password"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-xs text-blue-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Real-time Requirement Checklist */}
          <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1.5 border border-gray-200">
             <RequirementItem met={validation.hasLength} text="At least 8 characters" />
             <RequirementItem met={validation.hasUpper} text="One uppercase letter (A-Z)" />
             <RequirementItem met={validation.hasNumber} text="One number (0-9)" />
             <RequirementItem met={validation.hasSpecial} text="One special character (@#$!)" />
          </div>

          {/* Confirm Password Field (Always Hidden) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                isMatching ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Confirm password"
            />
            {confirmPassword && !isMatching && (
              <p className="text-red-500 text-[10px] mt-1">Passwords do not match yet.</p>
            )}
            {isMatching && (
              <p className="text-green-600 text-[10px] mt-1">Passwords match!</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !isPasswordSecure || !isMatching}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper Component
const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center gap-2 ${met ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
    <span>{met ? '✔' : '○'}</span>
    <span>{text}</span>
  </div>
);

export default ResetPassword;