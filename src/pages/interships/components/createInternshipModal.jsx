import { useState } from "react";
import { useInternships } from "../../../context/InternshipContext";
import { useAuth } from "context/AuthContext";

const CreateInternshipModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { createInternship } = useInternships();

  const [form, setForm] = useState({
    title: "",
    description: "",
    stipend: "",
    durationValue: "",
    durationUnit: "month",
    location: "",
    eligibility: "",
    skills: "",
    applyLink: "",
    companyName: "",
    companyLogo: "",
    companyWebsite: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...form,
      stipend: Number(form.stipend) || 0,
      durationValue: Number(form.durationValue),
      skills: form.skills
        .split(",")
        .map((s) => s.trim().toLowerCase()),
    };
    const internshipData = {
      ...formattedData,
    createdBy: user?._id || user?.id // Ensure this matches your backend field name
  };
  console.log("SENDING TO BACKEND:", internshipData);

  if (!internshipData.createdBy) {
    alert("You must be logged in to create an internship, buddy!");
    console.error("The user object is:", user);
    return;
  }

    try {
      await createInternship(internshipData);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Internship</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2 rounded" required />
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="stipend" placeholder="Stipend" onChange={handleChange} className="w-full border p-2 rounded" />

          <div className="grid grid-cols-2 gap-2">
            <input name="durationValue" placeholder="Duration Value" onChange={handleChange} className="border p-2 rounded" required />
            <select name="durationUnit" onChange={handleChange} className="border p-2 rounded">
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          <input name="location" placeholder="Location" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="eligibility" placeholder="Eligibility" onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="applyLink" placeholder="Apply Link" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="companyName" placeholder="Company Name" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="companyLogo" placeholder="Company Logo URL" onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="companyWebsite" placeholder="Company Website" onChange={handleChange} className="w-full border p-2 rounded" required />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInternshipModal;
