import React from 'react';
import { FaQuestionCircle, FaSearch, FaBook, FaShieldAlt } from 'react-icons/fa';

const Help = () => {
  const faqs = [
    { q: "How do I connect with a mentor?", a: "Go to the Explore page, find a profile with the 'Alumni' role, and click 'Connect'." },
    { q: "Is Campus-pull free for students?", a: "Yes, our core mission is to provide free networking for all verified students." },
    { q: "How can I change my profile role?", a: "Go to Profile Settings or contact support if you were verified incorrectly." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Help Center</h1>
        <p className="text-gray-600 mb-8">Everything you need to know about using Campus-pull.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <FaBook className="text-indigo-600 text-3xl mb-4" />
            <h3 className="font-bold">Guides</h3>
            <p className="text-sm text-gray-500">Learn how to maximize your profile.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <FaShieldAlt className="text-indigo-600 text-3xl mb-4" />
            <h3 className="font-bold">Privacy</h3>
            <p className="text-sm text-gray-500">How we protect your data.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <FaQuestionCircle className="text-indigo-600 text-3xl mb-4" />
            <h3 className="font-bold">FAQs</h3>
            <p className="text-sm text-gray-500">Quick answers to common questions.</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-gray-800">
                {faq.q}
                <span className="text-indigo-600">+</span>
              </summary>
              <p className="mt-3 text-gray-600 border-t pt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Help;