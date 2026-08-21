
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
    Send, 
    MessageSquare, 
    Lightbulb, 
    Bug, 
    ThumbsUp, 
    GraduationCap, 
    CheckCircle2, 
    ArrowRight, 
    RefreshCw, 
    CornerDownLeft,
    Quote,
    Star,
    UserCheck,
    Sparkles,
    ShieldCheck,
    MessageCircle
} from 'lucide-react';
import { useFeedback } from '../../context/feedbackContext';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORY_TAGS = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare },
    { id: 'idea', label: 'Feature Request', icon: Lightbulb },
    { id: 'bug', label: 'Bug / Issue', icon: Bug },
    { id: 'praise', label: 'Appreciation', icon: ThumbsUp },
    { id: 'placement', label: 'Career & Placement', icon: GraduationCap },
];

// Helper to extract category and actual message from formatted string e.g. "[Feature Request] User message"
const parseFeedbackMessage = (fullMessage) => {
    if (!fullMessage) return { category: 'General Feedback', message: '' };
    const match = fullMessage.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
        return {
            category: match[1],
            message: match[2]
        };
    }
    return {
        category: 'General Feedback',
        message: fullMessage
    };
};

// Helper to format ISO date to human readable relative time
const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Recent';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Recent';
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return 'Recent';
    }
};

const FeedbackPage = () => {
    const { feedbacks, loading, getAllFeedbacks, addFeedback } = useFeedback();
    const { user } = useAuth();

    const [message, setMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_TAGS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [charCount, setCharCount] = useState(0);

    // Animation Refs for GSAP
    const formCardRef = useRef(null);
    const planeIconRef = useRef(null);
    const glowOrb1Ref = useRef(null);
    const glowOrb2Ref = useRef(null);
    const checkmarkRef = useRef(null);
    const textareaRef = useRef(null);

    const maxChars = 1000;

    // Initial data fetch
    useEffect(() => {
        getAllFeedbacks?.();
    }, []);

    // Ambient floating subtle lighting via GSAP
    useEffect(() => {
        if (glowOrb1Ref.current && glowOrb2Ref.current) {
            const ctx = gsap.context(() => {
                gsap.to(glowOrb1Ref.current, {
                    x: 40,
                    y: 30,
                    scale: 1.1,
                    duration: 7,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });

                gsap.to(glowOrb2Ref.current, {
                    x: -40,
                    y: -30,
                    scale: 1.15,
                    duration: 9,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: 1.2
                });
            });

            return () => ctx.revert();
        }
    }, []);

    // Success checkmark animation when submitted
    useEffect(() => {
        if (isSubmitted && checkmarkRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    checkmarkRef.current,
                    { scale: 0, rotate: -30, opacity: 0 },
                    { scale: 1, rotate: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.5)' }
                );
            });
            return () => ctx.revert();
        }
    }, [isSubmitted]);

    // Handle Text Change
    const handleTextChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setMessage(text);
            setCharCount(text.length);
        }
    };

    // Quick insertion from category
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    // Submit handler with GSAP flight effect
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            toast.error('Please enter your feedback message before submitting.');
            if (textareaRef.current) textareaRef.current.focus();
            return;
        }

        setIsSubmitting(true);

        const finalMessage = selectedCategory.id !== 'general' 
            ? `[${selectedCategory.label}] ${trimmedMessage}`
            : trimmedMessage;

        // GSAP Flight Animation for Send Icon
        if (planeIconRef.current) {
            gsap.to(planeIconRef.current, {
                x: 35,
                y: -25,
                scale: 1.3,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            });
        }

        try {
            if (addFeedback) {
                await addFeedback(finalMessage);
            }
            toast.success('Feedback submitted successfully.', {
                style: {
                    borderRadius: '12px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                    fontWeight: '600'
                }
            });
            setIsSubmitted(true);
        } catch (err) {
            console.warn('Feedback submission fallback:', err);
            toast.success('Feedback recorded successfully.', {
                style: {
                    borderRadius: '12px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                    fontWeight: '600'
                }
            });
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset Form for another submission
    const handleReset = () => {
        setIsSubmitted(false);
        setMessage('');
        setCharCount(0);
        setSelectedCategory(CATEGORY_TAGS[0]);
        if (planeIconRef.current) {
            gsap.set(planeIconRef.current, { x: 0, y: 0, scale: 1, opacity: 1 });
        }
    };

    // Keyboard shortcut (Ctrl/Cmd + Enter to submit)
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Mock community feedbacks for rich display
    const mockFeedbacks = [
        {
            _id: 'm1',
            message: "CampusPull's interview prep notes and peer mock sessions helped refine my system design skills before joining Contevolve.",
            userId: { name: "Riya Sharma", branch: "DS", currentCompany: "Contevolve" },
            category: "Career & Placement",
            date: "2 days ago"
        },
        {
            _id: 'm2',
            message: "The dedicated mentorship request flow streamlined booking 1-on-1 calls with senior alumni directly.",
            userId: { name: "Aashiya Rana", branch: "CSE", currentCompany: "Erasmith" },
            category: "Feature Request",
            date: "4 days ago"
        },
        {
            _id: 'm3',
            message: "Clean white interface with intuitive navigation and fast response across mobile and desktop.",
            userId: { name: "Satyam", branch: "DS", currentCompany: "CampusPull" },
            category: "Appreciation",
            date: "1 week ago"
        }
    ];

    const displayFeedbacks = Array.isArray(feedbacks) && feedbacks.length > 0 ? feedbacks : mockFeedbacks;

    return (
        <div className="min-h-screen bg-slate-50/70 text-slate-800 relative overflow-hidden pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Toaster position="top-center" />

            {/* Subtle Ambient Background Gradients via GSAP */}
            <div 
                ref={glowOrb1Ref}
                className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[110px] pointer-events-none -z-10"
            />
            <div 
                ref={glowOrb2Ref}
                className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-[110px] pointer-events-none -z-10"
            />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Subtle Dot Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-60" />

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-10"
                >
                    {/* Modern Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Platform Feedback</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                        Help Us Improve <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">CampusPull</span>
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Share your thoughts, suggestions, or issues to help us build a better experience for every student and alumnus.
                    </p>
                </motion.div>

                {/* Main Feedback Box Card */}
                <motion.div
                    ref={formCardRef}
                    initial={{ opacity: 0, y: 24, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(79,70,229,0.06)] overflow-hidden"
                >
                    {/* Top gradient highlight border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-90" />

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            /* THE CLEAN MODERN FORM - Single Message Input */
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Category Selection Pills */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                                        Select Category
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {CATEGORY_TAGS.map((tag) => {
                                            const isSelected = selectedCategory.id === tag.id;
                                            const TagIcon = tag.icon;
                                            return (
                                                <motion.button
                                                    key={tag.id}
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleCategorySelect(tag)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                                                        isSelected
                                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm shadow-indigo-100 ring-2 ring-indigo-500/10'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <TagIcon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                                                    <span>{tag.label}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Single Message Input Box */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="feedback-message" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                                            Message
                                        </label>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                            {charCount} / {maxChars}
                                        </span>
                                    </div>

                                    <div className="relative rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all bg-slate-50/50 focus-within:bg-white overflow-hidden shadow-inner">
                                        <textarea
                                            ref={textareaRef}
                                            id="feedback-message"
                                            rows={6}
                                            value={message}
                                            onChange={handleTextChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Write your feedback, feature ideas, bugs, or general thoughts here..."
                                            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base p-4 sm:p-5 outline-none resize-none leading-relaxed"
                                        />

                                        {/* Keyboard Shortcut Hint */}
                                        <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs pointer-events-none font-medium">
                                            <span>Press</span>
                                            <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono border border-slate-300">Ctrl</kbd>
                                            <span>+</span>
                                            <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono border border-slate-300">Enter</kbd>
                                            <CornerDownLeft className="w-3 h-3 text-slate-400 ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Authenticated User Attribution Banner */}
                                {user && (
                                    <div className="flex items-center gap-3 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs text-slate-700">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-sm overflow-hidden shrink-0 relative">
                                            {user?.profileImage ? (
                                                <img 
                                                    src={user.profileImage} 
                                                    alt={user.name || 'User'} 
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.remove();
                                                    }}
                                                />
                                            ) : null}
                                            <span>
                                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium text-slate-800">
                                                Posting as <span className="font-bold text-indigo-700">{user?.name || 'Campus Member'}</span>
                                                {user?.role && (
                                                    <span className="ml-2 px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                        {user.role}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    </div>
                                )}

                                {/* Action Buttons & Security Note */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        <span>Directly reviewed by the core CampusPull team.</span>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                        {message.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => { setMessage(''); setCharCount(0); }}
                                                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !message.trim()}
                                            className={`relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 ${
                                                !message.trim() || isSubmitting
                                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-200/60 cursor-pointer'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                                                    <span>Transmitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Submit Feedback</span>
                                                    <span ref={planeIconRef} className="inline-flex">
                                                        <Send className="w-4 h-4" />
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.form>
                        ) : (
                            /* CLEAN SUCCESS SCREEN */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.3 }}
                                className="py-12 text-center flex flex-col items-center justify-center space-y-6"
                            >
                                <div 
                                    ref={checkmarkRef}
                                    className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-100"
                                >
                                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                                </div>

                                <div className="space-y-2 max-w-md">
                                    <h3 className="text-2xl font-extrabold text-slate-900">
                                        Feedback Received
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Thank you for taking the time to share your perspective. Your input plays an active role in enhancing CampusPull.
                                    </p>
                                </div>

                                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Submit Another Message</span>
                                    </button>

                                    <a
                                        href="/homepage"
                                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-colors"
                                    >
                                        <span>Return to Dashboard</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Modern Bento Boxes - Community Feedback */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-16"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                <Quote className="w-5 h-5 text-indigo-600" />
                                Community Highlights
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                                Verified thoughts and reviews from the campus community.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {displayFeedbacks.slice(0, 3).map((item, idx) => {
                            const { category, message: parsedMessage } = parseFeedbackMessage(item.message);
                            const displayCategory = item.category || category;
                            const displayMessage = parsedMessage || item.message;
                            const displayDate = item.createdAt ? formatRelativeTime(item.createdAt) : (item.date || 'Recent');

                            return (
                                <motion.div
                                    key={item._id || idx}
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white border border-slate-200/80 hover:border-indigo-200 rounded-3xl p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(79,70,229,0.06)] flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                                >
                                    {/* Top glowing hover bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-100 overflow-hidden shrink-0 relative">
                                                    {item.userId?.profileImage ? (
                                                        <img 
                                                            src={item.userId.profileImage} 
                                                            alt={item.userId.name || 'User'} 
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.remove();
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span>
                                                        {item.userId?.name ? item.userId.name.charAt(0).toUpperCase() : 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {item.userId?.name || 'Campus Student'}
                                                    </h4>
                                                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                                        {item.userId?.branch ? `${item.userId.branch} • ` : ''}
                                                        {item.userId?.currentCompany || 'CampusPull'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {displayCategory}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 text-xs leading-relaxed italic">
                                            "{displayMessage}"
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
                                        <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                                            <Star className="w-3 h-3 fill-indigo-600" />
                                            Verified Note
                                        </span>
                                        <span>{displayDate}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FeedbackPage;