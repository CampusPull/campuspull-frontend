
import { useState } from "react";
import JobCard from "./components/JobCard";

const mockOpportunities = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "CampusPull",
    type: "Internship",
    location: "On Campus",
    stipend: "₹8,000 / month",
    domain: "Web Development",
    description:
      "Work on real-world React features, optimize UI performance, and collaborate with backend developers.",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "SkillForge Labs",
    type: "Job",
    location: "Remote",
    stipend: "₹4.5 LPA",
    domain: "SaaS",
    description:
      "Build scalable APIs using Node.js and MongoDB. Experience with authentication and REST required.",
  },
  {
    id: 3,
    title: "Community Manager Intern",
    company: "Gramin Udaan",
    type: "Internship",
    location: "Hybrid",
    stipend: "₹6,000 / month",
    domain: "Social Impact",
    description:
      "Manage student engagement, coordinate digital campaigns, and assist with outreach programs.",
  },
]; 

const JobsPage = () => {
  const [filter, setFilter] = useState("All");

  const filteredData =
    filter === "All"
      ? mockOpportunities
      : mockOpportunities.filter((job) => job.type === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Jobs & Internships
          </h1>
          <p className="text-gray-600">
            Opportunities shared within the college ecosystem
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Job", "Internship"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === type
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
