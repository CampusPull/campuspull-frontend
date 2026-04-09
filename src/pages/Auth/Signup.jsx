import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUniversity,FaCalendarAlt
} from "react-icons/fa";
 // ✅ Added import for calendar icon

export default function Register() {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    passingYear: "", // ✅ added for alumni
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", { ...formData, role });
    alert(`🎉 Registered as ${role.toUpperCase()} successfully!`);
    // 🔗 API call can be integrated here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transform transition duration-500 hover:scale-105">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Your Account 🚀
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join LinkeMate and start your journey
        </p>

        {/* Role Selection Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setRole("student")}
          >
            🎓 Student
          </button>
          <button
            type="button"
            className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition ${
              role === "alumni"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setRole("alumni")}
          >
            🧑‍💼 Alumni
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
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
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full focus:outline-none"
            />
          </div>

          {/* Branch Dropdown */}
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
            <FaUniversity className="text-gray-500 mr-2" />
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
            >
              <option value="">Select Branch</option>
              <option value="CSE-Core">CSE - Core</option>
              <option value="CSE-DS">CSE - Data Science</option>
              <option value="CSE-AI">CSE - Artificial Intelligence</option>
              <option value="CSE-IoT">CSE - IoT</option>
              <option value="IT">Information Technology (IT)</option>
            </select>
          </div>

          {/* Passing Year Input (Only for Alumni) */}
          {role === "alumni" && (
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                required
                placeholder="Enter Passing Year (e.g., 2022)"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
