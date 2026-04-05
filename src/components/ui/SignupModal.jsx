import { useNavigate } from "react-router-dom";

const SignupModal = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Join CampusPull
        </h2>
        <p className="text-gray-500 mb-6">
          {message || "Create an account to access this feature."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Log In
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition mt-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;