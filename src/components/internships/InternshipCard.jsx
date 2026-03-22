import { Link } from "react-router-dom";
import useRequireAuth from "../../hooks/useRequireAuth";

const InternshipCard = ({ internship, isGuest, onRestrictedAction }) => {

  const requireAuth = useRequireAuth();

  const handleApply = () => {
    // If guest, trigger the signup modal from parent
    if (isGuest) {
      onRestrictedAction?.();
      return;
    }
    // Logged-in: use existing requireAuth hook
    requireAuth(() => {
      window.open(internship.applyLink, "_blank");
    });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between">

      <div>

        <div className="flex items-center gap-4 mb-4">
          {/* FIX: companyLogo may be missing in guest/public API response */}
          {internship.companyLogo ? (
            <img
              src={internship.companyLogo}
              alt={internship.companyName}
              className="w-14 h-14 rounded-md object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              No Logo
            </div>
          )}

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
          <p><strong>Stipend:</strong> ₹{internship.stipend ?? "Not disclosed"}</p>
          <p><strong>Duration:</strong> {internship.duration ?? "—"}</p>
          <p><strong>Location:</strong> {internship.location ?? "—"}</p>
        </div>

      </div>

      <div className="flex flex-col gap-2 mt-4">

        {/* View Details: guests trigger modal, logged-in users navigate */}
        {isGuest ? (
          <button
            onClick={() => onRestrictedAction?.()}
            className="bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition"
          >
            View Details
          </button>
        ) : (
          <Link
            to={`/internships/${internship._id}`}
            className="bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        )}

        <button
          onClick={handleApply}
          className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Apply
        </button>

      </div>

    </div>
  );
};

export default InternshipCard;