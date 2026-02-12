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
       <div className="relative min-h-screen bg-slate-50 p-6 pb-20">
            <div className="max-w-6xl mx-auto"> {/* Increased max-width for the grid */}
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-800">Alumni Success Stories</h1>
                    <p className="text-slate-500 mt-2 italic">Voices of CampusPull graduates making an impact</p>
                </header>

                {loading && feedbacks.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    /* GRID WRAPPER START */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayFeedbacks.map((item) => (
                            <div 
                                key={item._id} 
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4 shadow-md">
                                            {item.userId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{item.userId?.name}</h3>
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                                {item.userId?.branch} • {item.userId?.currentCompany}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute -top-4 -left-2 text-5xl text-slate-100 font-serif z-0">“</span>
                                        <p className="text-slate-700 leading-relaxed italic relative z-10 pl-2">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
                                    Verified Alumni • CampusPull Success Network
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
                        <div className="mb-4 w-80 bg-white p-6 rounded-2xl shadow-2xl border border-blue-100 animate-in slide-in-from-bottom-5">
                            <h3 className="font-bold mb-3 text-slate-800">Share your journey</h3>
                            <textarea 
                                className="w-full p-3 bg-slate-50 border rounded-xl mb-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                rows="4"
                                placeholder="Tips for juniors..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button 
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                            >
                                {isSubmitting ? "Posting..." : "Post Feedback"}
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-110 ${showForm ? 'bg-red-500 rotate-45' : 'bg-blue-600'}`}
                    >
                        <Icon name={showForm ? "X" : "Plus"} size={28} color="white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeedbackPage;