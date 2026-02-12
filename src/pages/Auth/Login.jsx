import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    alert("✅ Logged in successfully!");
    // 🔗 API call for login can be integrated here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transform transition duration-500 hover:scale-105">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue your journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full focus:outline-none"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" /> Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-blue-600 font-medium hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-bold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
