import React, { useState, useEffect, useContext, useRef } from "react";
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
  FaCode,
  FaCheck,
  FaCrop,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileContext } from "../../context/profileContext";
import toast, { Toaster } from "react-hot-toast";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    custom={delay}
    whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(99,102,241,0.12)" }}
    transition={{ type: "spring", stiffness: 220, damping: 18 }}
    className={`bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// ─── Section chip label ───────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
    {children}
  </span>
);

// ─── Info Tile ────────────────────────────────────────────────────────────────
const InfoTile = ({ label, value, icon }) => (
  <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-3 flex flex-col gap-0.5 hover:bg-indigo-50 transition-colors">
    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
      {icon && <span>{icon}</span>}
      {label}
    </span>
    <span className="text-sm text-gray-800 font-semibold">{value || "—"}</span>
  </div>
);

// ─── Skill chip colors ────────────────────────────────────────────────────────
const chipPalette = [
  "bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200",
  "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200",
  "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200",
  "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200",
  "bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200",
  "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200",
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ isOpen, onClose, onSave, data, setData, fields, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.93 }}
        className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800">Edit {title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <SectionLabel>{field.placeholder}</SectionLabel>
              <input
                type="text"
                value={data[field.name] || ""}
                onChange={(e) =>
                  setData({ ...data, [field.name]: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none text-sm transition"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-indigo-200 transition flex items-center gap-2"
          >
            <FaSave size={13} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Crop Modal (with corrected object-fit:contain math) ──────────────────────
const CropModal = ({ src, onCancel, onCrop }) => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [cropBox, setCropBox] = useState({ x: 60, y: 50, size: 180 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, bx: 0, by: 0 });
  // Actual rendered image bounds within the container (object-fit:contain)
  const [imgBounds, setImgBounds] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Compute actual rendered image position (object-fit: contain leaves letterbox bars)
  const computeImgBounds = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container || !img.naturalWidth) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const iAspect = img.naturalWidth / img.naturalHeight;
    const cAspect = cW / cH;

    let renderedW, renderedH, offsetX, offsetY;
    if (iAspect > cAspect) {
      renderedW = cW;
      renderedH = cW / iAspect;
      offsetX = 0;
      offsetY = (cH - renderedH) / 2;
    } else {
      renderedH = cH;
      renderedW = cH * iAspect;
      offsetX = (cW - renderedW) / 2;
      offsetY = 0;
    }
    setImgBounds({ x: offsetX, y: offsetY, w: renderedW, h: renderedH });
    // Centre the initial crop box inside the actual image area
    const initSize = Math.min(renderedW, renderedH) * 0.7;
    setCropBox({
      x: offsetX + (renderedW - initSize) / 2,
      y: offsetY + (renderedH - initSize) / 2,
      size: initSize,
    });
  };

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ mx: e.clientX, my: e.clientY, bx: cropBox.x, by: cropBox.y });
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      // Clamp within actual image bounds (not container)
      const newX = Math.max(
        imgBounds.x,
        Math.min(dragStart.bx + e.clientX - dragStart.mx, imgBounds.x + imgBounds.w - cropBox.size)
      );
      const newY = Math.max(
        imgBounds.y,
        Math.min(dragStart.by + e.clientY - dragStart.my, imgBounds.y + imgBounds.h - cropBox.size)
      );
      setCropBox((c) => ({ ...c, x: newX, y: newY }));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, dragStart, cropBox.size, imgBounds]);

  // Clamp size slider within image bounds
  const handleSizeChange = (newSize) => {
    const maxSize = Math.min(imgBounds.w, imgBounds.h);
    const clampedSize = Math.min(newSize, maxSize);
    // Also re-clamp position so the box stays within image
    const newX = Math.min(cropBox.x, imgBounds.x + imgBounds.w - clampedSize);
    const newY = Math.min(cropBox.y, imgBounds.y + imgBounds.h - clampedSize);
    setCropBox({ x: newX, y: newY, size: clampedSize });
  };

  const handleConfirm = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container || !imgBounds.w) return;

    // Scale: natural px per rendered px
    const scaleX = img.naturalWidth / imgBounds.w;
    const scaleY = img.naturalHeight / imgBounds.h;

    // Crop coords relative to rendered image (subtract letterbox offset)
    const srcX = Math.max(0, (cropBox.x - imgBounds.x) * scaleX);
    const srcY = Math.max(0, (cropBox.y - imgBounds.y) * scaleY);
    const srcSize = cropBox.size * scaleX; // same scale on both axes (we used aspect-fit)

    const canvas = document.createElement("canvas");
    const OUT = 400;
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUT, OUT);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        onCrop(file);
      },
      "image/jpeg",
      0.93
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.93 }}
        className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl w-full max-w-lg p-6"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
              <FaCrop size={14} />
            </span>
            Crop Profile Photo
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <p className="text-gray-400 text-xs mb-3">
          Drag the circle to set your crop area. Resize with the slider below.
        </p>

        {/* Image container */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-xl select-none bg-gray-900"
          style={{ height: 300 }}
        >
          <img
            ref={imageRef}
            src={src}
            alt="Crop preview"
            className="w-full h-full object-contain"
            draggable={false}
            onLoad={computeImgBounds}
          />

          {/* Dimmed overlay around crop box */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(to bottom,
                  rgba(0,0,0,0.55) ${cropBox.y}px,
                  transparent ${cropBox.y}px,
                  transparent ${cropBox.y + cropBox.size}px,
                  rgba(0,0,0,0.55) ${cropBox.y + cropBox.size}px
                ),
                linear-gradient(to right,
                  rgba(0,0,0,0.55) ${cropBox.x}px,
                  transparent ${cropBox.x}px,
                  transparent ${cropBox.x + cropBox.size}px,
                  rgba(0,0,0,0.55) ${cropBox.x + cropBox.size}px
                )
              `,
            }}
          />

          {/* Draggable crop ring */}
          <div
            onMouseDown={startDrag}
            className="absolute border-2 border-white rounded-full cursor-move shadow-2xl"
            style={{
              left: cropBox.x,
              top: cropBox.y,
              width: cropBox.size,
              height: cropBox.size,
            }}
          >
            {/* Inner ring */}
            <div className="absolute inset-0 rounded-full ring-1 ring-indigo-400 ring-offset-0 opacity-70" />
            {/* Corner guides */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-full" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-full" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-full" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-full" />
          </div>
        </div>

        {/* Slider */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-gray-400 text-xs w-10 shrink-0">Size</span>
          <input
            type="range"
            min={60}
            max={Math.min(imgBounds.w || 280, imgBounds.h || 280)}
            value={cropBox.size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
        </div>

        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-md hover:shadow-indigo-200 transition flex items-center gap-2"
          >
            <FaCheck size={13} /> Crop &amp; Upload
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Profile Component ───────────────────────────────────────────────────
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
    uploadBanner,
    deleteBanner,
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
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local object URL for instant preview (optimistic UI)
    const localUrl = URL.createObjectURL(file);
    setBannerPreview(localUrl);

    try {
      setUploadingBanner(true);
      await uploadBanner(file);
      toast.success("Cover image updated successfully");
    } catch (err) {
      console.error("Banner upload error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to upload cover image";
      toast.error(errMsg);
      setBannerPreview(null); // revert preview on error
    } finally {
      setUploadingBanner(false);
      URL.revokeObjectURL(localUrl); // clean up resource
    }
  };

  const handleDeleteBanner = async () => {
    if (window.confirm("Are you sure you want to delete your cover image?")) {
      try {
        setUploadingBanner(true);
        await deleteBanner();
        toast.success("Cover image deleted successfully");
      } catch (err) {
        console.error("Banner delete error:", err);
        const errMsg = err.response?.data?.message || err.message || "Failed to delete cover image";
        toast.error(errMsg);
      } finally {
        setUploadingBanner(false);
      }
    }
  };

  // Crop modal state (UI-only addition)
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // State for Personal & Academic Info Form
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    name: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "", //Added LeetCode
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

  //  SYNC PROFILE DATA TO STATE
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
        leetcode: profile.leetcode || "", //Sync LeetCode
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 md:px-10 py-12 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-indigo-700 font-semibold animate-pulse tracking-wide text-sm">
            Loading your academic profile…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <p className="p-6 text-red-500 font-bold bg-red-50 m-4 rounded-xl">
        {error}
      </p>
    );
  if (!profile)
    return <p className="p-6 text-gray-500">No profile data available.</p>;

  // ─── HANDLERS (all preserved exactly as original) ─────────────────────────

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image too large (Max 5MB).");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropSrc(ev.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  // Called by CropModal — passes the correctly-cropped blob to existing uploadPhoto
  const handleCropConfirm = async (croppedFile) => {
    setShowCropModal(false);
    setCropSrc(null);
    setUploadingImage(true);
    try {
      await uploadPhoto(croppedFile);
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
      toast.success("Updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  const saveBio = async () => {
    await updateProfile({ bio });
    setEditBio(false);
  };

  const saveInfo = async () => {
    try {
      await updateProfile(infoForm);
      toast.success("Profile updated!");
      setIsEditingInfo(false);
    } catch (err) {
      toast.error("Failed to update info");
    }
  };

  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const generateResume = () => {
    setResumeData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      degree: profile.degree || "",
      college: profile.college || "",
      bio: profile.bio || "",
      skills: profile.skills || [],
      projects: profile.projects?.map(p => ({ title: p.title, description: p.description || "" })) || [],
      experience: profile.experience?.map(e => ({ role: e.role, company: e.company, year: e.year, description: e.description || "" })) || [],
    });
    toast.success("Resume workspace loaded! Tweak your details below.");
  };

  const handleAIPolish = (type, index) => {
    const polishText = (text) => {
      if (!text) return "Collaborated on designing and delivering high-value software features, improving reliability.";
      const lowercase = text.toLowerCase();
      if (lowercase.includes("react") || lowercase.includes("website") || lowercase.includes("frontend")) {
        return "Architected responsive UI architectures using React.js, optimizing component loading by 40% and enhancing overall page performance.";
      }
      if (lowercase.includes("backend") || lowercase.includes("database") || lowercase.includes("api")) {
        return "Designed robust backend REST APIs and implemented optimized query patterns, reducing database retrieval overhead by 45%.";
      }
      if (lowercase.includes("built") || lowercase.includes("created")) {
        return "Engineered end-to-end user-focused features from conceptual design to production, improving delivery pipelines by 25%.";
      }
      return "Spearheaded technical development of core system features, ensuring quality deliverables and increasing test coverage.";
    };

    if (type === "project") {
      setResumeData(prev => {
        const newProjects = [...prev.projects];
        newProjects[index].description = polishText(newProjects[index].description);
        return { ...prev, projects: newProjects };
      });
    } else if (type === "experience") {
      setResumeData(prev => {
        const newExp = [...prev.experience];
        newExp[index].description = polishText(newExp[index].description);
        return { ...prev, experience: newExp };
      });
    }
    toast.success("AI Polish applied! Polished description successfully.");
  };

  const handleSendOTP = async () => {
    setPassLoading(true);
    try {
      await sendPasswordOTP();
      toast.success("OTP sent to your email!");
      setPassStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setPassLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passOtp || !newPassword) return toast.error("Please fill all fields");
    setPassLoading(true);
    try {
      await verifyPasswordOTP(passOtp, newPassword);
      toast.success("Password updated successfully!");
      setPassStep(1);
      setPassOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  // Configuration for sections (preserved exactly)
  const sections = [
    {
      key: "projects",
      title: "Projects",
      icon: <FaFolderOpen />,
      color: "indigo",
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
      color: "blue",
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
      color: "purple",
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
      color: "emerald",
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

  // Input style shared across edit form
  const inputCls =
    "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none text-sm transition";

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 print:hidden">
        {/* Soft background blobs for depth */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />
        </div>

        <Toaster position="top-center" />

        {/* ── Crop Modal ── */}
        <AnimatePresence>
          {showCropModal && cropSrc && (
            <CropModal
              src={cropSrc}
              onCancel={() => {
                setShowCropModal(false);
                setCropSrc(null);
              }}
              onCrop={handleCropConfirm}
            />
          )}
        </AnimatePresence>

        {/* ── Page Layout ── */}
        <div className="relative w-full px-4 md:px-8 lg:px-12 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7">

            {/* ════════════════════ SIDEBAR ════════════════════ */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="h-fit"
            >
              {/* Profile Card */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg overflow-hidden">
                {/* Cover */}
                <div
                  className="h-32 w-full relative bg-gray-200"
                  style={{
                    background: bannerPreview
                      ? `url(${bannerPreview}) center/cover no-repeat`
                      : profile.bannerImage
                        ? `url(${profile.bannerImage}) center/cover no-repeat, url('/assets/images/default-cover.png') center/cover no-repeat`
                        : "url('/assets/images/default-cover.png') center/cover no-repeat",
                  }}
                >
                  {!profile.bannerImage && !bannerPreview && (
                    <>
                      <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                      <div className="absolute -bottom-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                    </>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {/* Banner Upload Button */}
                    <label className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg cursor-pointer backdrop-blur-md transition-colors shadow-sm flex items-center gap-2 text-xs font-semibold">
                      {uploadingBanner ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaCamera size={12} />
                      )}
                      <span>{profile.bannerImage ? "Change Cover" : "Add Cover"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                        disabled={uploadingBanner}
                      />
                    </label>

                    {/* Banner Delete Button */}
                    {profile.bannerImage && (
                      <button
                        onClick={handleDeleteBanner}
                        disabled={uploadingBanner}
                        className="bg-red-600/60 hover:bg-red-600/80 text-white p-2 rounded-lg backdrop-blur-md transition-colors shadow-sm flex items-center gap-2 text-xs font-semibold"
                      >
                        <FaTrash size={12} />
                        <span>Delete Cover</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Avatar + Name */}
                <div className="flex flex-col items-center text-center px-6 pb-6 -mt-16 relative">
                  <div className="relative group">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      src={profile.profileImage || "/default-avatar.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full ring-4 ring-white shadow-xl object-cover bg-gray-100"
                    />

                    {/* Camera btn */}
                    <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all z-10 ring-2 ring-white">
                      {uploadingImage ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaCamera size={13} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>

                    {/* Delete btn */}
                    {profile.profileImage && (
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition opacity-0 group-hover:opacity-100 ring-2 ring-white"
                        title="Remove Photo"
                      >
                        <FaTrash size={11} />
                      </button>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mt-4 text-gray-800">
                    {profile.name || "User"}
                  </h2>
                  <p className="text-sm text-indigo-600 font-medium mt-0.5">
                    {profile.role === "alumni"
                      ? "Alumni"
                      : `${profile.degree || ""} Student`}
                  </p>



                  {/* Social quick links */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2 w-full">
                    {profile.linkedin && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 transition"
                      >
                        <FaLinkedin size={12} /> LinkedIn
                      </motion.a>
                    )}
                    {profile.email && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={`mailto:${profile.email}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 transition"
                      >
                        <FaEnvelope size={12} /> Email
                      </motion.a>
                    )}
                    {profile.github && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition"
                      >
                        <FaGithub size={12} /> GitHub
                      </motion.a>
                    )}
                    {profile.leetcode && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={profile.leetcode}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-100 transition"
                      >
                        <FaCode size={12} /> LeetCode
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-gray-100" />

                {/* Skills */}
                <div className="px-6 py-5">
                  <h3 className="text-sm font-bold text-indigo-700 flex items-center gap-2 mb-3">
                    <FaTools size={13} /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.04 }}
                          className={`group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${chipPalette[idx % chipPalette.length]}`}
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-current opacity-40 hover:opacity-100 transition ml-0.5"
                          >
                            <FaTimes size={10} />
                          </button>
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No skills added yet.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill…"
                      className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 outline-none"
                      onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={handleAddSkill}
                      className="flex-shrink-0 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition shadow-sm"
                    >
                      <FaPlus size={12} />
                    </motion.button>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-gray-100" />

                {/* Security */}
                <div className="px-6 py-5">
                  <h3 className="text-sm font-bold text-red-500 flex items-center gap-2 mb-3">
                    <FaLock size={13} /> Security
                  </h3>
                  <div className="bg-white/70 border border-gray-100 rounded-xl p-4">
                    {passStep === 1 ? (
                      <>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                          Update your account password. A secure OTP will be sent
                          to your registered email for verification.
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={handleSendOTP}
                          disabled={passLoading}
                          className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition disabled:opacity-50 text-sm"
                        >
                          {passLoading ? "Sending OTP…" : "Change Password"}
                        </motion.button>
                      </>
                    ) : (
                      <div className="space-y-3 animate-fade-in-up">
                        <div>
                          <SectionLabel>Verification Code</SectionLabel>
                          <input
                            type="text"
                            maxLength="6"
                            value={passOtp}
                            onChange={(e) =>
                              setPassOtp(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="• • • • • •"
                            className="w-full p-3 text-center tracking-[0.5em] font-mono text-lg font-bold border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-red-300 outline-none"
                          />
                        </div>
                        <div>
                          <SectionLabel>New Password</SectionLabel>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-red-300 outline-none text-sm"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setPassStep(1);
                              setPassOtp("");
                              setNewPassword("");
                            }}
                            className="flex-1 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl text-sm transition"
                          >
                            Cancel
                          </button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleUpdatePassword}
                            disabled={passLoading}
                            className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm"
                          >
                            {passLoading ? "Verifying…" : "Update"}
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ════════════════════ MAIN CONTENT ════════════════════ */}
            <div className="md:col-span-2 space-y-6">

              {/* ── Personal & Academic Info ── */}
              <Card delay={1}>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-100 rounded-lg">
                      <FaUniversity size={14} />
                    </span>
                    Personal &amp; Academic Info
                  </h3>
                  {!isEditingInfo && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditingInfo(true)}
                      className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition"
                    >
                      <FaPen size={10} /> Edit
                    </motion.button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isEditingInfo ? (
                    <motion.div
                      key="edit"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -8 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Full Name */}
                      <div className="col-span-1 md:col-span-2">
                        <SectionLabel>Full Name</SectionLabel>
                        <input
                          type="text"
                          value={infoForm.name}
                          onChange={(e) =>
                            setInfoForm({ ...infoForm, name: e.target.value })
                          }
                          className={inputCls}
                        />
                      </div>

                      {/* Contact & Socials */}
                      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                        <div>
                          <SectionLabel>Phone (Confidential)</SectionLabel>
                          <input
                            type="text"
                            value={infoForm.phone}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, phone: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <SectionLabel>Portfolio / Website</SectionLabel>
                          <input
                            type="text"
                            placeholder="https://…"
                            value={infoForm.portfolio}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, portfolio: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <SectionLabel>LinkedIn URL</SectionLabel>
                          <input
                            type="text"
                            placeholder="https://linkedin.com/in/…"
                            value={infoForm.linkedin}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, linkedin: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <SectionLabel>GitHub URL</SectionLabel>
                          <input
                            type="text"
                            placeholder="https://github.com/…"
                            value={infoForm.github}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, github: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                        {/* LeetCode */}
                        <div className="col-span-1 md:col-span-2">
                          <SectionLabel>LeetCode URL</SectionLabel>
                          <input
                            type="text"
                            placeholder="https://leetcode.com/…"
                            value={infoForm.leetcode}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, leetcode: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Academic */}
                      <div>
                        <SectionLabel>College</SectionLabel>
                        <input
                          type="text"
                          value={infoForm.college}
                          onChange={(e) =>
                            setInfoForm({ ...infoForm, college: e.target.value })
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <SectionLabel>Department</SectionLabel>
                        <input
                          type="text"
                          value={infoForm.department}
                          onChange={(e) =>
                            setInfoForm({ ...infoForm, department: e.target.value })
                          }
                          className={inputCls}
                        />
                      </div>

                      {/* Teacher */}
                      {isTeacher && (
                        <div>
                          <SectionLabel>Designation</SectionLabel>
                          <input
                            type="text"
                            value={infoForm.designation}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, designation: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                      )}

                      {/* Alumni */}
                      {isAlumni && (
                        <div className="col-span-1 md:col-span-2">
                          <SectionLabel>Current Company</SectionLabel>
                          <input
                            type="text"
                            value={infoForm.currentCompany}
                            placeholder="Where are you working?"
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, currentCompany: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                      )}

                      {/* Student + Alumni */}
                      {(isStudent || isAlumni) && (
                        <>
                          <div>
                            <SectionLabel>Degree</SectionLabel>
                            <input
                              type="text"
                              value={infoForm.degree}
                              onChange={(e) =>
                                setInfoForm({ ...infoForm, degree: e.target.value })
                              }
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <SectionLabel>Graduation Year</SectionLabel>
                            <input
                              type="number"
                              value={infoForm.graduationYear}
                              onChange={(e) =>
                                setInfoForm({ ...infoForm, graduationYear: e.target.value })
                              }
                              className={inputCls}
                            />
                          </div>
                        </>
                      )}

                      {/* Student only */}
                      {isStudent && (
                        <>
                          <div>
                            <SectionLabel>Current Year (1-4)</SectionLabel>
                            <input
                              type="number"
                              value={infoForm.year}
                              onChange={(e) =>
                                setInfoForm({ ...infoForm, year: e.target.value })
                              }
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <SectionLabel>Section</SectionLabel>
                            <input
                              type="text"
                              value={infoForm.section}
                              onChange={(e) =>
                                setInfoForm({ ...infoForm, section: e.target.value })
                              }
                              className={inputCls}
                            />
                          </div>
                        </>
                      )}

                      <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setIsEditingInfo(false)}
                          className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={saveInfo}
                          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-md hover:shadow-emerald-200 transition text-sm font-semibold flex items-center gap-2"
                        >
                          <FaSave size={12} /> Save Info
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col gap-5"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <InfoTile
                          label="College"
                          value={profile.college}
                          icon={<FaUniversity size={10} />}
                        />
                        <InfoTile label="Department" value={profile.department} />

                        {isTeacher && (
                          <InfoTile label="Designation" value={profile.designation} />
                        )}
                        {(isStudent || isAlumni) && (
                          <>
                            <InfoTile
                              label="Degree"
                              value={profile.degree}
                              icon={<FaGraduationCap size={10} />}
                            />
                            <InfoTile
                              label="Graduation Year"
                              value={profile.graduationYear}
                            />
                          </>
                        )}
                        {isStudent && (
                          <>
                            <InfoTile
                              label="Current Year"
                              value={profile.year ? `Year ${profile.year}` : null}
                            />
                            <InfoTile
                              label="Section"
                              value={profile.section || profile.Section}
                            />
                          </>
                        )}
                        {isAlumni && profile.currentCompany && (
                          <InfoTile
                            label="Current Company"
                            value={profile.currentCompany}
                            icon={<FaBuilding size={10} />}
                          />
                        )}
                      </div>

                      {/* Social links */}
                      {(profile.github || profile.portfolio || profile.leetcode) && (
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                          {profile.github && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              href={profile.github}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition"
                            >
                              <FaGithub size={12} /> GitHub
                            </motion.a>
                          )}
                          {profile.portfolio && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              href={profile.portfolio}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-100 transition"
                            >
                              <FaGlobe size={12} /> Portfolio
                            </motion.a>
                          )}
                          {profile.leetcode && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              href={profile.leetcode}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-100 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-100 transition"
                            >
                              <FaCode size={12} /> LeetCode
                            </motion.a>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* ── About / Bio ── */}
              <Card delay={2}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2">
                    <span className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                      <FaUser size={13} />
                    </span>
                    About
                  </h3>
                  {!editBio && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditBio(true)}
                      className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition"
                    >
                      <FaPen size={10} /> Edit
                    </motion.button>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {editBio ? (
                    <motion.div
                      key="edit-bio"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="relative">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 outline-none min-h-[110px] text-sm resize-none"
                          placeholder="Tell us about yourself…"
                          maxLength={500}
                        />
                        <span className="absolute bottom-3 right-3 text-[10px] text-gray-400">
                          {bio.length}/500
                        </span>
                      </div>
                      <div className="flex gap-2 self-end">
                        <button
                          onClick={() => setEditBio(false)}
                          className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={saveBio}
                          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-md hover:shadow-emerald-200 transition text-sm font-semibold"
                        >
                          Save Bio
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="view-bio"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm"
                    >
                      {bio || (
                        <span className="italic text-gray-400">
                          No about information yet.
                        </span>
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Card>

              {/* ── Dynamic Sections ── */}
              {sections.map((section, sIdx) => (
                <Card key={section.key} delay={sIdx + 3}>
                  <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2 mb-4">
                    <span className="p-1.5 bg-indigo-100 rounded-lg">
                      {section.icon}
                    </span>
                    {section.title}
                  </h3>

                  {/* Existing items */}
                  <div className="space-y-3 mb-4">
                    {section.data?.length > 0 ? (
                      section.data.map((item, i) => (
                        <motion.div
                          key={item._id || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="group relative p-4 border border-gray-100 rounded-xl bg-white/70 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                          style={{ borderLeft: "3px solid #6366f1" }}
                        >
                          {/* Action buttons */}
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(section, item)}
                              className="text-gray-400 hover:text-indigo-600 transition p-1 rounded"
                              title="Edit"
                            >
                              <FaPen size={13} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteItem(section.key, item._id)
                              }
                              className="text-gray-400 hover:text-red-500 transition p-1 rounded"
                              title="Delete"
                            >
                              <FaTrash size={13} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pr-12">
                            {Object.entries(item).map(([k, v]) => {
                              if (k === "_id") return null;
                              const isLink =
                                k === "link" ||
                                (typeof v === "string" &&
                                  (v.startsWith("http://") ||
                                    v.startsWith("https://")));
                              return (
                                <div key={k} className="text-sm">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    {k}:{" "}
                                  </span>
                                  {isLink ? (
                                    <a
                                      href={v}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:underline break-all transition"
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
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic py-1">
                        No {section.title.toLowerCase()} added yet.
                      </p>
                    )}
                  </div>

                  {/* Add new item form */}
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-dashed border-gray-200">
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
                          className={`px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 outline-none transition ${field.name === "description" ? "sm:col-span-2" : ""
                            }`}
                        />
                      ))}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleAddSection(
                          section.key,
                          section.inputs,
                          section.setInputs,
                          section.emptyState
                        )
                      }
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md hover:shadow-indigo-200 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                    >
                      <FaPlus size={11} /> Add {section.title}
                    </motion.button>
                  </div>
                </Card>
              ))}

              {/* ── AI Resume Builder ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={8}
                whileHover={{ y: -3 }}
                className="relative overflow-hidden rounded-2xl shadow-xl p-6"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #ec4899 100%)",
                }}
              >
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <h3 className="relative z-10 text-base font-bold text-white flex items-center gap-2">
                  <FaMagic /> AI Resume Workspace
                </h3>
                <p className="relative z-10 text-white/75 text-xs mt-1 mb-4 font-medium">
                  Auto-generate a print-ready resume snapshot and enhance it with dynamic AI Polish.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={generateResume}
                  className="relative z-10 px-5 py-2.5 bg-white text-indigo-700 font-bold rounded-xl shadow hover:bg-indigo-50 transition text-sm"
                >
                  {resumeData ? "Re-generate Snapshot" : "Generate Resume"}
                </motion.button>

                {resumeData && (
                  <div className="relative z-10 mt-5 bg-white text-gray-800 rounded-2xl p-5 shadow-xl border border-white/30 space-y-5 text-left">

                    {/* Template Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Template Style</label>
                      <div className="flex border rounded-xl overflow-hidden p-0.5 bg-slate-50">
                        {["classic", "modern", "minimalist"].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSelectedTemplate(t)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition ${selectedTemplate === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info tweak */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          value={resumeData.name}
                          onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Email</label>
                        <input
                          type="text"
                          value={resumeData.email}
                          onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    {/* Skills List */}
                    {resumeData.skills?.length > 0 && (
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Skills Snapshot</label>
                        <div className="flex flex-wrap gap-1.5">
                          {resumeData.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-lg text-[10px] font-semibold">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience list with AI Polish */}
                    {resumeData.experience?.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Experience Highlights</label>
                        {resumeData.experience.map((exp, i) => (
                          <div key={i} className="p-3 border rounded-xl bg-slate-50/50 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700">{exp.role} at {exp.company}</span>
                              <button
                                type="button"
                                onClick={() => handleAIPolish("experience", i)}
                                className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100/50 flex items-center gap-1 transition focus:outline-none"
                              >
                                <FaMagic size={9} /> AI Polish
                              </button>
                            </div>
                            <textarea
                              value={exp.description}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[i].description = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              className="w-full border p-2 rounded-lg text-xs min-h-[50px] resize-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects list with AI Polish */}
                    {resumeData.projects?.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Projects Highlights</label>
                        {resumeData.projects.map((proj, i) => (
                          <div key={i} className="p-3 border rounded-xl bg-slate-50/50 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700">{proj.title}</span>
                              <button
                                type="button"
                                onClick={() => handleAIPolish("project", i)}
                                className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100/50 flex items-center gap-1 transition focus:outline-none"
                              >
                                <FaMagic size={9} /> AI Polish
                              </button>
                            </div>
                            <textarea
                              value={proj.description}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects];
                                newProjects[i].description = e.target.value;
                                setResumeData({ ...resumeData, projects: newProjects });
                              }}
                              className="w-full border p-2 rounded-lg text-xs min-h-[50px] resize-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Export PDF */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white font-bold text-xs rounded-xl shadow transition active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      Export to PDF (Print)
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Edit Modal Overlay ── */}
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

      {/* ── Print-only Resume Container ── */}
      {resumeData && (
        <div className="hidden print:block p-10 bg-white text-black min-h-screen font-sans">
          <style dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body { background: white !important; color: black !important; }
            .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
          }
        ` }} />

          {/* Template Styles */}
          <div className={`${selectedTemplate === "classic"
            ? "font-serif text-slate-900"
            : selectedTemplate === "minimalist"
              ? "font-mono text-slate-800 text-sm"
              : "font-sans text-slate-900"
            } space-y-6`}>
            {/* Header */}
            <div className={`border-b pb-4 ${selectedTemplate === "classic" ? "text-center" : "text-left"}`}>
              <h1 className="text-3xl font-bold tracking-tight">{resumeData.name}</h1>
              <div className={`flex flex-wrap gap-3 text-xs text-gray-500 mt-2 ${selectedTemplate === "classic" ? "justify-center" : "justify-start"}`}>
                <span>{resumeData.email}</span>
                {resumeData.phone && <span>· {resumeData.phone}</span>}
                <span>· {resumeData.degree}</span>
                <span>· {resumeData.college}</span>
              </div>
            </div>

            {/* Bio */}
            {resumeData.bio && (
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b pb-0.5 text-left">Professional Summary</h2>
                <p className="text-xs leading-relaxed text-gray-700 text-left">{resumeData.bio}</p>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills?.length > 0 && (
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b pb-0.5 text-left">Skills</h2>
                <p className="text-xs text-gray-700 text-left">{resumeData.skills.join(", ")}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience?.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b pb-0.5 text-left">Experience</h2>
                {resumeData.experience.map((exp, i) => (
                  <div key={i} className="space-y-0.5 text-left">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-800">{exp.role} at {exp.company}</h3>
                      <span className="text-[10px] text-gray-500 font-semibold">{exp.year}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects?.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b pb-0.5 text-left">Projects</h2>
                {resumeData.projects.map((proj, i) => (
                  <div key={i} className="space-y-0.5 text-left">
                    <h3 className="text-xs font-bold text-slate-800">{proj.title}</h3>
                    <p className="text-xs text-gray-600 leading-normal">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
