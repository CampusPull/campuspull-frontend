import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import api from '../utils/api'; // Your API utility
import { useAuth } from './AuthContext'; // Your AuthContext

export const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
    const { user, accessToken } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthHeaders = useCallback(() => ({
        headers: { Authorization: `Bearer ${accessToken}` },
    }), [accessToken]);

    // --- Initial Data Load ---
    const fetchQuestions = useCallback(async () => {
        if (!accessToken) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/community/questions', getAuthHeaders());
            // Ensure answers and replies are sorted correctly
            const sortedQuestions = res.data.map(q => ({
                ...q,
                answers: (q.answers || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            }));
            setQuestions(sortedQuestions);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load feed.');
            console.error("Fetch Questions Error:", err);
        } finally {
            setLoading(false);
        }
    }, [accessToken, getAuthHeaders]);

    // Initial fetch on token change
    useEffect(() => {
        if (accessToken) {
            fetchQuestions();
        }
    }, [accessToken, fetchQuestions]);

    // =============================================================
    // --- ❓ QUESTION CRUD ---
    // =============================================================

    const createQuestion = useCallback(async (data) => {
        // data = { title, body, tags }
        const res = await api.post('/community/questions', data, getAuthHeaders());
        setQuestions(prev => [res.data, ...prev]); // Add new question to top
        return res.data;
    }, [getAuthHeaders]);

    const updateQuestion = useCallback(async (questionId, data) => {
        // data = { title, body }
        const res = await api.put(`/community/questions/${questionId}`, data, getAuthHeaders());
        setQuestions(prev => prev.map(q => q._id === questionId ? res.data : q));
        return res.data;
    }, [getAuthHeaders]);

    const deleteQuestion = useCallback(async (questionId) => {
        await api.delete(`/community/questions/${questionId}`, getAuthHeaders());
        setQuestions(prev => prev.filter(q => q._id !== questionId));
    }, [getAuthHeaders]);

    const toggleQuestionUpvote = useCallback(async (questionId) => {
        const userId = user._id;
        // Optimistic Update
        setQuestions(prev => prev.map(q => {
            if (q._id === questionId) {
                const isUpvoted = q.upvotes.includes(userId);
                const newUpvotes = isUpvoted
                    ? q.upvotes.filter(id => id !== userId)
                    : [...q.upvotes, userId];
                return { ...q, upvotes: newUpvotes };
            }
            return q;
        }));
        // API Call
        try {
            await api.post(`/community/questions/${questionId}/upvote`, {}, getAuthHeaders());
        } catch (err) {
            console.error("Toggle Question Upvote failed:", err);
            // Rollback on error
            fetchQuestions();
        }
    }, [getAuthHeaders, user?._id, fetchQuestions]);

    // =============================================================
    // --- 💬 ANSWER CRUD ---
    // =============================================================

    const addAnswer = useCallback(async (questionId, body) => {
        const res = await api.post(`/community/questions/${questionId}/answers`, { body }, getAuthHeaders());
        setQuestions(prev => prev.map(q => {
            if (q._id === questionId) {
                // Add new answer to top of its list
                return { ...q, answers: [res.data, ...q.answers] };
            }
            return q;
        }));
        return res.data;
    }, [getAuthHeaders]);

    const updateAnswer = useCallback(async (answerId, body) => {
        const res = await api.put(`/community/answers/${answerId}`, { body }, getAuthHeaders());
        const updatedAnswer = res.data;
        setQuestions(prev => prev.map(q => ({
            ...q,
            answers: q.answers.map(a => a._id === answerId ? updatedAnswer : a)
        })));
        return updatedAnswer;
    }, [getAuthHeaders]);

    const deleteAnswer = useCallback(async (questionId, answerId) => {
        await api.delete(`/community/answers/${answerId}`, getAuthHeaders());
        setQuestions(prev => prev.map(q => {
            if (q._id === questionId) {
                return { ...q, answers: q.answers.filter(a => a._id !== answerId) };
            }
            return q;
        }));
    }, [getAuthHeaders]);

    const toggleAnswerUpvote = useCallback(async (answerId) => {
        const userId = user._id;
        // Optimistic Update
        setQuestions(prev => prev.map(q => ({
            ...q,
            answers: q.answers.map(a => {
                if (a._id === answerId) {
                    const isUpvoted = a.upvotes.includes(userId);
                    const newUpvotes = isUpvoted
                        ? a.upvotes.filter(id => id !== userId)
                        : [...a.upvotes, userId];
                    return { ...a, upvotes: newUpvotes };
                }
                return a;
            })
        })));
        // API Call
        try {
            await api.post(`/community/answers/${answerId}/upvote`, {}, getAuthHeaders());
        } catch (err) {
            console.error("Toggle Answer Upvote failed:", err);
            fetchQuestions(); // Rollback
        }
    }, [getAuthHeaders, user?._id, fetchQuestions]);

    // =============================================================
    // --- ↪️ REPLY CRUD (NEW) ---
    // =============================================================

    const createReply = useCallback(async (answerId, body) => {
        // Backend returns the *entire updated answer* with the new reply
        const res = await api.post(`/community/answers/${answerId}/replies`, { body }, getAuthHeaders());
        const updatedAnswer = res.data;

        setQuestions(prev => prev.map(q => ({
            ...q,
            answers: q.answers.map(a => a._id === answerId ? updatedAnswer : a)
        })));
        return updatedAnswer;
    }, [getAuthHeaders]);

    // (Add updateReply and deleteReply here if you have routes for them)

    // =============================================================

    const value = useMemo(() => ({
        questions,
        loading,
        error,
        fetchQuestions,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        toggleQuestionUpvote,
        addAnswer,
        updateAnswer,
        deleteAnswer,
        toggleAnswerUpvote,
        createReply, // <-- ADDED
    }), [
        questions, loading, error, fetchQuestions,
        createQuestion, updateQuestion, deleteQuestion, toggleQuestionUpvote,
        addAnswer, updateAnswer, deleteAnswer, toggleAnswerUpvote,
        createReply
    ]);

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => useContext(CommunityContext);