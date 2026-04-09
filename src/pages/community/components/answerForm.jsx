import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useCommunity } from '../../../context/communityContext';

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

export const AnswerForm = ({ questionId, onSuccess }) => {
    const { addAnswer } = useCommunity(); // Get the action from context
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) return; // Don't submit empty answers
        
        setIsLoading(true);
        try {
            await addAnswer(questionId, body);
            setBody(''); // Clear the form on success
            if (onSuccess) onSuccess(); // Call optional success callback
        } catch (error) {
            console.error("Failed to post answer:", error);
            alert("Error: Could not post your answer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-md font-semibold mb-2 text-slate-700">Your Answer</h4>
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your detailed answer here..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                required
            />
            <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-[#3B82F6] text-white float-right mt-2"
            >
                {isLoading ? (
                    <>
                        <Loader size={16} className="animate-spin mr-1" /> Posting...
                    </>
                ) : (
                    <>
                        <Send size={16} className="mr-1" /> Post Answer
                    </>
                )}
            </Button>
            {/* Clear the float */}
            <div className="clear-both"></div>
        </form>
    );
};