import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 CHANGE 1: Import Link
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; 
import {
  FaUser, FaEnvelope, FaLock, FaUniversity, FaCalendarAlt,
  FaPhone, FaLinkedin, FaInfoCircle, FaTools, FaBuilding,
  FaIdBadge, FaLayerGroup, FaChalkboardTeacher, FaCheckCircle, FaExclamationCircle
} from "react-icons/fa";

function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user, login, signup } = useAuth();
  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    name: "", email: "", password: "", college: "ABESIT",
    degree: "", department: "", section: "", year: "",
    graduationYear: "", designation: "", currentCompany: "",
    phone: "", linkedin: "", bio: "", skills: [],
  });

  // --- VALIDATION GUARD ---
  const validations = useMemo(() => {
    if (isLogin) return { isValid: form.email && form.password.length >= 6 };
    
    const hasName = form.name.trim().length >= 3;
    const hasEmail = /\S+@\S+\.\S+/.test(form.email);
    const hasCap = /[A-Z]/.test(form.password);
    const hasNum = /[0-9]/.test(form.password);
    const hasSpcial = /[\W_]/.test(form.password);
    const hasNocap = /[a-z]/.test(form.password);
    const hasLen = form.password.length >= 8;
    const hasDept = !!form.department;
    const isYearValid = form.year === "" || (Number(form.year) >= 1 && Number(form.year) <= 4);
    const isPhoneValid = form.phone === "" || /^\d{10}$/.test(form.phone);
    const isBioValid = form.bio.length <= 500;

    return {
      hasName, hasEmail, hasCap, hasNocap, hasNum, hasLen, hasSpcial, hasDept, isPhoneValid, isBioValid, isYearValid,
      isValid: hasName && hasEmail && hasCap && hasNocap && hasNum && hasLen && hasSpcial && hasDept && isPhoneValid && isBioValid && isYearValid
    };
  }, [form, isLogin]);

  const toggleForm = () => setIsLogin(!isLogin);

  // --- HANDLE CHANGE ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      const val = Number(value);
      if (value === "" || (val >= 1 && val <= 4)) {
        setForm(prev => ({ ...prev, [name]: value === "" ? "" : val }));
      } else {
        toast.error("Year must be between 1 and 4, buddy!", { id: "year-error" });
      }
      return;
    }

    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, ""); 
      if (onlyNums.length <= 10) {
        setForm(prev => ({ ...prev, [name]: onlyNums }));
      }
      return;
    }

    if (name === "bio") {
      if (value.length <= 500) {
        setForm(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "skills") {
      setForm({ ...form, skills: value.split(",").map((s) => s.trim()) });
    } else if (name === "graduationYear" || name === "year") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    if (!user) {
      setForm((prev) => ({ ...prev, email: "", password: "" }));
    }
  }, [user]);

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validations.isValid) {
      toast.error("Requirements not met, buddy!");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading(isLogin ? "Signing in..." : "Creating account...");

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        toast.success("Welcome Back! 👋", { id: loadToast });
      } else {
        await signup({ ...form, role });
        // Updated Message for email verification
        toast.success("Account Created! Check your email to verify. 📧", { 
            id: loadToast,
            duration: 5000 
        });
        navigate('/check-email', { state: { email: form.email } });
        setIsLogin(true); 
      }
    } catch (err) {
  const data = err.response?.data;
  
  if (data?.type === "VALIDATION_ERROR" && data.errors) {
    Object.values(data.errors).forEach((messages) => {
      toast.error(messages[0], { id: loadToast });
    });
    return;
  }

  // ❌ REAL server/network errors only
  toast.error(data?.message || "Something went wrong", { id: loadToast });
} finally {
      setLoading(false);
    }
  };

  const departments = ["CSE", "CS-DS", "AI", "IT", "IOT"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 transform transition duration-500 hover:scale-[1.01]">
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Login to continue" : "Join CampusPull and start your journey"}
        </p>

        {!isLogin && (
          <div className="flex justify-center gap-4 mb-8">
            {["student", "alumni", "teacher"].map((r) => (
              <button
                key={r}
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all transform hover:-translate-y-1 ${
                  role === r
                    ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setRole(r)}
              >
                {r === "student" && "🎓 Student"}
                {r === "alumni" && "🧑‍💼 Alumni"}
                {r === "teacher" && "📚 Teacher"}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            )}
            
            <div className={`flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition-all ${isLogin ? "col-span-2" : ""}`}>
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="w-full bg-transparent focus:outline-none"
              />
            </div>

            <div className={`flex flex-col ${isLogin ? "col-span-2" : ""}`}>
              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>

              {/* 👈 CHANGE 2: Forgot Password Link added here */}
              {isLogin && (
                <div className="flex justify-end mt-2">
                    <Link to="/forgot-password" className="text-xs font-bold text-blue-500 hover:text-blue-700 transition">
                        Forgot Password?
                    </Link>
                </div>
              )}
              
              {!isLogin && (
                <div className="flex gap-3 mt-2 px-1">
                  <Badge label="8+ Chars" met={validations.hasLen} />
                  <Badge label="A-Z" met={validations.hasCap} />
                  <Badge label="0-9" met={validations.hasNum} />
                  <Badge label="@#$!" met={validations.hasSpcial} />
                  <Badge label="a-z" met={validations.hasNocap} />
                </div>
              )}
            </div>
          </div>

          {!isLogin && (
            <>
              {/* REST OF YOUR FORM FIELDS (Unchanged) */}
              <div className="border-t border-gray-200 my-4"></div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Academic & Professional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
                  <FaUniversity className="text-gray-500 mr-2" />
                  <input type="text" name="college" value="ABESIT" readOnly className="w-full focus:outline-none bg-transparent text-gray-600 font-bold cursor-not-allowed"/>
                </div>
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                  <FaLayerGroup className="text-gray-500 mr-2" />
                  <select name="department" onChange={handleChange} required defaultValue="" className="w-full focus:outline-none bg-transparent text-gray-700 font-medium">
                    <option value="" disabled>Select Department</option>
                    {departments.map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>
              </div>

              {(role === 'student' || role === 'alumni') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                    <FaIdBadge className="text-gray-500 mr-2" />
                    <input type="text" name="degree" placeholder="Degree (e.g. B.Tech)" onChange={handleChange} required className="w-full focus:outline-none" />
                  </div>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <input type="number" name="graduationYear" placeholder={role === 'student' ? "Grad Year (Expected)" : "Grad Year"} onChange={handleChange} required className="w-full focus:outline-none" />
                  </div>
                </div>
              )}

              {role === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <input type="number" name="year" value={form.year} placeholder="Current Year (1-4)" min="1" max="5" onChange={handleChange} required className="w-full focus:outline-none" />
                  </div>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                    <FaLayerGroup className="text-gray-500 mr-2" />
                    <input type="text" name="section" placeholder="Class Section" onChange={handleChange} required className="w-full focus:outline-none" />
                  </div>
                </div>
              )}

              {role === 'teacher' && (
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                  <FaChalkboardTeacher className="text-gray-500 mr-2" />
                  <input type="text" name="designation" placeholder="Designation" onChange={handleChange} required className="w-full focus:outline-none" />
                </div>
              )}

              {role === 'alumni' && (
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                  <FaBuilding className="text-gray-500 mr-2" />
                  <input type="text" name="currentCompany" placeholder="Current Company" onChange={handleChange} className="w-full focus:outline-none" />
                </div>
              )}

              <div className="border-t border-gray-200 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`flex items-center border rounded-lg px-3 py-2 shadow-sm transition-all focus-within:ring-2 ${form.phone && !validations.isPhoneValid ? "border-red-500 ring-red-100" : "focus-within:ring-blue-400"}`}>
                  <FaPhone className="text-gray-500 mr-2" />
                  <input type="text" name="phone" value={form.phone} placeholder="Phone (10 digits)" onChange={handleChange} className="w-full focus:outline-none" />
                </div>
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                  <FaLinkedin className="text-gray-500 mr-2" />
                  <input type="text" name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} className="w-full focus:outline-none" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className={`flex items-start border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 transition-all ${form.bio.length >= 500 ? "border-orange-500" : "focus-within:ring-blue-400"}`}>
                  <FaInfoCircle className="text-gray-500 mt-1 mr-2" />
                  <textarea name="bio" value={form.bio} placeholder="Short Bio / Headline" onChange={handleChange} className="w-full focus:outline-none resize-none h-20 font-medium" />
                </div>
                <span className={`text-[10px] font-bold mt-1 self-end ${form.bio.length >= 500 ? "text-red-500 font-black" : "text-gray-400"}`}>{form.bio.length} / 500</span>
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                <FaTools className="text-gray-500 mr-2" />
                <input type="text" name="skills" placeholder="Skills (comma separated)" onChange={handleChange} className="w-full focus:outline-none" />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || !validations.isValid}
            className={`w-full py-3 rounded-lg font-bold shadow-lg transform transition flex justify-center items-center gap-2 ${
              validations.isValid && !loading
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-xl" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? "Login" : `Join as ${role.charAt(0).toUpperCase() + role.slice(1)}`)}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" className="text-blue-600 font-bold hover:underline" onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

const Badge = ({ label, met }) => (
  <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-md transition-all ${met ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
    {met ? <FaCheckCircle className="mr-1" /> : <FaExclamationCircle className="mr-1" />}
    {label}
  </span>
);

export default Auth;
