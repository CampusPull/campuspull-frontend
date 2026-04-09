import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

export const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
    const { user, accessToken } = useAuth();

    // FIX: single isGuest flag used throughout
    const isGuest = !user;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIX: modal state for guest restricted actions
    const [showAuthModal, setShowAuthModal] = useState(false);

    const getAuthHeaders = useCallback(() => ({
        headers: { Authorization: `Bearer ${accessToken}` },
    }), [accessToken]);

    // --- Initial Data Load ---
    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // FIX: guests call /public/community, logged-in call /community/questions
            if (isGuest) {
                const res = await api.get('/public/community');
                const data = res.data.data || res.data || [];
                setQuestions(data);
            } else {
                const res = await api.get('/community/questions', getAuthHeaders());
                const sortedQuestions = res.data.map(q => ({
                    ...q,
                    answers: (q.answers || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                }));
                setQuestions(sortedQuestions);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load feed.');
            console.error("Fetch Questions Error:", err);
        } finally {
            setLoading(false);
        }
    }, [accessToken, isGuest, getAuthHeaders]);

    // FIX: fetch for both guests and logged-in users
    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    // =============================================================
    // --- QUESTION CRUD (protected — guests trigger modal) ---
    // =============================================================

    const createQuestion = useCallback(async (data) => {
        // FIX: guest guard
        if (isGuest) { setShowAuthModal(true); return; }
        const res = await api.post('/community/questions', data, getAuthHeaders());
        setQuestions(prev => [res.data, ...prev]);
        return res.data;
    }, [getAuthHeaders, isGuest]);

    const updateQuestion = useCallback(async (questionId, data) => {
        if (isGuest) { setShowAuthModal(true); return; }
        const res = await api.put(`/community/questions/${questionId}`, data, getAuthHeaders());
        setQuestions(prev => prev.map(q => q._id === questionId ? res.data : q));
        return res.data;
    }, [getAuthHeaders, isGuest]);

    const deleteQuestion = useCallback(async (questionId) => {
        if (isGuest) { setShowAuthModal(true); return; }
        await api.delete(`/community/questions/${questionId}`, getAuthHeaders());
        setQuestions(prev => prev.filter(q => q._id !== questionId));
    }, [getAuthHeaders, isGuest]);

    const toggleQuestionUpvote = useCallback(async (questionId) => {
        // FIX: guest guard
        if (isGuest) { setShowAuthModal(true); return; }
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
        try {
            await api.post(`/community/questions/${questionId}/upvote`, {}, getAuthHeaders());
        } catch (err) {
            console.error("Toggle Question Upvote failed:", err);
            fetchQuestions();
        }
    }, [getAuthHeaders, isGuest, user?._id, fetchQuestions]);

    // =============================================================
    // --- ANSWER CRUD (protected — guests trigger modal) ---
    // =============================================================

    const addAnswer = useCallback(async (questionId, body) => {
        if (isGuest) { setShowAuthModal(true); return; }
        const res = await api.post(`/community/questions/${questionId}/answers`, { body }, getAuthHeaders());
        setQuestions(prev => prev.map(q => {
            if (q._id === questionId) {
                return { ...q, answers: [res.data, ...q.answers] };
            }
            return q;
        }));
        return res.data;
    }, [getAuthHeaders, isGuest]);

    const updateAnswer = useCallback(async (answerId, body) => {
        if (isGuest) { setShowAuthModal(true); return; }
        const res = await api.put(`/community/answers/${answerId}`, { body }, getAuthHeaders());
        const updatedAnswer = res.data;
        setQuestions(prev => prev.map(q => ({
            ...q,
            answers: q.answers.map(a => a._id === answerId ? updatedAnswer : a)
        })));
        return updatedAnswer;
    }, [getAuthHeaders, isGuest]);

    const deleteAnswer = useCallback(async (questionId, answerId) => {
        if (isGuest) { setShowAuthModal(true); return; }
        await api.delete(`/community/answers/${answerId}`, getAuthHeaders());
        setQuestions(prev => prev.map(q => {
            if (q._id === questionId) {
                return { ...q, answers: q.answers.filter(a => a._id !== answerId) };
            }
            return q;
        }));
    }, [getAuthHeaders, isGuest]);

    const toggleAnswerUpvote = useCallback(async (answerId) => {
        if (isGuest) { setShowAuthModal(true); return; }
        const userId = user._id;
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
        try {
            await api.post(`/community/answers/${answerId}/upvote`, {}, getAuthHeaders());
        } catch (err) {
            console.error("Toggle Answer Upvote failed:", err);
            fetchQuestions();
        }
    }, [getAuthHeaders, isGuest, user?._id, fetchQuestions]);

    // =============================================================
    // --- REPLY CRUD ---
    // =============================================================

    const createReply = useCallback(async (answerId, body) => {
        if (isGuest) { setShowAuthModal(true); return; }
        const res = await api.post(`/community/answers/${answerId}/replies`, { body }, getAuthHeaders());
        const updatedAnswer = res.data;
        setQuestions(prev => prev.map(q => ({
            ...q,
            answers: q.answers.map(a => a._id === answerId ? updatedAnswer : a)
        })));
        return updatedAnswer;
    }, [getAuthHeaders, isGuest]);

    const value = useMemo(() => ({
        questions,
        loading,
        error,
        isGuest,              // FIX: expose so community.jsx can use it
        showAuthModal,        // FIX: expose for modal rendering
        setShowAuthModal,     // FIX: expose for modal close
        fetchQuestions,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        toggleQuestionUpvote,
        addAnswer,
        updateAnswer,
        deleteAnswer,
        toggleAnswerUpvote,
        createReply,
    }), [
        questions, loading, error, isGuest, showAuthModal,
        fetchQuestions, createQuestion, updateQuestion, deleteQuestion,
        toggleQuestionUpvote, addAnswer, updateAnswer, deleteAnswer,
        toggleAnswerUpvote, createReply
    ]);

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => useContext(CommunityContext);