import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, PlusCircle, Loader, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCommunity } from '../../context/communityContext';
import { CreateQuestionModal } from './components/createQuestionModal';
import { QuestionFeed } from './components/questionFeed';
import SignupModal from '../../components/ui/SignupModal';

const CommunityPage = () => {
    const {
        questions,
        loading,
        error,
        isGuest,           
        showAuthModal,     
        setShowAuthModal,  
    } = useCommunity();

    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const canPost = user && ['student', 'alumni', 'admin'].includes(user.role);

    const filteredQuestions = useMemo(() => {
        if (!searchTerm) return questions;
        const term = searchTerm.toLowerCase();
        return questions.filter(q =>
            (q.body && q.body.toLowerCase().includes(term)) ||
            (q.title && q.title.toLowerCase().includes(term)) ||
            (q.tags && q.tags.some(tag => tag.toLowerCase().includes(term))) ||
            (q.author?.name && q.author.name.toLowerCase().includes(term))
        );
    }, [questions, searchTerm]);

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-6xl mx-auto">
                {/* --- DISCUSSION FORUM HERO --- */}
                <section className="relative text-center py-16 md:py-20 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 overflow-hidden text-white rounded-3xl mb-10 shadow-xl border border-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)]"></div>
                    <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-500/25 mb-6 animate-pulse">
                            <MessageSquare size={12} /> Knowledge Sharing
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                            Global Discussion <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Forum</span>
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
                            Connect with ABESIT peers, request placement tips from successful alumni, and resolve technical doubts instantly.
                        </p>
                    </div>
                </section>

                {/* Guest banner */}
                {isGuest && (
                    <div className="mb-8 p-5 bg-white border border-indigo-50/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">👋</span>
                            <p className="text-slate-600 font-semibold text-xs md:text-sm text-center sm:text-left leading-relaxed">
                                You are currently browsing as a guest. Create an account to ask questions, join discussion channels, and book mentors.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="shrink-0 px-5 py-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-98 transition-all duration-200"
                        >
                            Join Now
                        </button>
                    </div>
                )}

                {/* Filters / Actions */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:max-w-xl">
                            <input
                                type="text"
                                placeholder="Search questions, answers, tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-3 pl-11 rounded-2xl border border-indigo-50/70 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-white text-xs md:text-sm transition-all duration-300 placeholder:text-slate-400 font-medium"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>

                        {canPost ? (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="w-full sm:w-auto bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md rounded-2xl px-5 py-3 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 transition-all duration-200"
                            >
                                <PlusCircle size={16} /> Ask Question
                            </button>
                        ) : isGuest ? (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="w-full sm:w-auto bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md rounded-2xl px-5 py-3 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 transition-all duration-200"
                            >
                                <PlusCircle size={16} /> Ask Question
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Discussions Feed */}
                <div className="space-y-6">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                        {searchTerm ? `Results (${filteredQuestions.length})` : "Latest Discussions"}
                    </h2>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <Loader size={28} className="animate-spin text-indigo-600" />
                        </div>
                    )}
                    
                    {error && (
                        <div className="text-center py-6 text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold">
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <QuestionFeed
                            questions={filteredQuestions}
                            searchTerm={searchTerm}
                            isGuest={isGuest}
                            onRestrictedAction={() => setShowAuthModal(true)}
                        />
                    )}
                </div>
            </div>

            {/* Create Question Modal - only for logged-in users */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateQuestionModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Signup modal for guest restricted actions */}
            {showAuthModal && (
                <SignupModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    message="Create an account to ask questions and join discussions"
                />
            )}
        </div>
    );
};

export default CommunityPage;