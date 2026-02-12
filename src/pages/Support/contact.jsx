import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white p-6 md:p-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-gray-600 mb-8">Have a specific question? Our team is here to help you navigate the platform.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <FaEnvelope />
              </div>
              <div>
                <p className="font-bold">Email Us</p>
                <p className="text-gray-500 text-sm">support@campuspull.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="font-bold">Location</p>
                <p className="text-gray-500 text-sm">Meerut, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>
        </div>

        <form className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Your Name</label>
            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="Satyam" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Message</label>
            <textarea className="w-full p-3 h-32 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="How can we help?"></textarea>
          </div>
          <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;