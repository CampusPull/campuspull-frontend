import React from 'react';
import { ReplyItem } from './replyItem';

export const ReplyList = ({ replies = [] }) => {
    return (
        <div className="space-y-3">
            {replies.map((reply) => (
                <ReplyItem 
                    key={reply._id} 
                    reply={reply} 
                />
            ))}
        </div>
    );
};
