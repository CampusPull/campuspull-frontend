import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useCommunity } from '../../../context/communityContext';
import { useAuth } from '../../../context/AuthContext';

export const ReplyForm = ({ answerId, onSuccess }) => {
    const { user } = useAuth();
    const { createReply } = useCommunity();
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) return; // Don't submit empty replies
        
        setIsLoading(true);
        try {
            await createReply(answerId, body);
            setBody(''); // Clear form on success
            if (onSuccess) onSuccess(); // Call success callback (e.g., to hide the form)
        } catch (error) {
            console.error("Failed to post reply:", error);
            alert("Error: Could not post your reply.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-2">
            {/* User Avatar */}
            <img
                src={user?.avatar || '/default-avatar.png'}
                alt="Your avatar"
                className="w-8 h-8 rounded-full mt-1 border border-slate-200"
            />
            {/* Text Input */}
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write a reply..."
                rows={1} // Start as one line
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:ring-2 focus:ring-[#3B82F6] outline-none
                           resize-none overflow-hidden" // Auto-expands with content
                onInput={(e) => {
                    e.target.style.height = 'auto'; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
                }}
                required
            />
            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={isLoading} 
                className="h-10 px-3 py-2 bg-blue-600 text-white rounded-lg
                           flex items-center justify-center font-semibold
                           hover:bg-blue-700 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           disabled:bg-gray-400"
                title="Post Reply"
            >
                {isLoading ? (
                    <Loader size={16} className="animate-spin" />
                ) : (
                    <Send size={16} />
                )}
            </button>
        </form>
    );
};
