import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInternships } from "../../context/internshipContext";
import { FiMapPin, FiClock, FiCreditCard, FiArrowLeft, FiExternalLink, FiCheckCircle, FiCalendar } from "react-icons/fi";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInternshipById } = useInternships();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const data = await getInternshipById(id);
        setInternship(data);
      } catch (error) {
        console.error("Failed to fetch internship:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id, getInternshipById]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (!internship) return <div className="p-10 text-center">Internship not found.</div>;

  const formattedDuration = `${internship.durationValue} ${internship.durationUnit}${internship.durationValue > 1 ? "s" : ""}`;
  
  // Format the "Posted" date from timestamps
  const postedDate = new Date(internship.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium mb-8">
          <FiArrowLeft /> Back to Internships
        </button>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={internship.companyLogo || "/placeholder-logo.png"} alt={internship.companyName} className="w-24 h-24 rounded-3xl object-cover bg-white p-1 shadow-xl" />
              <div className="text-center md:text-left flex-grow">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  <span className="bg-blue-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest text-white border border-blue-400/50">
                    {internship.status}
                  </span>
                  <span className="bg-white/10 text-xs font-bold px-3 py-1 rounded-full text-white flex items-center gap-1">
                    <FiCalendar size={12}/> Posted: {postedDate}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-1">{internship.title}</h1>
                <a href={internship.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-100 text-lg hover:underline flex items-center justify-center md:justify-start gap-1">
                  {internship.companyName} <FiExternalLink size={14}/>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3 p-6 border-r border-gray-100">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FiCreditCard size={24}/></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Stipend</p>
                <p className="font-bold text-gray-800">{internship.stipend > 0 ? `₹${internship.stipend}/mo` : "Unpaid"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-6 border-r border-gray-100">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><FiClock size={24}/></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Duration</p>
                <p className="font-bold text-gray-800">{formattedDuration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><FiMapPin size={24}/></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Location</p>
                <p className="font-bold text-gray-800 capitalize">{internship.location}</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Description & Skills */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Role Description
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {internship.description}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h3>
                <div className="flex flex-wrap gap-3">
                  {internship.skills?.map((skill, index) => (
                    <span key={index} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar (Eligibility) */}
            <div className="space-y-6">
              <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                <h4 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
                  <FiCheckCircle /> Eligibility
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed font-medium">
                  {internship.eligibility || "Open to all relevant applicants."}
                </p>
              </div>

              <div className="p-2">
                <a
                  href={internship.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-lg shadow-blue-200"
                >
                  Apply Now <FiExternalLink />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;