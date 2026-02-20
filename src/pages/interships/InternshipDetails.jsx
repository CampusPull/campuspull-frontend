import { useParams } from "react-router-dom";
import { mockInternships } from "../../data/mockInternships";

const InternshipDetails = () => {
  const { id } = useParams();

  const internship = mockInternships.find(
    (item) => item.id === id
  );
    
  if (!internship) {
    return <div className="p-6 text-center">Internship not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={internship.companyLogo}
            alt={internship.companyName}
            className="w-16 h-16 rounded-md"
          />
          <div>
            <h2 className="text-2xl font-bold">{internship.title}</h2>
            <p className="text-gray-500">{internship.companyName}</p>
          </div>
        </div>

        <div className="mb-6 text-gray-700 space-y-2">
          <p><strong>Stipend:</strong> {internship.stipend}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          <p><strong>Location:</strong> {internship.location}</p>
        </div>

        <p className="text-gray-600 mb-6">{internship.description}</p>

        <a
          href={internship.website}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default InternshipDetails;