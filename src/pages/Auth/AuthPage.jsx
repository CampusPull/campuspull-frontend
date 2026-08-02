import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import {
  FaUser, FaEnvelope, FaLock, FaUniversity, FaCalendarAlt,
  FaPhone, FaLinkedin, FaInfoCircle, FaTools, FaBuilding,
  FaIdBadge, FaLayerGroup, FaChalkboardTeacher, FaCheckCircle,
  FaExclamationCircle, FaEye, FaEyeSlash,
  FaUsers, FaStar, FaBookOpen,
} from "react-icons/fa";

// ─── Shared Animated Input field component ────────────────────────────────────────
const InputField = ({ icon: Icon, rightIcon: RightIcon, onRightIconClick, error, className = "", ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400">
          <Icon size={14} className={`transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`} />
        </div>
      )}
      <motion.input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        animate={shouldReduceMotion ? {} : {
          scale: isFocused ? 1.015 : 1,
          borderColor: error ? "#f87171" : (isFocused ? "#3B82F6" : "rgba(226, 232, 240, 0.6)"),
          backgroundColor: isFocused ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)",
          boxShadow: error ? "0 0 0 2px rgba(239, 68, 68, 0.15)" : (isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.15)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)")
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`w-full ${Icon ? "pl-11" : "pl-4"} ${RightIcon ? "pr-12" : "pr-4"} py-2.5 border rounded-xl text-slate-800 placeholder-slate-400 placeholder:italic focus:outline-none backdrop-blur-sm transition-all duration-300 text-sm font-medium`}
      />
      {RightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
        >
          <RightIcon size={15} />
        </button>
      )}
    </div>
  );
};

// ─── Shared Animated Dropdown Selector Component ──────────────────────────────────
const CustomSelect = ({ icon: Icon, error, children, className = "", ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400">
          <Icon size={14} className={`transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`} />
        </div>
      )}
      <motion.select
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        animate={shouldReduceMotion ? {} : {
          scale: isFocused ? 1.015 : 1,
          borderColor: error ? "#f87171" : (isFocused ? "#3B82F6" : "rgba(226, 232, 240, 0.6)"),
          backgroundColor: isFocused ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)",
          boxShadow: error ? "0 0 0 2px rgba(239, 68, 68, 0.15)" : (isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.15)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)")
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-10 py-2.5 border rounded-xl focus:outline-none backdrop-blur-sm transition-all duration-300 text-sm font-medium appearance-none text-slate-700 shadow-sm`}
      >
        {children}
      </motion.select>
      <motion.div 
        animate={shouldReduceMotion ? {} : { rotate: isFocused ? 180 : 0 }}
        className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </motion.div>
    </div>
  );
};

// ─── Error Message Container with Micro-Shake ─────────────────────────────────────
const ErrorMessage = ({ error }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={shouldReduceMotion ? { opacity: 1, height: "auto", y: 0 } : { 
            opacity: 1, 
            height: "auto", 
            y: 0, 
            x: [0, -6, 6, -4, 4, -2, 2, 0] 
          }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut"
          }}
          className="text-red-500 text-xs mt-1 pl-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

// ─── Password Strength Badge ──────────────────────────────────────────────────────
const Badge = ({ label, met }) => (
  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all duration-300 ${
    met ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400 border border-slate-200"
  }`}>
    {met ? <FaCheckCircle size={9} /> : <FaExclamationCircle size={9} />}
    {label}
  </span>
);

// ─── Animated Feature Item ───────────────────────────────────────────────────────
const FeatureItem = ({ icon: Icon, title, desc, index, itemsRef }) => {
  const iconRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  
  const handleMouseEnter = () => {
    if (shouldReduceMotion) return;
    gsap.to(iconRef.current, {
      scale: 1.12,
      rotation: 6,
      yoyo: true,
      repeat: 1,
      duration: 0.2,
      ease: "back.out(1.5)"
    });
  };
  
  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    gsap.to(iconRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.2
    });
  };

  return (
    <div 
      ref={el => itemsRef.current[index] = el}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-white/5 transition-colors duration-300 cursor-pointer"
    >
      <div ref={iconRef} className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 text-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icon size={15} />
      </div>
      <div className="pt-0.5">
        <h4 className="font-semibold text-[14px] text-white">{title}</h4>
        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </div>
  );
};

// ─── Left Brand Panel ─────────────────────────────────────────────────────────────
const BrandPanel = ({ itemsRef, logoRef }) => (
  <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 rounded-l-3xl relative overflow-hidden select-none h-full">
    {/* Decorative circles */}
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
      
      {/* Centered Logo */}
      <div className="mb-8 w-full flex justify-center">
        <div ref={logoRef} className="bg-white px-5 py-3 rounded-xl shadow-lg shadow-blue-950/20">
          <img 
            src="/assets/images/logocampus.png" 
            alt="CampusPull Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      <div className="w-full text-left space-y-4">
        {/* Tagline */}
        <p className="text-slate-300 text-[14px] leading-relaxed font-medium px-2 text-center">
          Your one-stop platform to connect, learn, and grow with your college community.
        </p>

        {/* Features list */}
        <div className="space-y-3">
          <FeatureItem icon={FaUsers} title="Explore & Connect" desc="Find mentors, alumni, and peers from your campus" index={0} itemsRef={itemsRef} />
          <FeatureItem icon={FaBookOpen} title="Curated Resources" desc="Access study materials, roadmaps & interview PYQs" index={1} itemsRef={itemsRef} />
          <FeatureItem icon={FaStar} title="Grow Together" desc="Join events, discussions, and community challenges" index={2} itemsRef={itemsRef} />
        </div>
      </div>

    </div>
  </div>
);

// ─── Hover Underline Link Component ───────────────────────────────────────────────
const HoverLink = ({ onClick, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative text-blue-500 font-bold hover:text-blue-600 transition-colors duration-200 group ${className}`}
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
  </button>
);

function generateGraduationYears(role) {
  const currentYear = new Date().getFullYear();
  
  if (role === "student") {
    const years = [];
    for (let i = 0; i <= 6; i++) {
      years.push(currentYear + i);
    }
    return years.sort((a, b) => a - b);
  }
  if (role === "alumni") {
    const years = [];
    for (let i = 16; i >= 0; i--) {
      years.push(currentYear - i);
    }
    return years.sort((a, b) => a - b);
  }
  return [];
}

// ─── Main Component ───────────────────────────────────────────────────────────────
function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, signup } = useAuth();
  const [role, setRole] = useState("student");
  const [fieldErrors, setFieldErrors] = useState({});

  // Background and Card Animation Refs
  const bgRef = useRef(null);
  const cardRef = useRef(null);
  
  // Left Panel Animation Refs
  const logoRef = useRef(null);
  const itemsRef = useRef([]);

  // Tab underline animation Refs
  const tabsContainerRef = useRef(null);
  const underlineRef = useRef(null);

  // 1. Central page load animations using GSAP & Framer Motion
  useEffect(() => {
    if (shouldReduceMotion) return;

    // Background gradient subtle animation (shift every 5s)
    gsap.to(bgRef.current, {
      backgroundPosition: "100% 100%",
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Staggered sequence layout entrance
    const tl = gsap.timeline();
    
    // Fade in background gradient
    tl.fromTo(bgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    // Slide up + Fade in card
    tl.fromTo(cardRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      0.15
    );

    // Elastic bounce logo reveal
    tl.fromTo(logoRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" },
      0.25
    );

    // Left features reveal
    tl.fromTo(itemsRef.current,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      0.35
    );
  }, [shouldReduceMotion]);

  // Tab active underline sliding transition animation
  useEffect(() => {
    if (shouldReduceMotion) return;

    if (!isLogin && tabsContainerRef.current && underlineRef.current) {
      const activeTabElement = tabsContainerRef.current.querySelector('[data-active="true"]');
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        gsap.to(underlineRef.current, {
          left: offsetLeft,
          width: offsetWidth,
          duration: 0.35,
          ease: "power2.inOut"
        });
      }
    }
  }, [role, isLogin, shouldReduceMotion]);

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
    return generateGraduationYears(role);
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
        const currentYear = new Date().getFullYear();
        if (role === "student" && (yearNum < currentYear || yearNum > currentYear + 6)) {
          errs.graduationYear = `Graduation Year must be between ${currentYear} and ${currentYear + 6}.`;
        } else if (role === "alumni" && (yearNum < currentYear - 16 || yearNum > currentYear)) {
          errs.graduationYear = `Graduation Year must be between ${currentYear - 16} and ${currentYear}.`;
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
    setIsSuccess(false);
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
    setIsSuccess(false);

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
        setIsSuccess(true);
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
        setIsSuccess(true);
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

  // Stagger entry configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div 
      ref={bgRef} 
      className="h-screen w-screen flex items-center justify-center p-3 sm:p-4 bg-[length:200%_200%] transition-opacity duration-500 overflow-hidden select-none"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.08) 0%, rgba(59,130,246,0.08) 50%, rgba(16,185,129,0.08) 100%)",
        backgroundColor: "#F8FAFC"
      }}
    >
      <Toaster position="top-center" />

      <div className="w-full max-w-4xl max-h-[calc(100vh-32px)]">
        <motion.div 
          ref={cardRef}
          animate={shouldReduceMotion ? {} : {
            borderColor: isSuccess ? "#10B981" : "rgba(59, 130, 246, 0.15)",
            boxShadow: isSuccess 
              ? "0 0 40px rgba(16, 185, 129, 0.25)" 
              : "0 20px 40px -15px rgba(15, 23, 42, 0.08)"
          }}
          transition={{ duration: 1.0 }}
          className="grid lg:grid-cols-2 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-300 w-full max-h-[calc(100vh-32px)] lg:h-[640px]"
        >

          {/* ── LEFT BRAND PANEL ── */}
          <BrandPanel itemsRef={itemsRef} logoRef={logoRef} />

          {/* ── RIGHT FORM PANEL ── */}
          <div 
            className="p-5 sm:p-7 overflow-y-auto max-h-[calc(100vh-32px)] lg:h-[640px] flex flex-col justify-start scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Mobile logo */}
            <div className="flex lg:hidden justify-center mb-6 mt-1">
              <img 
                src="/assets/images/logocampus.png" 
                alt="CampusPull Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* Toggle tabs (Sign In / Sign Up) */}
            <div className="relative flex bg-slate-100 rounded-2xl p-1 mb-5">
              {["Sign In", "Sign Up"].map((label, i) => {
                const isActive = isLogin === (i === 0);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { setIsLogin(i === 0); setLoginError(""); setFieldErrors({}); }}
                    className={`relative flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 z-10 ${
                      isActive ? "text-white font-bold" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFormTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md z-[-1]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                {/* Heading */}
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {isLogin ? "Welcome back" : "Create your account"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {isLogin ? "Sign in to access your campus network." : "Join CampusPull and start your journey."}
                  </p>
                </div>

                {/* Role Selector — tabs layout */}
                {!isLogin && (
                  <div className="mb-5">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">I am a...</p>
                    <div ref={tabsContainerRef} className="flex border-b border-slate-200 relative pb-px">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const isActive = role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            data-active={isActive}
                            onClick={() => { handleRoleChange(r.id); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                              isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Icon size={13} />
                            <span>{r.label}</span>
                          </button>
                        );
                      })}
                      <div 
                        ref={underlineRef}
                        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                        style={{ left: 0, width: 0 }}
                      />
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                    className="space-y-3"
                  >
                    {/* Name — signup only */}
                    {!isLogin && (
                      <motion.div custom={0} variants={fieldVariants}>
                        <InputField icon={FaUser} type="text" name="name" placeholder="Enter Your Name" value={form.name} onChange={handleChange} error={fieldErrors.name} required />
                        <ErrorMessage error={fieldErrors.name} />
                      </motion.div>
                    )}

                    {/* Email */}
                    <motion.div custom={1} variants={fieldVariants}>
                      <InputField icon={FaEnvelope} type="email" name="email" placeholder="your.email@gmail.com" value={form.email} onChange={handleChange} error={fieldErrors.email} required />
                      <ErrorMessage error={fieldErrors.email} />
                    </motion.div>

                    {/* Password */}
                    <motion.div custom={2} variants={fieldVariants}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400">
                          <FaLock className={`${(loginError && isLogin) || (!isLogin && fieldErrors.password) || (!isLogin && form.password.length > 0 && (!validations.hasLen || !validations.hasCap || !validations.hasNocap || !validations.hasNum || !validations.hasSpcial)) ? 'text-red-400' : 'text-slate-400'}`} size={14} />
                        </div>
                        <motion.input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="8 characters with uppercase, number"
                          value={form.password}
                          onChange={(e) => { setLoginError(""); handleChange(e); }}
                          required
                          whileFocus={shouldReduceMotion ? {} : { scale: 1.015 }}
                          animate={shouldReduceMotion ? {} : {
                            borderColor: fieldErrors.password ? "#f87171" : "rgba(226, 232, 240, 0.6)",
                            backgroundColor: "rgba(255, 255, 255, 0.5)"
                          }}
                          className={`w-full pl-11 pr-12 py-2.5 bg-white/50 border rounded-xl text-slate-800 placeholder-slate-400 placeholder:italic focus:outline-none focus:ring-4 transition-all duration-300 text-sm font-medium ${
                            (loginError && isLogin) || (!isLogin && fieldErrors.password) || (!isLogin && form.password.length > 0 && (!validations.hasLen || !validations.hasCap || !validations.hasNocap || !validations.hasNum || !validations.hasSpcial))
                              ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                              : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                      
                      {/* Inline Error messages for Password */}
                      {isLogin && loginError && (
                        <div className="text-xs font-semibold text-red-500 pl-1 mt-1">
                           {loginError}
                        </div>
                      )}
                      {!isLogin && fieldErrors.password && (
                        <div className="text-xs font-semibold text-red-500 pl-1 mt-1">
                           {fieldErrors.password}
                        </div>
                      )}
                      {!isLogin && form.password.length > 0 && (
                        <div className="text-[10px] sm:text-[11px] font-medium pl-1 mt-1.5 space-y-0.5 text-slate-600">
                          {!validations.hasLen && <p className="text-red-500 flex items-center gap-1">❌ At least 8 characters</p>}
                          {(!validations.hasCap || !validations.hasNocap) && <p className="text-red-500 flex items-center gap-1">❌ Upper & lowercase letter</p>}
                          {!validations.hasNum && <p className="text-red-500 flex items-center gap-1">❌ At least one number</p>}
                          {!validations.hasSpcial && <p className="text-red-500 flex items-center gap-1">❌ At least one special character</p>}
                        </div>
                      )}
                    </motion.div>

                    {/* Forgot password link */}
                    {isLogin && (
                      <motion.div custom={3} variants={fieldVariants} className="flex justify-end">
                        <HoverLink onClick={() => navigate("/forgot-password")} className="text-xs">
                          Forgot Password?
                        </HoverLink>
                      </motion.div>
                    )}

                    {/* Password strength badge list — signup only */}
                    {!isLogin && form.password.length > 0 && (
                      <motion.div custom={3} variants={fieldVariants} className="space-y-1.5 pt-0.5">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-all duration-300 ${
                                i <= strengthScore ? strengthColor : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        {strengthLabel && <p className={`text-[10px] font-bold ${["", "text-red-500", "text-orange-500", "text-yellow-600", "text-emerald-600", "text-emerald-600"][strengthScore]}`}>{strengthLabel}</p>}
                        <div className="flex flex-wrap gap-1">
                          <Badge label="8+ Chars" met={validations.hasLen} />
                          <Badge label="A–Z" met={validations.hasCap} />
                          <Badge label="a–z" met={validations.hasNocap} />
                          <Badge label="0–9" met={validations.hasNum} />
                          <Badge label="@#$!" met={validations.hasSpcial} />
                        </div>
                      </motion.div>
                    )}

                    {/* ── SIGNUP EXTRA FIELDS ── */}
                    {!isLogin && (
                      <>
                        {/* Confirm Password (NO toggle eye icon) */}
                        <motion.div custom={4} variants={fieldVariants}>
                          <InputField
                            icon={FaLock}
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            error={form.confirmPassword && form.confirmPassword !== form.password ? "Passwords do not match" : fieldErrors.confirmPassword}
                          />
                          <ErrorMessage error={form.confirmPassword && form.confirmPassword !== form.password ? "Passwords do not match" : fieldErrors.confirmPassword} />
                        </motion.div>

                        <motion.div custom={5} variants={fieldVariants} className="pt-1.5 pb-0.5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Details</span>
                            <div className="flex-1 h-px bg-slate-200" />
                          </div>
                        </motion.div>

                        <motion.div custom={6} variants={fieldVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* College Dropdown */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400">
                              <FaUniversity size={14} />
                            </div>
                            <select
                              name="college"
                              value={form.college}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-10 py-2.5 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium appearance-none text-slate-700 shadow-sm"
                            >
                              <option value="ABESIT">ABESIT</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>

                          {/* Department Dropdown */}
                          <div>
                            <CustomSelect
                              icon={FaLayerGroup}
                              name="department"
                              value={form.department}
                              onChange={handleChange}
                              required
                              error={fieldErrors.department}
                            >
                              <option value="" disabled>Department</option>
                              {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                            </CustomSelect>
                            <ErrorMessage error={fieldErrors.department} />
                          </div>
                        </motion.div>

                        {/* Student/Alumni specific dropdowns */}
                        {(role === "student" || role === "alumni") && (
                          <motion.div custom={7} variants={fieldVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Degree Dropdown */}
                            <div>
                              <CustomSelect
                                icon={FaIdBadge}
                                name="degree"
                                value={form.degree}
                                onChange={handleChange}
                                required
                                error={fieldErrors.degree}
                              >
                                <option value="" disabled>Degree</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="MBA">MBA</option>
                                <option value="BCA">BCA</option>
                                <option value="MCA">MCA</option>
                              </CustomSelect>
                              <ErrorMessage error={fieldErrors.degree} />
                            </div>

                            {/* Graduation Year Dropdown */}
                            <div>
                              <CustomSelect
                                icon={FaCalendarAlt}
                                name="graduationYear"
                                value={form.graduationYear}
                                onChange={handleChange}
                                required
                                error={fieldErrors.graduationYear}
                              >
                                <option value="" disabled>Graduation year</option>
                                {graduationYears.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </CustomSelect>
                              <ErrorMessage error={fieldErrors.graduationYear} />
                            </div>
                          </motion.div>
                        )}

                        {/* Designation (Teacher specific) */}
                        {role === "teacher" && (
                          <motion.div custom={7} variants={fieldVariants}>
                            <InputField icon={FaChalkboardTeacher} type="text" name="designation" placeholder="e.g., Assistant Professor, Lecturer" value={form.designation} onChange={handleChange} required error={fieldErrors.designation} />
                            <ErrorMessage error={fieldErrors.designation} />
                          </motion.div>
                        )}
                        
                        {/* Current Company (Alumni specific) */}
                        {role === "alumni" && (
                          <motion.div custom={8} variants={fieldVariants}>
                            <InputField icon={FaBuilding} type="text" name="currentCompany" placeholder="Your current company name" value={form.currentCompany} onChange={handleChange} required error={fieldErrors.currentCompany} />
                            <ErrorMessage error={fieldErrors.currentCompany} />
                          </motion.div>
                        )}

                        <motion.div custom={9} variants={fieldVariants} className="pt-1.5 pb-0.5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optional Information</span>
                            <div className="flex-1 h-px bg-slate-200" />
                          </div>
                        </motion.div>

                        {/* Phone & LinkedIn moved under Optional details */}
                        <motion.div custom={10} variants={fieldVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <InputField
                              icon={FaPhone}
                              type="text"
                              name="phone"
                              value={form.phone}
                              placeholder="Phone No."
                              onChange={handleChange}
                              error={fieldErrors.phone}
                            />
                            <ErrorMessage error={fieldErrors.phone} />
                          </div>
                          <div>
                            <InputField
                              icon={FaLinkedin}
                              type="url"
                              name="linkedin"
                              value={form.linkedin}
                              placeholder="Linkedin URL"
                              onChange={handleChange}
                              error={fieldErrors.linkedin}
                            />
                            <ErrorMessage error={fieldErrors.linkedin} />
                          </div>
                        </motion.div>

                        {/* Bio */}
                        <motion.div custom={11} variants={fieldVariants} className="relative">
                          <div className="relative">
                            <div className="absolute top-2.5 left-4 pointer-events-none z-10 text-slate-400">
                              <FaInfoCircle size={14} />
                            </div>
                            <textarea
                              name="bio"
                              value={form.bio}
                              placeholder="Tell us about yourself"
                              onChange={handleChange}
                              className={`w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 placeholder:italic focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium resize-none h-16 ${
                                fieldErrors.bio ? "border-red-400" : form.bio.length >= 500 ? "border-orange-400" : "border-slate-200/60"
                              }`}
                            />
                            <span className={`absolute bottom-2.5 right-3 text-[9px] font-bold ${form.bio.length >= 500 ? "text-red-500" : "text-slate-400"}`}>
                              {form.bio.length}/500
                            </span>
                          </div>
                          <ErrorMessage error={fieldErrors.bio} />
                        </motion.div>

                        {/* Skills */}
                        <motion.div custom={12} variants={fieldVariants}>
                          <InputField icon={FaTools} type="text" name="skills" placeholder="Comma-separated skills" value={form.skills.join(", ")} onChange={handleChange} error={fieldErrors.skills} />
                          <ErrorMessage error={fieldErrors.skills} />
                        </motion.div>
                      </>
                    )}

                    {/* Submit */}
                    <motion.div custom={13} variants={fieldVariants}>
                      <motion.button
                        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/20 hover:brightness-110 text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-1.5 disabled:opacity-75 disabled:cursor-not-allowed shadow-md"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isLogin ? "Sign In" : "Create Account"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </form>

                <p className="text-center text-xs sm:text-sm text-slate-500 mt-5 mb-2">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <HoverLink onClick={toggleForm}>
                    {isLogin ? "Sign Up" : "Sign In"}
                  </HoverLink>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
