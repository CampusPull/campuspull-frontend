import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Feedback = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center">
        <h2 className="text-3xl font-extrabold mb-2">Help Us Improve</h2>
        <p className="text-gray-500 mb-8">Your feedback directly shapes the future of Campus-pull.</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar 
              key={star}
              className={`text-3xl cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea 
          className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-indigo-400 outline-none mb-6"
          placeholder="What can we do better?"
        ></textarea>

        <button className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all">
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

export default Feedback;