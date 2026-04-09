import React from "react";

const ImpactMetrics = () => {
  const metrics = [
    { number: "500+", label: "Students Connected" },
    { number: "50+", label: "Alumni Mentors" },
    { number: "10+", label: "Departments Engaged" },
    { number: "100+", label: "Resources Shared" },
  ];

  return (
    <section className="bg-blue-50 py-12 mb-12 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Our Impact 📊
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {metrics.map((item, index) => (
          <div key={index} className="text-center">
            <h3 className="text-3xl font-extrabold text-blue-600">
              {item.number}
            </h3>
            <p className="text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactMetrics;
