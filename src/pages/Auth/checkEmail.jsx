import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const CheckEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email"; // Gets email passed from Auth page

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-5xl text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Check your mail</h2>
        <p className="text-gray-500 mb-6">
          We have sent a verification link to <br />
          <span className="font-bold text-gray-800">{email}</span>.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> It might take a few minutes to arrive. Check your spam folder if you don't see it.
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Did not receive the email? <br />
          <Link to="/auth" className="text-blue-600 font-bold hover:underline">Try with another email</Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;