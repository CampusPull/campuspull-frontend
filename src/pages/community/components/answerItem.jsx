import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, User, Edit, Trash2, Loader, Send, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCommunity } from '../../../context/communityContext';
import { ReplySection } from './replySection'; // The next component

// --- Helper Functions (Embedded) ---
const formatTime = (dateString) => {
    if (!dateString) return "just now";
    const date = new Date(dateString);
    // Using a shorter time format for answers/replies
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays > 7) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (diffDays > 0) return `${diffDays}d ago`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours > 0) return `${diffHours}h ago`;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'just now';
};

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

// --- Main AnswerItem Component ---
export const AnswerItem = ({ questionId, answer }) => {
    const { user } = useAuth();
    const { toggleAnswerUpvote, deleteAnswer, updateAnswer } = useCommunity();

    const { _id, body, author, upvotes = [], replies = [], createdAt } = answer;

    // --- Internal State ---
    const [upvoting, setUpvoting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(body);
    const [editLoading, setEditLoading] = useState(false);

    // --- Computed Values ---
    const isUpvoted = user ? upvotes.includes(user._id) : false;
    const isOwner = user ? user._id === author?._id : false;
    const canModify = isOwner || user?.role === 'admin';
    const upvoteCount = upvotes.length;

    // --- Handlers ---
    const handleUpvote = async () => {
        if (!user || upvoting) return;
        setUpvoting(true);
        try {
            await toggleAnswerUpvote(_id);
        } catch (error) { console.error("Answer upvote failed:", error); }
        finally { setUpvoting(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this answer?")) return;
        setIsDeleting(true);
        try {
            await deleteAnswer(questionId, _id); // Pass both IDs to context
        } catch (error) {
            console.error("Delete answer failed:", error);
            alert("Could not delete answer.");
            setIsDeleting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editBody.trim()) return;
        setEditLoading(true);
        try {
            await updateAnswer(_id, { body: editBody });
            setIsEditing(false); // Close edit form on success
        } catch (error) {
            console.error("Update answer failed:", error);
            alert("Could not update answer.");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-3 pt-3 border-t border-slate-100"
        >
            {/* --- Edit Form (Conditional) --- */}
            {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-2 mb-2">
                    <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                    />
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            size="sm"
                            disabled={editLoading}
                            className="bg-blue-600 text-white"
                        >
                            {editLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                            Save
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-200 text-gray-700"
                        >
                            <X size={14} /> Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                // --- Display Answer Body ---
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{body}</p>
            )}

            {/* --- Answer Footer: Author, Stats, Actions --- */}
            <div className="text-xs text-slate-500 mt-2 flex justify-between items-center">
                {/* Left Side: Author & Time */}
                <div className="flex items-center gap-2">
                    <User size={12} />
                    <span className="font-semibold">{author?.name || 'User'}</span>
                    <span>&middot;</span>
                    <span>{formatTime(createdAt)}</span>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-3">
                    {canModify && !isEditing && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 hover:text-blue-600"
                                title="Edit"
                            >
                                <Edit size={12} />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-1 hover:text-red-500"
                                title="Delete"
                            >
                                {isDeleting ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleUpvote}
                        disabled={upvoting || !user}
                        className={`flex items-center gap-1 ${isUpvoted ? 'text-blue-600' : 'hover:text-blue-600'}`}
                    >
                        <ThumbsUp size={12} className={`${isUpvoted ? 'fill-current' : ''}`} />
                        <span className="font-semibold">{upvoteCount}</span>
                    </button>
                </div>
            </div>

            {/* --- Nested Reply Section --- */}
            <ReplySection 
                answerId={_id}
                replies={replies}
            />
        </motion.div>
    );
};
