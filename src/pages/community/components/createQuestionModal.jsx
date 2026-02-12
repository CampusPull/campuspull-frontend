import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader } from 'lucide-react';
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

export const CreateQuestionModal = ({ isOpen, onClose }) => {
    const { createQuestion, loading: contextLoading } = useCommunity();
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');
    const [qLoading, setQLoading] = useState(false); // Internal loading state
    const [qError, setQError] = useState(null);
    
    const loading = contextLoading || qLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) {
            setQError("A title is required.");
            return;
        }
        setQLoading(true);
        setQError(null);
        try {
            await createQuestion({ 
                body, 
                // Split tags by comma, trim whitespace, and filter out empty strings
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            });
            onClose(); // Close modal on success
            // Clear form
            setBody('');
            setTags('');
        } catch(err) {
            setQError(err.response?.data?.message || "Failed to post question.");
        } finally {
            setQLoading(false);
        }
    };
    
    // This component doesn't render if isOpen is false (handled by AnimatePresence in parent)
    
    return (
        <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Close on overlay click
        >
            <motion.div 
                className="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg border-t-4 border-[#3B82F6]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#3B82F6]">Ask a New Question</h3>
                    <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600">
                        <X />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Body Input */}
                    <textarea 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} 
                        placeholder="Describe your problem or question in detail..." 
                        rows={5} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none" 
                        required 
                    />
                    
                    {/* Tags Input */}
                    <input 
                        value={tags} 
                        onChange={(e) => setTags(e.target.value)} 
                        placeholder="Tags (e.g., react, node, placements)" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none" 
                    />
                    
                    {qError && <p className="text-red-500 text-sm">{qError}</p>}
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader size={16} className="animate-spin mr-2" /> Posting...
                            </span>
                        ) : 'Post Question'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};
