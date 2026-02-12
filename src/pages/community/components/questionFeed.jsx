import React from 'react';
import { Users } from 'lucide-react';
import { QuestionCard } from './questionCard';

export const QuestionFeed = ({ questions, searchTerm }) => {
    
    // Check if there are no questions
    if (!questions || questions.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-slate-100">
                <Users size={48} className="mx-auto mb-4 text-[#CBD5E1]" />
                <p className="text-lg font-medium">No questions found.</p>
                <p className="text-sm text-[#64748B] mt-1">
                    {searchTerm 
                        ? "Try a different search term." 
                        : "Be the first to start a discussion!"
                    }
                </p>
            </div>
        );
    }

    // If there are questions, render the list
    return (
        <div className="space-y-6">
            {questions.map((question) => (
                <QuestionCard 
                    key={question._id} 
                    question={question} 
                />
            ))}
        </div>
    );
};
