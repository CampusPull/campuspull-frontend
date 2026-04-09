import React from "react";

const FounderStory = () => {
  const storyPoints = [
    {
      year: "2023",
      detail:
        "Campus-Pull began as an idea by passionate students of ABES Institute of Technology.",
    },
    {
      year: "Vision",
      detail:
        "To build a platform where students, alumni, and faculty come together seamlessly.",
    },
    {
      year: "Goal",
      detail:
        "Create a space where opportunities, mentorship, and resources are accessible to everyone.",
    },
  ];

  return (
    <section className="bg-purple-50 py-12 mb-12 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Our Story 🚀
      </h2>

      {/* Grid like impact metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        {storyPoints.map((point, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-extrabold text-indigo-600 mb-2">
              {point.year}
            </h3>
            <p className="text-gray-600">{point.detail}</p>
          </div>
        ))}
      </div>

      {/* Closing Statement */}
      <p className="text-center text-lg text-gray-700 mt-10 max-w-3xl mx-auto">
        From a small idea at <strong>ABESIT</strong>, Campus-Pull is now shaping
        the way students and alumni connect for growth and mentorship.
      </p>
    </section>
  );
};

export default FounderStory;
