import React from 'react';
import { AnswerItem } from './answerItem';

export const AnswerList = ({ questionId, answers }) => {
    return (
        <div className="space-y-3">
            {answers.map((answer) => (
                <AnswerItem 
                    key={answer._id} 
                    questionId={questionId} 
                    answer={answer} 
                />
            ))}
        </div>
    );
};
