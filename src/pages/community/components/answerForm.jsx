import React, { useState } from 'react';
import { Send, MessageSquare, Loader } from 'lucide-react';
import { useCommunity } from '../../../context/communityContext';

export const AnswerForm = ({ questionId, onSuccess }) => {
    const { addAnswer } = useCommunity();
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) return;
        
        setIsLoading(true);
        try {
            await addAnswer(questionId, body);
            setBody('');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to post answer:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-100/80">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <MessageSquare size={14} />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Your Answer</h4>
            </div>
            
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your structured solution, advice, or details to help out..."
                rows={4}
                className="w-full px-4 py-3 border border-indigo-50/70 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs md:text-sm transition-all duration-300 font-medium placeholder:text-slate-400 leading-relaxed resize-none"
                required
            />
            
            <div className="mt-3 flex justify-end">
              <button 
                  type="submit" 
                  disabled={isLoading || !body.trim()} 
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl px-5 py-2.5 font-bold text-xs hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isLoading ? (
                      <>
                          <Loader size={12} className="animate-spin" />
                          <span>Posting...</span>
                      </>
                  ) : (
                      <>
                          <Send size={12} />
                          <span>Post Answer</span>
                      </>
                  )}
              </button>
            </div>
        </form>
    );
};