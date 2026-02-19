import { Link } from "react-router-dom";

const InternshipCard = ({ internship }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={internship.companyLogo}
            alt={internship.companyName}
            className="w-14 h-14 rounded-md object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {internship.title}
            </h3>
            <p className="text-sm text-gray-500">
              {internship.companyName}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Stipend:</strong> {internship.stipend}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          <p><strong>Location:</strong> {internship.location}</p>
        </div>
      </div>

      <Link
        to={`/internships/${internship.id}`}
        className="mt-4 bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default InternshipCard;
