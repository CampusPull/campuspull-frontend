import { Link } from "react-router-dom";
import { FiMapPin, FiClock, FiCreditCard } from "react-icons/fi"; // Optional: npm install react-icons

const InternshipCard = ({ internship }) => {
  const {
    _id,
    title,
    companyName,
    companyLogo,
    stipend,
    durationValue,
    durationUnit,
    location,
  } = internship;

  const formattedDuration = `${durationValue} ${durationUnit}${durationValue > 1 ? "s" : ""}`;

  return (
    <div className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Header: Logo & Title */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={companyLogo || "/placeholder-logo.png"}
                alt={companyName}
                className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {title}
              </h3>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                {companyName}
              </p>
            </div>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <FiCreditCard size={14} />
            {stipend > 0 ? `₹${stipend}/mo` : "Unpaid"}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <FiClock size={14} />
            {formattedDuration}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <FiMapPin size={14} />
            {location}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400 font-medium italic">Posted 2 days ago</span>
        <Link
          to={`/internships/${_id}`}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-gray-200 hover:shadow-blue-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default InternshipCard;