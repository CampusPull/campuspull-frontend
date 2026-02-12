import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api'; // Centralized Axios instance

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all feedback
    const getAllFeedbacks = async () => {
        setLoading(true);
        try {
            // Using 'api' instance instead of raw axios
            const res = await api.get('/feedback/all');
            
            // Safety check for production stability
            if (Array.isArray(res.data)) {
                setFeedbacks(res.data);
            } else {
                console.error("Expected an array but got:", typeof res.data);
                setFeedbacks([]); 
            }
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
            setFeedbacks([]); 
        } finally {
            setLoading(false);
        }
    };

    // Submit new feedback
    const addFeedback = async (message) => {
        try {
            const res = await api.post('/feedback/submit', { message });
            
            // Refresh the list so the new post appears immediately
            if (res.data.success) {
                getAllFeedbacks();
            }
            return res.data;
        } catch (err) {
            console.error("Error submitting feedback:", err);
            throw err;
        }
    };

    return (
        <FeedbackContext.Provider value={{ feedbacks, loading, getAllFeedbacks, addFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => useContext(FeedbackContext);