import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnswerForm } from './answerForm';
import { AnswerList } from './answerList';
import { useAuth } from '../../../context/AuthContext';

export const AnswerSection = ({ questionId, answers, isGuest, onRestrictedAction }) => {
    const { user } = useAuth();
    const [showAllAnswers, setShowAllAnswers] = useState(false);

    const canPostAnswer = user && ['student', 'alumni', 'admin'].includes(user.role);

    const answersToShow = showAllAnswers ? answers : answers.slice(0, 2);
    const hasMoreAnswers = answers.length > 2;
    const answerCount = answers.length;

    return (
        <div className="mt-4">

            {/* Answer List */}
            {answerCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Answers ({answerCount})
                    </h4>

                    {/* FIX: pass guest props to AnswerList */}
                    <AnswerList
                        questionId={questionId}
                        answers={answersToShow}
                        isGuest={isGuest}
                        onRestrictedAction={onRestrictedAction}
                    />

                    {hasMoreAnswers && (
                        <button
                            onClick={() => setShowAllAnswers(!showAllAnswers)}
                            className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                            {showAllAnswers ? (
                                <><ChevronUp size={14} /> Show Less</>
                            ) : (
                                <><ChevronDown size={14} /> Show {answers.length - 2} More Answers</>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* FIX: guests see a prompt instead of the answer form */}
            {isGuest ? (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <button
                        onClick={onRestrictedAction}
                        className="w-full py-2.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-medium"
                    >
                        + Login to post an answer
                    </button>
                </div>
            ) : canPostAnswer ? (
                <AnswerForm questionId={questionId} />
            ) : null}
        </div>
    );
};