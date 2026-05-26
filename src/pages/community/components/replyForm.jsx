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
        if (!body.trim()) return;
        
        setIsLoading(true);
        try {
            await createReply(answerId, body);
            setBody('');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to post reply:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fallback initials
    const initials = user?.name ? user.name.split(" ").map(p => p[0]).join("").substring(0, 2).toUpperCase() : "CP";

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-3 mt-4 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full border border-indigo-100 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
              {user?.profileImage ? (
                <img
                    src={user.profileImage}
                    alt={user.name || "Your avatar"}
                    className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-[10px]">
                  {initials}
                </div>
              )}
            </div>

            {/* Text Input */}
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write a quick reply..."
                rows={1}
                className="flex-1 px-3.5 py-2 border border-indigo-50/50 bg-white rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none overflow-hidden font-medium placeholder:text-slate-400 leading-relaxed"
                onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                required
            />

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={isLoading || !body.trim()} 
                className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-sm"
                title="Post Reply"
            >
                {isLoading ? (
                    <Loader size={12} className="animate-spin" />
                ) : (
                    <Send size={12} />
                )}
            </button>
        </form>
    );
};
