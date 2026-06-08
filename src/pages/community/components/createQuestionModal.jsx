import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle, Tag, AlertCircle, Loader } from 'lucide-react';
import { useCommunity } from '../../../context/communityContext';

export const CreateQuestionModal = ({ isOpen, onClose }) => {
    const { createQuestion, loading: contextLoading } = useCommunity();
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');
    const [qLoading, setQLoading] = useState(false);
    const [qError, setQError] = useState(null);
    
    const loading = contextLoading || qLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) {
            setQError("Please describe your problem or question.");
            return;
        }
        setQLoading(true);
        setQError(null);
        try {
            await createQuestion({ 
                body, 
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            });
            onClose();
            setBody('');
            setTags('');
        } catch(err) {
            setQError(err.response?.data?.message || "Failed to post question.");
        } finally {
            setQLoading(false);
        }
    };
    
    return (
        <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div 
                className="bg-white/95 backdrop-blur-xl border border-indigo-50/70 rounded-3xl p-8 shadow-2xl w-full max-w-lg relative overflow-hidden group"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                onClick={e => e.stopPropagation()}
            >
                {/* Visual Top Bar Glow */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Ask a New Question</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global Forum</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    disabled={loading} 
                    className="p-1.5 rounded-full border border-slate-100 hover:border-slate-200 text-slate-400 hover:text-slate-600 transition duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Body Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Your Question</label>
                      <textarea 
                          value={body} 
                          onChange={(e) => setBody(e.target.value)} 
                          placeholder="Describe your problem, academic doubt, placement query, or idea in detail..." 
                          rows={5} 
                          className="w-full px-4 py-3 border border-indigo-50/70 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all duration-300 font-medium placeholder:text-slate-400 leading-relaxed resize-none" 
                          required 
                      />
                    </div>
                    
                    {/* Tags Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tags</label>
                        <span className="text-[10px] text-slate-400 font-semibold">Comma separated</span>
                      </div>
                      <div className="relative">
                        <input 
                            value={tags} 
                            onChange={(e) => setTags(e.target.value)} 
                            placeholder="e.g., react, node, placements, careers" 
                            className="w-full px-4 py-3 pl-10 border border-indigo-50/70 bg-slate-50/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all duration-300 font-medium placeholder:text-slate-400" 
                        />
                        <Tag size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    
                    {qError && (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{qError}</span>
                      </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-98 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                          <>
                            <Loader size={16} className="animate-spin mr-2" />
                            <span>Posting...</span>
                          </>
                        ) : 'Post Question'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};
