import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser, FaEnvelope, FaLock, FaUniversity, FaCalendarAlt,
  FaPhone, FaLinkedin, FaInfoCircle, FaTools, FaBuilding,
  FaIdBadge, FaLayerGroup, FaChalkboardTeacher, FaCheckCircle,
  FaExclamationCircle, FaEye, FaEyeSlash,
  FaUsers, FaStar, FaBookOpen,
} from "react-icons/fa";

// ─── Shared Input field component ────────────────────────────────────────────────
const InputField = ({ icon: Icon, rightIcon: RightIcon, onRightIconClick, error, className = "", ...props }) => (
  <div className={`relative ${className}`}>
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="text-indigo-400" size={15} />
      </div>
    )}
    <input
      {...props}
      className={`w-full ${Icon ? "pl-11" : "pl-4"} ${RightIcon ? "pr-12" : "pr-4"} py-3 bg-white/80 border ${
        error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-100"
      } rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:border-indigo-400 transition-all duration-200 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
    />
    {RightIcon && (
      <button
        type="button"
        onClick={onRightIconClick}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
      >
        <RightIcon size={15} />
      </button>
    )}
    {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
  </div>
);

// ─── Password Strength Badge ──────────────────────────────────────────────────────
const Badge = ({ label, met }) => (
  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-300 ${
    met ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"
  }`}>
    {met ? <FaCheckCircle size={9} /> : <FaExclamationCircle size={9} />}
    {label}
  </span>
);

// ─── Left Brand Panel ─────────────────────────────────────────────────────────────
const BrandPanel = () => (
  <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-12 rounded-l-3xl relative overflow-hidden">
    {/* Decorative circles */}
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
      
      {/* Centered Logo */}
      <div className="mb-10 w-full flex justify-center">
        <div className="bg-white px-6 py-4 rounded-xl shadow-lg">
          <img 
            src="/assets/images/logocampus.png" 
            alt="CampusPull Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      <div className="w-full text-left space-y-8">
        {/* Tagline */}
        <p className="text-white/90 text-[15px] leading-relaxed font-medium">
          Your one-stop platform to connect, learn, and grow with your college community.
        </p>

        {/* Features list */}
        <div className="space-y-6">
          {[
            { icon: FaUsers, title: "Explore & Connect", desc: "Find mentors, alumni, and peers from your campus" },
            { icon: FaBookOpen, title: "Curated Resources", desc: "Access study materials, roadmaps & interview PYQs" },
            { icon: FaStar, title: "Grow Together", desc: "Join events, discussions, and community challenges" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-white/20">
                <Icon size={16} />
              </div>
              <div className="pt-0.5">
                <h3 className="font-semibold text-[15px]">{title}</h3>
                <p className="text-white/70 text-sm mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────────
function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, signup } = useAuth();
  const [role, setRole] = useState("student");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setIsLogin(queryParams.get("signup") !== "true");
  }, [location.search]);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", college: "ABESIT",
    degree: "", department: "",
    graduationYear: "", designation: "", currentCompany: "",
    phone: "", linkedin: "", bio: "", skills: [],
  });

  const [loginError, setLoginError] = useState("");

  const graduationYears = useMemo(() => {
    const currentYear = 2026;
    const years = [];
    if (role === "student") {
      for (let y = currentYear; y <= currentYear + 6; y++) {
        years.push(y);
      }
    } else if (role === "alumni") {
      for (let y = currentYear; y >= currentYear - 6; y--) {
        years.push(y);
      }
    }
    return years;
  }, [role]);

  const validations = useMemo(() => {
    if (isLogin) return { isValid: !!form.email && form.password.length >= 6 };
    const hasName = form.name.trim().length >= 3;
    const hasEmail = /\S+@\S+\.\S+/.test(form.email);
    const hasCap = /[A-Z]/.test(form.password);
    const hasNum = /[0-9]/.test(form.password);
    const hasSpcial = /[\W_]/.test(form.password);
    const hasNocap = /[a-z]/.test(form.password);
    const hasLen = form.password.length >= 8;
    const passwordMatch = form.password === form.confirmPassword && form.password.length > 0;

    const hasCollege = !!form.college;
    const hasDept = !!form.department;
    const hasDegree = (role === "student" || role === "alumni") ? !!form.degree : true;
    const hasGraduationYear = (role === "student" || role === "alumni") ? !!form.graduationYear : true;
    const hasDesignation = role === "teacher" ? !!form.designation.trim() : true;
    const hasCurrentCompany = role === "alumni" ? !!form.currentCompany.trim() : true;

    const isPhoneValid = form.phone === "" || /^\d{10}$/.test(form.phone);
    const isBioValid = form.bio.length <= 500;

    const isValid = 
      hasName && 
      hasEmail && 
      hasCap && 
      hasNocap && 
      hasNum && 
      hasLen && 
      hasSpcial && 
      passwordMatch &&
      hasCollege &&
      hasDept &&
      hasDegree &&
      hasGraduationYear &&
      hasDesignation &&
      hasCurrentCompany &&
      isPhoneValid && 
      isBioValid;

    return {
      hasName, hasEmail, hasCap, hasNocap, hasNum, hasLen, hasSpcial, passwordMatch,
      hasCollege, hasDept, hasDegree, hasGraduationYear, hasDesignation, hasCurrentCompany,
      isPhoneValid, isBioValid, isValid
    };
  }, [form, isLogin, role]);

  const getClientErrors = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Full Name is required.";
    } else if (form.name.trim().length < 3) {
      errs.name = "Name must be at least 3 characters.";
    }

    if (!form.email) {
      errs.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Enter a valid email.";
    }

    if (!form.password) {
      errs.password = "Password is required.";
    } else {
      if (form.password.length < 8) {
        errs.password = "Password must contain at least 8 characters.";
      } else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password)) {
        errs.password = "Password must contain both uppercase and lowercase letters.";
      } else if (!/[0-9]/.test(form.password)) {
        errs.password = "Password must contain at least one number.";
      } else if (!/[\W_]/.test(form.password)) {
        errs.password = "Password must contain at least one special character.";
      }
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Confirm Password is required.";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!form.college) {
      errs.college = "College is required.";
    }

    if (!form.department) {
      errs.department = "Department is required.";
    }

    if (role === "student" || role === "alumni") {
      if (!form.degree) {
        errs.degree = "Degree is required.";
      }
      if (!form.graduationYear) {
        errs.graduationYear = "Graduation Year is required.";
      } else {
        const yearNum = Number(form.graduationYear);
        if (role === "student" && (yearNum < 2026 || yearNum > 2032)) {
          errs.graduationYear = "Graduation Year must be between 2026 and 2032.";
        } else if (role === "alumni" && (yearNum < 2020 || yearNum > 2026)) {
          errs.graduationYear = "Graduation Year must be between 2020 and 2026.";
        }
      }
    }

    if (role === "teacher" && !form.designation.trim()) {
      errs.designation = "Designation is required.";
    }

    if (role === "alumni" && !form.currentCompany.trim()) {
      errs.currentCompany = "Current Company is required.";
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      errs.phone = "Enter a valid 10-digit phone number.";
    }

    if (form.bio && form.bio.length > 500) {
      errs.bio = "Bio cannot exceed 500 characters.";
    }

    return errs;
  };

  const strengthScore = useMemo(() => {
    if (isLogin) return 0;
    const { hasLen, hasCap, hasNocap, hasNum, hasSpcial } = validations;
    return [hasLen, hasCap, hasNocap, hasNum, hasSpcial].filter(Boolean).length;
  }, [validations, isLogin]);

  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strengthScore];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"][strengthScore];

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLoginError("");
    setFieldErrors({});
    setForm({ name: "", email: "", password: "", confirmPassword: "", college: "ABESIT", degree: "", department: "", graduationYear: "", designation: "", currentCompany: "", phone: "", linkedin: "", bio: "", skills: [] });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFieldErrors({});
    setForm(prev => ({
      ...prev,
      graduationYear: "",
      degree: "",
      designation: "",
      currentCompany: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "phone") { const onlyNums = value.replace(/\D/g, ""); if (onlyNums.length <= 10) setForm(prev => ({ ...prev, [name]: onlyNums })); return; }
    if (name === "bio") { if (value.length <= 500) setForm(prev => ({ ...prev, [name]: value })); return; }
    if (name === "skills") setForm(prev => ({ ...prev, skills: value.split(",").map((s) => s.trim()) }));
    else if (name === "graduationYear") setForm(prev => ({ ...prev, [name]: value ? Number(value) : "" }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => { if (!user) setForm((prev) => ({ ...prev, email: "", password: "" })); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setFieldErrors({});

    if (isLogin) {
      if (!validations.isValid) { 
        toast.error("Please complete all required fields correctly."); 
        return; 
      }
    } else {
      const clientErrors = getClientErrors();
      if (Object.keys(clientErrors).length > 0) {
        setFieldErrors(clientErrors);
        toast.error("Please correct the errors in the form.");
        return;
      }
    }

    setLoading(true);
    const loadToast = toast.loading(isLogin ? "Signing in..." : "Creating account...");
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        toast.success("Welcome Back!", { id: loadToast });
      } else {
        const signupPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          college: form.college,
          department: form.department,
          role,
        };

        if (role === "student" || role === "alumni") {
          signupPayload.degree = form.degree;
          signupPayload.graduationYear = Number(form.graduationYear);
        }

        if (role === "alumni") {
          signupPayload.currentCompany = form.currentCompany.trim();
        }

        if (role === "teacher") {
          signupPayload.designation = form.designation.trim();
        }

        if (form.phone.trim()) signupPayload.phone = form.phone.trim();
        if (form.linkedin.trim()) signupPayload.linkedin = form.linkedin.trim();
        if (form.bio.trim()) signupPayload.bio = form.bio.trim();
        if (form.skills && form.skills.length > 0) {
          const filteredSkills = form.skills.filter(s => s.trim().length > 0);
          if (filteredSkills.length > 0) {
            signupPayload.skills = filteredSkills;
          }
        }

        await signup(signupPayload);
        toast.success("Account Created! Check your email to verify.", { id: loadToast, duration: 5000 });
        navigate('/check-email', { state: { email: form.email } });
        setIsLogin(true);
      }
    } catch (err) {
      const data = err.response?.data;
      let backendErrors = {};
      if (data) {
        if (data.field && data.message) {
          backendErrors[data.field] = data.message;
        } else if (Array.isArray(data)) {
          data.forEach(e => {
            if (e.field && e.message) backendErrors[e.field] = e.message;
          });
        } else if (data.errors) {
          if (Array.isArray(data.errors)) {
            data.errors.forEach(e => {
              if (e.field && e.message) backendErrors[e.field] = e.message;
            });
          } else if (typeof data.errors === "object") {
            Object.keys(data.errors).forEach(k => {
              const val = data.errors[k];
              backendErrors[k] = Array.isArray(val) ? val[0] : val;
            });
          }
        }
      }

      if (Object.keys(backendErrors).length > 0) {
        setFieldErrors(backendErrors);
        toast.error("Please correct the errors in the form.", { id: loadToast });
        return;
      }

      const msg = data?.message || "Something went wrong";
      toast.error(msg, { id: loadToast });
      if (isLogin) {
        setLoginError(msg);
      }
    } finally { setLoading(false); }
  };

  const departments = ["CSE", "CS-DS", "AI", "IT", "IOT"];
  const roles = [
    { id: "student", label: "Student", icon: FaUser },
    { id: "alumni", label: "Alumni", icon: FaBuilding },
    { id: "teacher", label: "Teacher", icon: FaChalkboardTeacher },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 sm:p-6">
      <Toaster position="top-center" />

      <div className="w-full max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 bg-white/60 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden border border-white/50 min-h-[500px]">

          {/* ── LEFT BRAND PANEL ── */}
          <BrandPanel isLogin={isLogin} />

          {/* ── RIGHT FORM PANEL ── */}
          <div className="p-8 sm:p-10 overflow-y-auto max-h-[85vh]">
            {/* Mobile logo */}
            <div className="flex lg:hidden justify-center mb-8 mt-2">
              <img 
                src="/assets/images/logocampus.png" 
                alt="CampusPull Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Toggle tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              {["Sign In", "Sign Up"].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setIsLogin(i === 0); setLoginError(""); setFieldErrors({}); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isLogin === (i === 0)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* Heading */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isLogin ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isLogin ? "Sign in to access your campus network." : "Join CampusPull and start your journey."}
                  </p>
                </div>

                {/* Role Selector — tabs layout */}
                {!isLogin && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">I am a...</p>
                    <div className="flex border-b border-gray-200">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => { handleRoleChange(r.id); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 text-sm font-bold transition-all duration-200 ${
                              role === r.id
                                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <Icon size={15} />
                            <span>{r.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name — signup only */}
                  {!isLogin && (
                    <InputField icon={FaUser} type="text" name="name" placeholder="Enter name" value={form.name} onChange={handleChange} error={fieldErrors.name} required />
                  )}

                  {/* Email */}
                  <InputField icon={FaEnvelope} type="email" name="email" placeholder="Enter email" value={form.email} onChange={handleChange} error={fieldErrors.email} required />

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaLock className={`${(loginError && isLogin) || (!isLogin && fieldErrors.password) || (!isLogin && form.password.length > 0 && (!validations.hasLen || !validations.hasCap || !validations.hasNocap || !validations.hasNum || !validations.hasSpcial)) ? 'text-red-400' : 'text-indigo-400'}`} size={15} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Pass@123"
                      value={form.password}
                      onChange={(e) => { setLoginError(""); handleChange(e); }}
                      required
                      className={`w-full pl-11 pr-12 py-3 bg-white/80 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-sm font-medium ${
                        (loginError && isLogin) || (!isLogin && fieldErrors.password) || (!isLogin && form.password.length > 0 && (!validations.hasLen || !validations.hasCap || !validations.hasNocap || !validations.hasNum || !validations.hasSpcial))
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                          : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                  
                  {/* Inline Error messages for Password */}
                  {isLogin && loginError && (
                    <div className="text-xs font-semibold text-red-500 pl-1 animate-fade-in-up">
                       {loginError}
                    </div>
                  )}
                  {!isLogin && fieldErrors.password && (
                    <div className="text-xs font-semibold text-red-500 pl-1 animate-fade-in-up">
                       {fieldErrors.password}
                    </div>
                  )}
                  {!isLogin && form.password.length > 0 && (
                    <div className="text-[11px] font-medium pl-1 space-y-1 animate-fade-in-up">
                      {!validations.hasLen && <p className="text-red-500 flex items-center gap-1">❌ At least 8 characters</p>}
                      {(!validations.hasCap || !validations.hasNocap) && <p className="text-red-500 flex items-center gap-1">❌ Upper & lowercase letter</p>}
                      {!validations.hasNum && <p className="text-red-500 flex items-center gap-1">❌ At least one number</p>}
                      {!validations.hasSpcial && <p className="text-red-500 flex items-center gap-1">❌ At least one special character</p>}
                    </div>
                  )}

                  {/* Forgot password link */}
                  {isLogin && (
                    <div className="flex justify-end -mt-1">
                      <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                  )}

                  {/* Password strength — signup only */}
                  {!isLogin && form.password.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              i <= strengthScore ? strengthColor : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {strengthLabel && <p className={`text-xs font-semibold ${["", "text-red-500", "text-orange-500", "text-yellow-600", "text-emerald-600", "text-emerald-600"][strengthScore]}`}>{strengthLabel}</p>}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge label="8+ Chars" met={validations.hasLen} />
                        <Badge label="A–Z" met={validations.hasCap} />
                        <Badge label="a–z" met={validations.hasNocap} />
                        <Badge label="0–9" met={validations.hasNum} />
                        <Badge label="@#$!" met={validations.hasSpcial} />
                      </div>
                    </div>
                  )}

                  {/* ── SIGNUP EXTRA FIELDS ── */}
                  {!isLogin && (
                    <>
                      {/* Confirm Password (NO toggle eye icon) */}
                      <InputField
                        icon={FaLock}
                        type="password"
                        name="confirmPassword"
                        placeholder="Pass@123"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        error={form.confirmPassword && form.confirmPassword !== form.password ? "Passwords do not match" : fieldErrors.confirmPassword}
                      />

                      <div className="pt-2 pb-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Academic Details</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* College Dropdown */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <FaUniversity className="text-indigo-400" size={14} />
                          </div>
                          <select
                            name="college"
                            value={form.college}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-10 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm font-medium appearance-none text-gray-700 shadow-sm"
                          >
                            <option value="ABESIT">ABESIT</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                          {fieldErrors.college && <p className="text-red-500 text-xs mt-1 pl-1">{fieldErrors.college}</p>}
                        </div>

                        {/* Department Dropdown */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <FaLayerGroup className="text-indigo-400" size={14} />
                          </div>
                          <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            required
                            className={`w-full pl-11 pr-10 py-3 bg-white/80 border ${fieldErrors.department ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm font-medium appearance-none ${form.department === "" ? "text-gray-400" : "text-gray-700"}`}
                          >
                            <option value="" disabled>Department</option>
                            {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                          {fieldErrors.department && <p className="text-red-500 text-xs mt-1 pl-1">{fieldErrors.department}</p>}
                        </div>
                      </div>

                      {/* Student/Alumni specific dropdowns */}
                      {(role === "student" || role === "alumni") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Degree Dropdown */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                              <FaIdBadge className="text-indigo-400" size={14} />
                            </div>
                            <select
                              name="degree"
                              value={form.degree}
                              onChange={handleChange}
                              required
                              className={`w-full pl-11 pr-10 py-3 bg-white/80 border ${fieldErrors.degree ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm font-medium appearance-none ${form.degree === "" ? "text-gray-400" : "text-gray-700"}`}
                            >
                              <option value="" disabled>Degree</option>
                              <option value="B.Tech">B.Tech</option>
                              <option value="M.Tech">M.Tech</option>
                              <option value="MBA">MBA</option>
                              <option value="BCA">BCA</option>
                              <option value="MCA">MCA</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            {fieldErrors.degree && <p className="text-red-500 text-xs mt-1 pl-1">{fieldErrors.degree}</p>}
                          </div>

                          {/* Graduation Year Dropdown */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                              <FaCalendarAlt className="text-indigo-400" size={14} />
                            </div>
                            <select
                              name="graduationYear"
                              value={form.graduationYear}
                              onChange={handleChange}
                              required
                              className={`w-full pl-11 pr-10 py-3 bg-white/80 border ${fieldErrors.graduationYear ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm font-medium appearance-none ${form.graduationYear === "" ? "text-gray-400" : "text-gray-700"}`}
                            >
                              <option value="" disabled>Graduation year</option>
                              {graduationYears.map((year) => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            {fieldErrors.graduationYear && <p className="text-red-500 text-xs mt-1 pl-1">{fieldErrors.graduationYear}</p>}
                          </div>
                        </div>
                      )}

                      {/* Designation (Teacher specific) */}
                      {role === "teacher" && (
                        <InputField icon={FaChalkboardTeacher} type="text" name="designation" placeholder="Assistant Professor" value={form.designation} onChange={handleChange} required error={fieldErrors.designation} />
                      )}
                      
                      {/* Current Company (Alumni specific) */}
                      {role === "alumni" && (
                        <InputField icon={FaBuilding} type="text" name="currentCompany" placeholder="Your current company name" value={form.currentCompany} onChange={handleChange} required error={fieldErrors.currentCompany} />
                      )}

                      <div className="pt-2 pb-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Optional Information</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                      </div>

                      {/* Phone & LinkedIn moved under Optional details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          icon={FaPhone}
                          type="text"
                          name="phone"
                          value={form.phone}
                          placeholder="Phone No."
                          onChange={handleChange}
                          error={fieldErrors.phone}
                        />
                        <InputField
                          icon={FaLinkedin}
                          type="url"
                          name="linkedin"
                          value={form.linkedin}
                          placeholder="Linkedin URL"
                          onChange={handleChange}
                          error={fieldErrors.linkedin}
                        />
                      </div>

                      {/* Bio */}
                      <div className="relative">
                        <div className="absolute top-3 left-4 pointer-events-none z-10">
                          <FaInfoCircle className="text-indigo-400" size={14} />
                        </div>
                        <textarea
                          name="bio"
                          value={form.bio}
                          placeholder="Tell us about yourself"
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/80 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm font-medium resize-none h-20 ${
                            fieldErrors.bio ? "border-red-400" : form.bio.length >= 500 ? "border-orange-400" : "border-gray-200"
                          }`}
                        />
                        <span className={`absolute bottom-2 right-3 text-[10px] font-bold ${form.bio.length >= 500 ? "text-red-500" : "text-gray-400"}`}>
                          {form.bio.length}/500
                        </span>
                      </div>
                      {fieldErrors.bio && <p className="text-red-500 text-xs mt-1 pl-1">{fieldErrors.bio}</p>}

                      {/* Skills */}
                      <InputField icon={FaTools} type="text" name="skills" placeholder="Comma-separated skills" value={form.skills.join(", ")} onChange={handleChange} error={fieldErrors.skills} />
                    </>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isLogin ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={toggleForm} className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
