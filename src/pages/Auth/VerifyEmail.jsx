import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api'; 
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        // Backend now sets HttpOnly cookies here!
        await api.put(`/auth/verify-email/${token}`);
        
        setStatus('success');
        toast.success("Verified! Logging you in..."); 
        
        // 🚀 CRITICAL: Force hard reload to Homepage.
        // This ensures AuthContext re-runs and picks up the new cookies.
        setTimeout(() => {
           window.location.href = '/homepage'; 
        }, 1500);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        
        <div className="mb-6 flex justify-center">
          {status === 'verifying' && <span className="text-5xl animate-spin">⏳</span>}
          {status === 'success' && <span className="text-5xl">✅</span>}
          {status === 'error' && <span className="text-5xl">❌</span>}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {status === 'verifying' && "Verifying your email..."}
          {status === 'success' && "Email Verified!"}
          {status === 'error' && "Verification Failed"}
        </h2>

        <p className="text-gray-600">
          {status === 'verifying' && "Hang tight, we are confirming your identity."}
          {status === 'success' && "Taking you to the homepage..."} 
          {status === 'error' && "The link is invalid or has expired."}
        </p>

        {status === 'error' && (
          <button 
            onClick={() => navigate('/login')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;