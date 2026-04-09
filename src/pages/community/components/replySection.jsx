import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ReplyList } from './replyList';
import { ReplyForm } from './replyForm';

export const ReplySection = ({ answerId, replies = [] }) => {
    const { user } = useAuth();
    const canReply = user && ['student', 'alumni', 'admin'].includes(user.role);

    // --- Internal State ---
    const [showReplyForm, setShowReplyForm] = useState(false);
    // Start with replies collapsed if there are more than 1
    const [areRepliesVisible, setAreRepliesVisible] = useState(replies.length > 0 && replies.length <= 1);

    const replyCount = replies.length;

    const toggleReplyForm = (e) => {
        e.stopPropagation();
        setShowReplyForm(!showReplyForm);
    };

    const toggleRepliesVisibility = (e) => {
        e.stopPropagation();
        setAreRepliesVisible(!areRepliesVisible);
    };

    return (
        <div className="mt-3 pl-4 border-l-2 border-slate-100">
            {/* --- Reply Action Bar --- */}
            <div className="flex items-center gap-4">
                {canReply && (
                    <button
                        onClick={toggleReplyForm}
                        className={`text-xs font-semibold ${showReplyForm ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </button>
                )}

                {replyCount > 0 && (
                    <button
                        onClick={toggleRepliesVisibility}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                        {areRepliesVisible ? (
                            <ChevronUp size={14} />
                        ) : (
                            <ChevronDown size={14} />
                        )}
                        {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
                    </button>
                )}
            </div>

            {/* --- Reply Form (Conditional) --- */}
            {canReply && showReplyForm && (
                <div className="mt-2">
                    <ReplyForm 
                        answerId={answerId} 
                        onSuccess={() => {
                            setShowReplyForm(false); // Hide form on success
                            setAreRepliesVisible(true); // Show replies
                        }} 
                    />
                </div>
            )}

            {/* --- Reply List (Conditional) --- */}
            {areRepliesVisible && replyCount > 0 && (
                <div className="mt-3">
                    <ReplyList replies={replies} />
                </div>
            )}
        </div>
    );
};
