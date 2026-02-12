import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
// Import the hook, not the context itself
import { useAuth } from "./AuthContext"; 
import api from "../utils/api";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  // Use the hook to get auth data
  const { accessToken, user, loading: authLoading } = useAuth(); 
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- FETCH FEED ---
  const fetchFeed = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const { data } = await api.get("/feed", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      setFeed(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // --- CREATE POST ---
  const createPost = useCallback(
    async (content, file = null) => {
      // (This function remains the same as your file)
      if (!accessToken) return;
      if (!content?.trim() && !file) {
        setError("Content or media required");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("content", content?.trim() || "");
        if (file) formData.append("media", file);
        const { data } = await api.post("/feed/post", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        setFeed((prev) => [data, ...prev]);
      } catch (err) {
        console.error(err);
        setError("Failed to create post");
      }
    },
    [accessToken]
  );

  // --- UPDATE POST ---
  // (This function remains the same as your file)
  const updatePost = useCallback(
    async (postId, content, file = null) => {
      if (!accessToken) return;
      try {
        const formData = new FormData();
        formData.append("content", content?.trim() || "");
        if (file) formData.append("media", file);

        const { data } = await api.put(`/feed/post/${postId}`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        // SAFER UPDATE: This merges new data with old, populated data
        setFeed((prev) => 
          prev.map((p) => 
            p._id === postId ? { ...p, content: data.content, media: data.media } : p
          )
        );

      } catch (err) {
        console.error(err);
        setError("Failed to update post");
        throw err; // <-- ADD THIS LINE
      }
    },
    [accessToken]
  );

  // --- DELETE POST ---
  // (This function remains the same as your file)
  const deletePost = useCallback(
    async (postId) => {
      if (!accessToken) return;
      try {
        await api.delete(`/feed/post/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setFeed((prev) => prev.filter((p) => p._id !== postId));
      } catch (err) {
        console.error(err);
        setError("Failed to delete post");
      }
    },
    [accessToken]
  );

  // --- LIKE POST (UPDATED) ---
  const likePost = useCallback(
    async (postId) => {
      if (!accessToken || !user?._id) return;
      const userId = user._id;

      // Optimistic update for real-time toggle
      setFeed((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const isLiked = p.likes.includes(userId);
            const newLikes = isLiked
              ? p.likes.filter((id) => id !== userId)
              : [...p.likes, userId];
            // Update both the array and the count
            return { ...p, likes: newLikes, likesCount: newLikes.length }; 
          }
          return p;
        })
      );

      // API Call (in the background)
      try {
        // We don't need the response data anymore, but we wait for it
        await api.put(`/feed/like/${postId}`, {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to like/unlike post");
        // Rollback on error
        fetchFeed(); 
      }
    },
    [accessToken, user?._id, fetchFeed] // Added dependencies
  );

  // --- COMMENT POST ---
  const commentPost = useCallback(
    async (postId, text) => {
      if (!accessToken) return;
      try {
        const { data } = await api.post(
          `/feed/comment/${postId}`,
          { text },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        // Backend returns the new comments array
        setFeed((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, comments: data, commentsCount: data.length } : p))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to comment on post");
      }
    },
    [accessToken]
  );

  // --- REPLY TO COMMENT ---
  const replyToComment = useCallback(
    async (postId, commentId, text) => {
      if (!accessToken) return;
      try {
        // Backend returns the updated comments array for the post
        const { data } = await api.post(
          `/feed/comment/${postId}/reply/${commentId}`,
          { text },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setFeed((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, comments: data } : p))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to reply to comment");
      }
    },
    [accessToken]
  );

  // --- LIKE COMMENT / REPLY ---
  const likeComment = useCallback(
    async (postId, commentId, replyId = null) => {
      if (!accessToken || !user?._id) return;
      const userId = user._id;
      
      // Optimistic update for comment/reply likes
      setFeed(prev => 
        prev.map(p => {
          if (p._id !== postId) return p;

          return {
            ...p,
            comments: p.comments.map(c => {
              if (c._id === commentId && !replyId) {
                // Liking a comment
                const isLiked = c.likes.includes(userId);
                const newLikes = isLiked ? c.likes.filter(id => id !== userId) : [...c.likes, userId];
                return { ...c, likes: newLikes, likesCount: newLikes.length };
              }
              if (c._id === commentId && replyId) {
                // Liking a reply
                return {
                  ...c,
                  replies: c.replies.map(r => {
                    if (r._id === replyId) {
                      const isLiked = r.likes.includes(userId);
                      const newLikes = isLiked ? r.likes.filter(id => id !== userId) : [...r.likes, userId];
                      return { ...r, likes: newLikes, likesCount: newLikes.length };
                    }
                    return r;
                  })
                };
              }
              return c;
            })
          };
        })
      );

      // API Call
      try {
        const url = replyId
          ? `/feed/comment/${postId}/like/${commentId}/${replyId}`
          : `/feed/comment/${postId}/like/${commentId}`;
        
        // We only call the API, optimistic update handles the UI
        await api.put(url, {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to like comment/reply");
        fetchFeed(); // Rollback
      }
    },
    [accessToken, user?._id, fetchFeed]
  );

  // --- SHARE POST ---
  // (This function remains the same as your file)
  const sharePost = useCallback(
    async (postId, sharedContent = "") => {
      // ...
    },
    [accessToken]
  );

  // --- Fetch feed when auth is ready ---
  useEffect(() => {
    if (!authLoading && accessToken) fetchFeed();
  }, [authLoading, accessToken, fetchFeed]);

  const contextValue = useMemo(
    () => ({
      feed,
      loading,
      error,
      fetchFeed,
      createPost,
      updatePost,
      deletePost,
      likePost,
      commentPost,
      replyToComment,
      likeComment,
      sharePost,
    }),
    [feed, loading, error, fetchFeed, createPost, updatePost, deletePost, likePost, commentPost, replyToComment, likeComment, sharePost]
  );

  return <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>;
};

export const useFeed = () => useContext(FeedContext);