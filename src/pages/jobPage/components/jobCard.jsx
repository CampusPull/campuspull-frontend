const JobCard = ({ job }) => {
  return (
    <div className="border rounded-xl p-5 bg-white hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            job.type === "Internship"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {job.type}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        {job.description}
      </p>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{job.location}</span>
        <span>{job.stipend}</span>
      </div>

      <button className="mt-4 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-900">
        Apply
      </button>
    </div>
  );
};

export default JobCard;
