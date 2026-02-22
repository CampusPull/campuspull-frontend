import { useEffect, useState } from "react";
import InternshipCard from "../../components/internships/InternshipCard";
import { getInternships } from "../../services/internshipService";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await getInternships();
        setInternships(res.data); // IMPORTANT
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading internships...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong.
      </div>
    );
  }

  if (!internships.length) {
    return (
      <div className="p-6 text-center">
        No internships available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Internship Opportunities
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <InternshipCard
            key={internship._id}
            internship={internship}
          />
        ))}
      </div>
    </div>
  );
};

export default Internships;