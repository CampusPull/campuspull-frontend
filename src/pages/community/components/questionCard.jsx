import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Tag, Clock, User, Edit, Trash2, Loader } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCommunity } from '../../../context/communityContext';
import { AnswerSection } from './answerSection';

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

const formatTime = (dateString) => {
    if (!dateString) return "just now";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// FIX: accept isGuest and onRestrictedAction from QuestionFeed
export const QuestionCard = ({ question, isGuest, onRestrictedAction }) => {
    const { user } = useAuth();
    const { toggleQuestionUpvote, deleteQuestion } = useCommunity();

    const { _id, body, author, tags = [], upvotes = [], answers = [], createdAt } = question;

    const [upvoting, setUpvoting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isUpvoted = user ? upvotes.includes(user._id) : false;
    const isOwner = user ? user._id === author?._id : false;
    const canModify = isOwner || user?.role === 'admin';
    const displayUpvoteCount = upvotes.length;
    const answerCount = answers.length;

    const handleUpvote = async (e) => {
        e.stopPropagation();
        // FIX: guest clicks like → open modal
        if (isGuest) {
            onRestrictedAction?.();
            return;
        }
        if (upvoting) return;
        setUpvoting(true);
        try {
            await toggleQuestionUpvote(_id);
        } catch (error) {
            console.error("Upvote failed:", error);
        } finally {
            setUpvoting(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this question? This will also delete all its answers.")) return;
        setIsDeleting(true);
        try {
            await deleteQuestion(_id);
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete the question.");
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-100"
        >
            {/* Card Header */}
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4 min-w-0">
                    <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap break-words">
                        {body}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1 bg-[#E0E7FF] text-[#3B82F6] text-xs px-2 py-0.5 rounded-full font-medium">
                                <Tag size={12} /> {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Side: Upvote + Answer count */}
                <div className="flex flex-col items-center flex-shrink-0 space-y-2">
                    <Button
                        size="md"
                        onClick={handleUpvote}
                        // FIX: guests can click (triggers modal), logged-in blocked only during upvoting
                        disabled={!isGuest && upvoting}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors w-16 ${
                            isUpvoted ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {upvoting ? <Loader size={16} className="animate-spin" /> : <ThumbsUp size={16} />}
                        <span className="text-xs font-semibold mt-1">{displayUpvoteCount}</span>
                    </Button>
                    <div className="flex flex-col items-center text-sm text-slate-500 w-16">
                        <MessageSquare size={16} />
                        <span className="text-xs font-semibold">{answerCount}</span>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatTime(createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <User size={14} />
                        <span>{author?.name || 'Anonymous'}</span>
                    </div>
                </div>
                {/* FIX: canModify is always false for guests so edit/delete never shows */}
                {canModify && (
                    <div className="flex items-center space-x-1">
                        <Button size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 p-1" title="Edit">
                            <Edit size={16} />
                        </Button>
                        <Button
                            size="sm"
                            className="text-red-500 hover:bg-red-50 p-1"
                            title="Delete"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </Button>
                    </div>
                )}
            </div>

            {/* Answer Section — pass guest props down */}
            <AnswerSection
                questionId={_id}
                answers={answers}
                isGuest={isGuest}                       // FIX: pass down
                onRestrictedAction={onRestrictedAction} // FIX: pass down
            />
        </motion.div>
    );
};