import { useState } from "react";
import { mockInternships } from "../data/mockInternships";
import InternshipCard from "../components/internships/InternshipCard";

const Internships = () => {
  const [loading] = useState(false);
  const [error] = useState(false);
  const internships = mockInternships;

  if (loading) {
    return <div className="p-6 text-center">Loading internships...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Something went wrong.</div>;
  }

  if (!internships.length) {
    return <div className="p-6 text-center">No internships available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Internship Opportunities
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
          />
        ))}
      </div>
    </div>
  );
};

export default Internships;