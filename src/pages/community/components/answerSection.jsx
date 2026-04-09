import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnswerForm } from './answerForm';
import { AnswerList } from './answerList';
import { useAuth } from '../../../context/AuthContext';

export const AnswerSection = ({ questionId, answers }) => {
    const { user } = useAuth();
    const [showAllAnswers, setShowAllAnswers] = useState(false);

    const canPostAnswer = user && ['student', 'alumni', 'admin'].includes(user.role);

    // Determine which answers to display
    const answersToShow = showAllAnswers ? answers : answers.slice(0, 2);
    const hasMoreAnswers = answers.length > 2;
    const answerCount = answers.length;

    return (
        <div className="mt-4">
            {/* --- Answer List Section --- */}
            {answerCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Answers ({answerCount})
                    </h4>
                    
                    <AnswerList 
                        questionId={questionId} 
                        answers={answersToShow} 
                    />

                    {/* --- Toggle Button --- */}
                    {hasMoreAnswers && (
                        <button
                            onClick={() => setShowAllAnswers(!showAllAnswers)}
                            className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                            {showAllAnswers ? (
                                <> <ChevronUp size={14} /> Show Less </>
                            ) : (
                                <> <ChevronDown size={14} /> Show {answers.length - 2} More Answers </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* --- Post Answer Form --- */}
            {canPostAnswer && (
                <AnswerForm 
                    questionId={questionId} 
                />
            )}
        </div>
    );
};
