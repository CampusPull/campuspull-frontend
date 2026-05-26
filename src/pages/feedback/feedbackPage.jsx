import React, { useEffect, useState } from 'react';
import { useFeedback } from '../../context/feedbackContext';
import { useAuth } from '../../context/AuthContext'; 
import Icon from '../../components/AppIcon';

const FeedbackPage = () => {
    const { feedbacks, loading, getAllFeedbacks, addFeedback } = useFeedback();
    const { user } = useAuth(); 
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // --- Hardcoded Mock Data for Demo ---
    const mockFeedbacks = [
        {
            _id: 'm1',
            message: "Building CampusPull was about more than just code; it was about creating a bridge for every student at ABESIT to reach their potential. Knowledge should have no boundaries. Keep grinding, the hustle pays off!",
            userId: { name: "Satyam", branch: "DS", currentCompany: "CampusPull (Founder)" }
        },
        {
            _id: 'm2',
            message: "The technical workshops and faculty support were vital. Contevolve looks for strong logic, and college gave me the platform to sharpen mine. CampusPull is the perfect way to give back!",
            userId: { name: "Riya Sharma", branch: "DS", currentCompany: "Contevolve" }
        },
        {
            _id: 'm3',
            message: "Getting into Antino required a deep dive into the MERN stack. Grateful to my mentors for the guidance. Juniors, stay focused on your projects!",
            userId: { name: "Prithvee Ojha", branch: "DS", currentCompany: "Antino" }
        },
        {
            _id: 'm4',
            message: "The mock interviews at college gave me the confidence to crack Erasmith. It's great to have a portal where we can now guide the next batch directly.",
            userId: { name: "Aashiya Rana", branch: "DS", currentCompany: "Erasmith" }
        },
        {
            _id: 'm5',
            message: "Adlertech values problem-solving. My journey was made smoother by the constant encouragement from our HOD. Keep pushing your limits!",
            userId: { name: "Parkhi", branch: "DS", currentCompany: "Adlertech" }
        },
        {
            _id: 'm6',
            message: "The competitive environment at college pushed me to be more hardworking. Black Orange is a great start, and I'll be sharing resources here soon!",
            userId: { name: "Samyak Vansh", branch: "CSE", currentCompany: "Black Orange" }
        }
    ];

    useEffect(() => {
        getAllFeedbacks();
    }, []);

    const canPost = user?.role?.toLowerCase() === 'alumni' && user?.currentCompany;

    // Combine API data with Mock data for a full-looking list
    const displayFeedbacks = [...feedbacks, ...mockFeedbacks];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setIsSubmitting(true);
        try {
            await addFeedback(message);
            setMessage(""); 
            setShowForm(false);
            alert("Feedback posted!");
        } catch (err) {
            alert("Error posting feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
       <div className="relative min-h-screen bg-slate-50/60 p-6 md:p-12 pb-24">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-3">
                        Alumni Success Stories 🚀
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                        Voices of CampusPull graduates sharing guidance, placement journeys, and shaping the future.
                    </p>
                </header>

                {loading && feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 space-y-4">
                        <div className="flex space-x-2.5">
                            <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3.5 h-3.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
                            Gathering success stories...
                        </p>
                    </div>
                ) : displayFeedbacks.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-indigo-50 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
                        <span className="text-5xl block mb-4">🏆</span>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Stories Posted Yet</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Our successful alumni will be sharing their placement journeys and guidance soon. Check back shortly!
                        </p>
                    </div>
                ) : (
                    /* GRID WRAPPER START */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayFeedbacks.map((item) => (
                            <div 
                                key={item._id} 
                                className="bg-white border border-indigo-50/70 rounded-3xl p-6 hover:shadow-[0_20px_50px_rgba(99,102,241,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[240px]"
                            >
                                {/* Glowing border line on hover */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div>
                                    <div className="flex items-center mb-5">
                                        <div className="h-11 w-11 bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center text-lg font-extrabold text-white mr-3.5 shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-300">
                                            {item.userId?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                                                {item.userId?.name}
                                            </h3>
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-inter">
                                                {item.userId?.branch} • {item.userId?.currentCompany}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute -top-6 -left-3 text-6xl text-slate-100 font-serif z-0 select-none group-hover:text-indigo-50/30 transition-colors">“</span>
                                        <p className="text-slate-600 text-sm leading-relaxed italic relative z-10 pl-2">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold tracking-wider uppercase text-slate-400 font-inter">
                                    <span>Verified Alumni</span>
                                    <span className="text-indigo-400 group-hover:text-indigo-500">Success Network</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    /* GRID WRAPPER END */
                )}
            </div>

            {/* Floating Form Button for Eligible Alumni */}
            {canPost && (
                <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
                    {showForm && (
                        <div className="mb-4 w-80 sm:w-96 bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-indigo-50 animate-in slide-in-from-bottom-6 transition-all duration-300">
                            <h3 className="font-extrabold mb-3 text-slate-800 text-lg flex items-center gap-1.5">
                                Share Your Placement Journey 🎓
                            </h3>
                            <textarea 
                                className="w-full p-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl mb-4 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:border-indigo-400 outline-none transition-all leading-relaxed"
                                rows="5"
                                placeholder="Share key tips, interview steps, resources, or guidance for juniors..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-200/50 transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm"
                            >
                                {isSubmitting ? "Sharing..." : "Share Success Story"}
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`p-4 rounded-full shadow-2xl hover:shadow-indigo-500/20 text-white transition-all transform hover:scale-110 active:scale-95 ${
                            showForm 
                            ? 'bg-red-500 hover:bg-red-600 rotate-45 shadow-red-200' 
                            : 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-200/50'
                        }`}
                    >
                        <Icon name={showForm ? "X" : "Plus"} size={26} color="white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeedbackPage;