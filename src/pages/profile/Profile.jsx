import React, { useState, useEffect, useContext } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaTools,
  FaPlus,
  FaMagic,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaFolderOpen,
  FaCamera,
  FaTrash,
  FaPen,
  FaTimes,
  FaSave,
  FaGlobe,
  FaUser,
  FaUniversity,
  FaLock,
  FaBuilding,
  FaCode, // ✅ Added FaCode for LeetCode
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileContext } from "../../context/profileContext";

// ✅ Card Component
const Card = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/30 ${className}`}
  >
    {children}
  </motion.div>
);

// ✅ Modal for Editing Items
const EditModal = ({
  isOpen,
  onClose,
  onSave,
  data,
  setData,
  fields,
  title,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Edit {title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                {field.placeholder}
              </label>
              <input
                type="text"
                value={data[field.name] || ""}
                onChange={(e) =>
                  setData({ ...data, [field.name]: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Profile() {
  const {
    profile,
    loading,
    error,
    updateProfile,
    addItemToProfile,
    uploadPhoto,
    deleteArrayItem,
    editArrayItem,
    deleteProfilePhoto,
    removeSkill,
    addSkill,
    sendPasswordOTP,
    verifyPasswordOTP,
  } = useContext(ProfileContext);

  // --- STATE ---
  const [passStep, setPassStep] = useState(1);
  const [passOtp, setPassOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const [bio, setBio] = useState("");
  const [editBio, setEditBio] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // State for Personal & Academic Info Form
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    name: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "", // ✅ Added LeetCode
    college: "",
    degree: "",
    course: "",
    department: "",
    section: "",
    year: "",
    graduationYear: "",
    designation: "",
    currentCompany: "",
  });

  // --- Edit Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItemData, setEditingItemData] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);

  // Form States for Arrays
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [newExperience, setNewExperience] = useState({
    role: "",
    company: "",
    description: "",
    year: "",
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [newCert, setNewCert] = useState({ name: "", provider: "", link: "" });

  // ✅ SYNC PROFILE DATA TO STATE
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");

      setInfoForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
        leetcode: profile.leetcode || "", // ✅ Sync LeetCode
        college: profile.college || "",
        degree: profile.degree || "",
        course: profile.course || "",
        department: profile.department || "",
        section: profile.section || profile.Section || "",
        year: profile.year || "",
        graduationYear: profile.graduationYear || "",
        designation: profile.designation || "",
        currentCompany: profile.currentCompany || "",
      });
    }
  }, [profile]);

  const isStudent = profile?.role === "student";
  const isAlumni = profile?.role === "alumni";
  const isTeacher = profile?.role === "teacher";

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!profile) return <p className="p-6">No profile data</p>;

  // --- HANDLERS ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image too large (Max 5MB).");

    setUploadingImage(true);
    try {
      await uploadPhoto(file);
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (window.confirm("Delete profile photo?")) {
      await deleteProfilePhoto();
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    await addSkill(newSkill);
    setNewSkill("");
  };

  const handleRemoveSkill = async (skill) => {
    await removeSkill(skill);
  };

  const handleAddSection = async (key, item, setItem, emptyState) => {
    const isValid = Object.values(item).some((val) => val.trim() !== "");
    if (!isValid) return;
    await addItemToProfile(key, item);
    setItem(emptyState);
  };

  const handleDeleteItem = async (section, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteArrayItem(section, id);
    }
  };

  const handleEditClick = (section, item) => {
    setEditingSection(section);
    setEditingItemId(item._id);
    setEditingItemData({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !editingItemId) return;
    try {
      await editArrayItem(editingSection.key, editingItemId, editingItemData);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to update item");
    }
  };

  const saveBio = async () => {
    await updateProfile({ bio });
    setEditBio(false);
  };

  const saveInfo = async () => {
    try {
      await updateProfile(infoForm);
      setIsEditingInfo(false);
    } catch (err) {
      alert("Failed to update info");
    }
  };

  const generateResume = () => {
    const resumeData = `
📌 Name: ${profile.name || ""}
🎓 Degree: ${profile.degree || ""}
🏫 College: ${profile.college || ""}

💡 About:
${profile.bio || ""}

🛠 Skills:
${profile.skills?.join(", ") || "None"}

🚀 Projects:
${
  profile.projects?.map((p) => `- ${p.title}: ${p.description}`).join("\n") ||
  "None"
}

💼 Experience:
${
  profile.experience
    ?.map((e) => `- ${e.role} at ${e.company} (${e.year})`)
    .join("\n") || "None"
}
    `;
    setResume(resumeData);
  };

  const handleSendOTP = async () => {
    setPassLoading(true);
    try {
      await sendPasswordOTP();
      alert("OTP sent to your email!");
      setPassStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setPassLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passOtp || !newPassword) return alert("Please fill all fields");
    setPassLoading(true);
    try {
      await verifyPasswordOTP(passOtp, newPassword);
      alert("Password updated successfully!");
      setPassStep(1);
      setPassOtp("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  // Configuration for sections
  const sections = [
    {
      key: "projects",
      title: "Projects",
      icon: <FaFolderOpen />,
      data: profile.projects,
      inputs: newProject,
      setInputs: setNewProject,
      emptyState: { title: "", description: "", link: "" },
      fields: [
        { name: "title", placeholder: "Project Title" },
        { name: "description", placeholder: "Description" },
        { name: "link", placeholder: "Link (GitHub/Live)" },
      ],
    },
    {
      key: "experience",
      title: "Experience",
      icon: <FaBriefcase />,
      data: profile.experience,
      inputs: newExperience,
      setInputs: setNewExperience,
      emptyState: { role: "", company: "", description: "", year: "" },
      fields: [
        { name: "role", placeholder: "Role / Job Title" },
        { name: "company", placeholder: "Company Name" },
        { name: "year", placeholder: "Year" },
        { name: "description", placeholder: "Description" },
      ],
    },
    {
      key: "education",
      title: "Education History",
      icon: <FaGraduationCap />,
      data: profile.education,
      inputs: newEducation,
      setInputs: setNewEducation,
      emptyState: { degree: "", institution: "", year: "" },
      fields: [
        { name: "degree", placeholder: "Degree" },
        { name: "institution", placeholder: "Institution" },
        { name: "year", placeholder: "Year" },
      ],
    },
    {
      key: "certifications",
      title: "Certifications",
      icon: <FaCertificate />,
      data: profile.certifications,
      inputs: newCert,
      setInputs: setNewCert,
      emptyState: { name: "", provider: "", link: "" },
      fields: [
        { name: "name", placeholder: "Certificate Name" },
        { name: "provider", placeholder: "Provider" },
        { name: "link", placeholder: "Verification Link" },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 md:px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ================= SIDEBAR ================= */}
        <Card className="h-fit">
          <div className="flex flex-col items-center text-center relative">
            <div className="relative group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={profile.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors z-10">
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaCamera size={14} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>

              {profile.profileImage && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition opacity-0 group-hover:opacity-100"
                  title="Remove Photo"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              {profile.name || "User"}
            </h2>
            <p className="text-gray-500">
              {profile.role === "alumni"
                ? "Alumni"
                : `${profile.degree} Student`}
            </p>

            {/* ✅ 1. PRIMARY CONTACTS (LinkedIn) */}
            <div className="flex justify-center gap-3 mt-4 mb-2">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100 hover:bg-blue-100 transition"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100 hover:bg-blue-100 transition"
                >
                  <FaEnvelope /> Email
                </a>
              )}
            </div>

            <div className="mt-6 w-full">
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm border border-orange-200">
                <span role="img" aria-label="fire">
                  🔥
                </span>
                <span>{profile.streakCount || 0} Day Streak</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700 mb-3">
              <FaTools /> Skills
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="group flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-red-500 transition"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No skills added.</p>
              )}
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill..."
                className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <button
                onClick={handleAddSkill}
                className="flex-shrink-0 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <br />
          <br />
          {/* ================= SECURITY CARD ================= */}
          <Card>
            <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-4">
              <FaLock /> Security & Password
            </h3>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                To change your password, we will send a verification OTP to your
                registered email address.
              </p>

              {passStep === 1 ? (
                <button
                  onClick={handleSendOTP}
                  disabled={passLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm disabled:bg-gray-400"
                >
                  {passLoading ? "Sending OTP..." : "Change Password"}
                </button>
              ) : (
                <div className="space-y-3 max-w-sm">
                  <div className="animate-fade-in-up">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={passOtp}
                      onChange={(e) => setPassOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New secure password"
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setPassStep(1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={passLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:bg-gray-400"
                    >
                      {passLoading ? "Verifying..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Card>

        {/* ================= MAIN CONTENT ================= */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal & Academic Info Card */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                <FaUniversity /> Personal & Academic Info
              </h3>
              {!isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
                >
                  <FaPen size={12} /> Edit
                </button>
              )}
            </div>

            {isEditingInfo ? (
              // ================== EDIT MODE ==================
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Identity */}
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={infoForm.name}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                {/* 2. Contact & Social Links (ALWAYS VISIBLE IN EDIT MODE) */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-2">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Phone (Confidential)
                    </label>
                    <input
                      type="text"
                      value={infoForm.phone}
                      onChange={(e) =>
                        setInfoForm({ ...infoForm, phone: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      <FaGlobe /> Portfolio / Website
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={infoForm.portfolio}
                      onChange={(e) =>
                        setInfoForm({ ...infoForm, portfolio: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      <FaLinkedin /> LinkedIn URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={infoForm.linkedin}
                      onChange={(e) =>
                        setInfoForm({ ...infoForm, linkedin: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      <FaGithub /> GitHub URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={infoForm.github}
                      onChange={(e) =>
                        setInfoForm({ ...infoForm, github: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  {/* ✅ LeetCode Input Added */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      <FaCode /> LeetCode URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://leetcode.com/..."
                      value={infoForm.leetcode}
                      onChange={(e) =>
                        setInfoForm({ ...infoForm, leetcode: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>

                {/* 3. Academic Info (Common) */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    College
                  </label>
                  <input
                    type="text"
                    value={infoForm.college}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, college: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Department
                  </label>
                  <input
                    type="text"
                    value={infoForm.department}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, department: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                {/* 4. Role Specific Fields */}
                {isTeacher && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={infoForm.designation}
                      onChange={(e) =>
                        setInfoForm({
                          ...infoForm,
                          designation: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                )}

                {isAlumni && (
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      <FaBuilding /> Current Company
                    </label>
                    <input
                      type="text"
                      value={infoForm.currentCompany}
                      placeholder="Where are you working?"
                      onChange={(e) =>
                        setInfoForm({
                          ...infoForm,
                          currentCompany: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                )}

                {(isStudent || isAlumni) && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={infoForm.degree}
                        onChange={(e) =>
                          setInfoForm({ ...infoForm, degree: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        value={infoForm.graduationYear}
                        onChange={(e) =>
                          setInfoForm({
                            ...infoForm,
                            graduationYear: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </>
                )}

                {isStudent && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Current Year (1-4)
                      </label>
                      <input
                        type="number"
                        value={infoForm.year}
                        onChange={(e) =>
                          setInfoForm({ ...infoForm, year: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Section
                      </label>
                      <input
                        type="text"
                        value={infoForm.section}
                        onChange={(e) =>
                          setInfoForm({ ...infoForm, section: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </>
                )}

                <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditingInfo(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveInfo}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2"
                  >
                    <FaSave /> Save Info
                  </button>
                </div>
              </div>
            ) : (
              // ================== VIEW MODE ==================
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
                  {/* Standard Info Display (College, Dept, etc.) */}
                  <div>
                    <span className="font-semibold text-gray-500 block text-xs uppercase">
                      College
                    </span>
                    <span>{profile.college || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 block text-xs uppercase">
                      Department
                    </span>
                    <span>{profile.department || "N/A"}</span>
                  </div>

                  {isTeacher && (
                    <div>
                      <span className="font-semibold text-gray-500 block text-xs uppercase">
                        Designation
                      </span>
                      <span>{profile.designation || "N/A"}</span>
                    </div>
                  )}

                  {(isStudent || isAlumni) && (
                    <>
                      <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase">
                          Degree
                        </span>
                        <span>{profile.degree}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase">
                          Graduation Year
                        </span>
                        <span>{profile.graduationYear || "N/A"}</span>
                      </div>
                    </>
                  )}

                  {isStudent && (
                    <>
                      <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase">
                          Current Year
                        </span>
                        <span>{profile.year ? `${profile.year}` : "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500 block text-xs uppercase">
                          Section
                        </span>
                        <span>
                          {profile.section || profile.Section || "N/A"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {isAlumni && profile.currentCompany&& (
                  <div className="col-span-1 md:col-span-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <span className="font-semibold text-blue-500 text-xs uppercase flex items-center gap-1">
                      <FaBuilding /> Current Company
                    </span>
                    <span className="font-bold text-blue-900">
                      {profile.currentCompany || "N/A"}
                    </span>
                  </div>
                )}

                {/* ✅ UPDATED DYNAMIC SOCIAL LINKS (Removed LinkedIn, Added LeetCode) */}
                {(profile.github || profile.portfolio || profile.leetcode) && (
                  <div className="mt-2 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-800 hover:text-black transition flex items-center gap-1.5 text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                      >
                        <FaGithub size={14} /> GitHub
                      </a>
                    )}
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1.5 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100"
                      >
                        <FaGlobe size={14} /> Portfolio
                      </a>
                    )}
                    {profile.leetcode && (
                      <a
                        href={profile.leetcode}
                        target="_blank"
                        rel="noreferrer"
                        className="text-yellow-600 hover:text-yellow-800 transition flex items-center gap-1.5 text-xs font-bold bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100"
                      >
                        <FaCode size={14} /> LeetCode
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* About Card */}
          <Card>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-indigo-700">About</h3>
              {!editBio && (
                <button
                  onClick={() => setEditBio(true)}
                  className="text-sm text-indigo-600 font-medium hover:underline"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
            {editBio ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-2 self-end">
                  <button
                    onClick={() => setEditBio(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBio}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Save Bio
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {bio || "No about information yet."}
              </p>
            )}
          </Card>

          {/* DYNAMIC SECTIONS */}
          {sections.map((section) => (
            <Card key={section.key}>
              <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-700 mb-4">
                {section.icon} {section.title}
              </h3>

              {/* List Existing Items */}
              <div className="space-y-3 mb-4">
                {section.data?.length > 0 ? (
                  section.data.map((item, i) => (
                    <div
                      key={item._id || i}
                      className="group relative p-4 border border-gray-200 rounded-lg bg-white/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* ACTION BUTTONS (Edit/Delete) - Top Right */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(section, item)}
                          className="text-gray-400 hover:text-indigo-600"
                          title="Edit"
                        >
                          <FaPen size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteItem(section.key, item._id)
                          }
                          className="text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pr-10">
                        {Object.entries(item).map(([k, v]) => {
                          if (k === "_id") return null;
                          const isLink =
                            k === "link" ||
                            (typeof v === "string" &&
                              (v.startsWith("http://") ||
                                v.startsWith("https://")));

                          return (
                            <div key={k} className="text-sm">
                              <span className="font-semibold text-gray-600 capitalize">
                                {k}:{" "}
                              </span>
                              {isLink ? (
                                <a
                                  href={v}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline break-all"
                                >
                                  {v}
                                </a>
                              ) : (
                                <span className="text-gray-800">{v}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No {section.title.toLowerCase()} added yet.
                  </p>
                )}
              </div>

              {/* Add New Item Form (Bottom of card) */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {section.fields.map((field) => (
                    <input
                      key={field.name}
                      type="text"
                      value={section.inputs[field.name]}
                      onChange={(e) =>
                        section.setInputs({
                          ...section.inputs,
                          [field.name]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className={`px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none ${
                        field.name === "description" ? "sm:col-span-2" : ""
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    handleAddSection(
                      section.key,
                      section.inputs,
                      section.setInputs,
                      section.emptyState
                    )
                  }
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  <FaPlus size={12} /> Add {section.title}
                </button>
              </div>
            </Card>
          ))}

          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaMagic /> AI Resume Builder
            </h3>
            <button
              onClick={generateResume}
              className="mt-4 px-5 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-50 transition text-sm"
            >
              Generate Resume
            </button>
            {resume && (
              <div className="mt-4 bg-white/95 text-gray-800 rounded-xl p-4 max-h-64 overflow-y-auto shadow-inner font-mono text-xs sm:text-sm border-2 border-indigo-200">
                <pre className="whitespace-pre-wrap">{resume}</pre>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {isModalOpen && editingSection && (
          <EditModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEdit}
            data={editingItemData}
            setData={setEditingItemData}
            fields={editingSection.fields}
            title={editingSection.title}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
