// import { useEffect, useState } from "react";
// import InternshipCard from "../../components/internships/InternshipCard";
// import { getInternships } from "../../services/internshipService";
// import { useAuth } from "../../context/AuthContext";
// import SignupModal from "../../components/ui/SignupModal";

// const Internships = () => {
//   const { user } = useAuth();
//   const isGuest = !user;

//   const [internships, setInternships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchInternships = async () => {
//       try {
//         const res = await getInternships(isGuest);
//         setInternships(res.data ?? []);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInternships();
//   }, [isGuest]);

//   if (loading) {
//     return <div className="p-6 text-center">Loading internships...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Something went wrong. Please try again later.
//       </div>
//     );
//   }

//   if (!internships.length) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No internships available right now.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">
//         Internship Opportunities
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {internships.map((internship) => (
//           <InternshipCard
//             key={internship._id}
//             internship={internship}
//             isGuest={isGuest}
//             onRestrictedAction={() => setShowModal(true)}
//           />
//         ))}
//       </div>

//       {showModal && (
//         <SignupModal
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//           message="Create an account to apply for internships"
//         />
//       )}
//     </div>
//   );
// };

// export default Internships;


import { useEffect, useState } from "react";
import { useInternships } from "../../context/internshipContext";
import InternshipCard from "./components/internshipCard";
import InternshipFilter from "./components/internshipfilter";
import Pagination from "./components/pagination";
import CreateInternshipModal from "./components/createInternshipModal";
import { useAuth } from "../../context/AuthContext";
import SignupModal from "../../components/ui/SignupModal"; // FIX: guest modal

const Internships = () => {
  const {
    internships,
    currentPage,
    totalPages,
    loading,
    fetchInternships,
  } = useInternships();

  const { user } = useAuth();
  const isGuest = !user; // FIX: guest detection

  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // FIX: signup modal

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchInternships(1, newFilters);
  };

  const handlePageChange = (page) => {
    fetchInternships(page, filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Internship <span className="text-blue-600">Opportunities</span>
          </h1>
          <p className="text-gray-500 mt-2">Find your next career move today.</p>
        </div>
        {/* FIX: guests can never add internships */}
        {!isGuest && user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            + Add Internship
          </button>
        )}
      </div>

      {/* FIX: Guest banner */}
      {isGuest && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
          <p className="text-blue-700 font-medium text-sm">
            👋 You're browsing as a guest. Create an account to apply for internships.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Join Now
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sticky Sidebar Filter */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-10">
            <InternshipFilter onFilter={handleFilter} />
          </div>
        </aside>

        {/* Internship List */}
        <main className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-400 font-medium">
              Loading opportunities...
            </div>
          ) : internships.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
              <p className="text-xl text-gray-400">No internships found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {internships.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    isGuest={isGuest}                              // FIX: pass guest state
                    onRestrictedAction={() => setShowAuthModal(true)} // FIX: modal trigger
                  />
                ))}
              </div>

              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin modal — logged-in only */}
      <CreateInternshipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* FIX: Signup modal for guest restricted actions */}
      {showAuthModal && (
        <SignupModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message="Create an account to apply for internships"
        />
      )}
    </div>
  );
};

export default Internships;