import { useEffect, useState } from "react";
import InternshipCard from "../../components/internships/InternshipCard";
import { getInternships } from "../../services/internshipService";
import { useAuth } from "../../context/AuthContext";
import SignupModal from "../../components/ui/SignupModal";

const Internships = () => {
  const { user } = useAuth();
  const isGuest = !user;

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await getInternships(isGuest);
        setInternships(res.data ?? []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [isGuest]);

  if (loading) {
    return <div className="p-6 text-center">Loading internships...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong. Please try again later.
      </div>
    );
  }

  if (!internships.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No internships available right now.
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
            isGuest={isGuest}
            onRestrictedAction={() => setShowModal(true)}
          />
        ))}
      </div>

      {showModal && (
        <SignupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          message="Create an account to apply for internships"
        />
      )}
    </div>
  );
};

export default Internships;