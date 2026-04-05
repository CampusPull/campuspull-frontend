import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, PlusCircle, X, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCommunity } from '../../context/communityContext';
import { CreateQuestionModal } from './components/createQuestionModal';
import { QuestionFeed } from './components/questionFeed';
import SignupModal from '../../components/ui/SignupModal';

// Button Component
const Button = ({ children, onClick, disabled, className, type = 'button', size = 'md' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`transition-all duration-200 inline-flex items-center justify-center font-semibold rounded-lg ${className || ''}
                    ${size === 'md' ? 'px-4 py-2 text-sm' : size === 'sm' ? 'px-3 py-1.5 text-xs' : 'p-2 text-xs'} ${disabled ? 'bg-slate-300 cursor-not-allowed' : 'hover:opacity-90'}`}
    >
        {children}
    </button>
);

const CommunityPage = () => {
    const {
        questions,
        loading,
        error,
        isGuest,           // FIX: from communityContext
        showAuthModal,     // FIX: from communityContext
        setShowAuthModal,  // FIX: from communityContext
    } = useCommunity();

    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    // FIX: guests cannot post — only logged-in students/alumni/admin can
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
        <div className="min-h-screen bg-[#F3F4FD] text-[#1E293B] py-10 px-6 pt-16">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-extrabold text-[#3B82F6]">🎓 Global Discussion Forum</h1>
                <p className="text-[#475569] mt-2 text-lg">Ask questions, get help, and share knowledge.</p>
            </div>

            {/* FIX: Guest banner */}
            {isGuest && (
                <div className="w-full md:w-4/5 mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
                    <p className="text-blue-700 font-medium text-sm">
                        👋 You're browsing as a guest. Create an account to ask questions and join discussions.
                    </p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                        Join Now
                    </button>
                </div>
            )}

            <div className="sticky top-16 z-30 bg-[#F3F4FD] py-4 mb-8">
                <div className="w-full md:w-4/5 mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:max-w-xl">
                            <input
                                type="text"
                                placeholder="🔍 Search questions, answers, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-3 pl-10 rounded-full border border-[#CBD5E1] shadow-sm focus:ring-2 focus:ring-[#6366F1] focus:outline-none bg-white"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        {/* FIX: guests see "Ask Question" but it triggers modal instead */}
                        {canPost ? (
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="w-auto bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md rounded-xl flex items-center"
                            >
                                <PlusCircle size={18} className="mr-1" /> Ask Question
                            </Button>
                        ) : isGuest ? (
                            <Button
                                onClick={() => setShowAuthModal(true)}
                                className="w-auto bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md rounded-xl flex items-center"
                            >
                                <PlusCircle size={18} className="mr-1" /> Ask Question
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="w-full md:w-4/5 mx-auto space-y-8">
                <h2 className="text-2xl font-semibold text-[#3B82F6]">
                    {searchTerm ? `Results (${filteredQuestions.length})` : "Latest Discussions"}
                </h2>

                {loading && (
                    <div className="flex justify-center py-10">
                        <Loader size={32} className="animate-spin text-blue-500" />
                    </div>
                )}
                {error && <p className="text-center text-red-600">Error: {error}</p>}

                {!loading && !error && (
                    <QuestionFeed
                        questions={filteredQuestions}
                        searchTerm={searchTerm}
                        isGuest={isGuest}
                        onRestrictedAction={() => setShowAuthModal(true)}
                    />
                )}
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

            {/* FIX: Signup modal for guest restricted actions */}
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