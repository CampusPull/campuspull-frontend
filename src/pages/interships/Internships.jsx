import { useEffect, useState } from "react";
import { useInternships } from "../../context/internshipContext";
import InternshipCard from "./components/internshipCard";
import InternshipFilter from "./components/internshipfilter";
import Pagination from "./components/pagination";
import CreateInternshipModal from "./components/createInternshipModal";
import { useAuth } from "../../context/AuthContext"; // if you have this

const Internships = () => {
  const {
    internships,
    currentPage,
    totalPages,
    loading,
    fetchInternships,
  } = useInternships();

  const { user } = useAuth(); // optional if role-based

  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            + Add Internship
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar Filter */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-10">
            <InternshipFilter onFilter={handleFilter} />
          </div>
        </aside>

        {/* Internship List Section */}
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
                  <InternshipCard key={internship._id} internship={internship} />
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

      <CreateInternshipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Internships;
