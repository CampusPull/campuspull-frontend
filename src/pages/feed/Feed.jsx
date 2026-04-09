import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Video,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreVertical,
  Trash2,
  Edit,
  Flame,
  X,
  Loader,
} from "lucide-react";
import { useFeed } from "../../context/feedContext"; 
import { useAuth } from "../../context/AuthContext";

// --- Helper: Time Formatter ---
const formatTime = (dateString) => {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays > 7) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays > 0) return `${diffDays}d ago`;
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours > 0) return `${diffHours}h ago`;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'just now';
};

// --- Helper: Check for Video URL ---
const isVideo = (mediaUrl) => {
  if (!mediaUrl) return false;
  return mediaUrl.match(/\.(mp4|webm|mov)$/i) != null;
};

// ===================================================================
// --- NEW COMPONENT: MediaViewer (Handles Sizing Logic) ---
// ===================================================================
const MediaViewer = ({ url, className = "", maxHeight = "500px" }) => {
  if (!url) return null;
  const isVid = isVideo(url);

  return (
    <div className={`rounded-xl overflow-hidden bg-white border border-gray-100 flex justify-center ${className}`}>
      {isVid ? (
        <video 
          src={url} 
          controls 
          className="w-full h-auto object-contain" 
          style={{ maxHeight }} 
        />
      ) : (
        <img 
          src={url} 
          alt="Post media" 
          className="w-full h-auto object-contain" 
          style={{ maxHeight }} 
        />
      )}
    </div>
  );
};

// --- Main Feed Page Component ---
const FeedPage = () => {
  const { 
    feed: posts, 
    loading, 
    error, 
    createPost, 
    likePost, 
    commentPost,
    deletePost,
    sharePost,
    replyToComment, 
    likeComment,    
  } = useFeed();
  const { user } = useAuth();

  const [newPost, setNewPost] = useState("");
  const [newMediaPreview, setNewMediaPreview] = useState(null);
  const [newMediaFile, setNewMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.startsWith("video") ? "video" : "image";
    setMediaType(type);
    setNewMediaFile(file);
    setNewMediaPreview(URL.createObjectURL(file));
    e.target.value = null;
  };

  const clearMedia = () => {
    setNewMediaPreview(null);
    setNewMediaFile(null);
    setMediaType(null);
  }

  const handlePost = async () => {
    if (newPost.trim() === "" && !newMediaFile) return;
    setIsPosting(true);
    try {
      await createPost(newPost, newMediaFile);
      setNewPost("");
      setNewMediaPreview(null);
      setNewMediaFile(null);
      setMediaType(null);
    } catch (err) { console.error("Failed to post:", err); } 
    finally { setIsPosting(false); }
  };

  const handleLike = async (postId) => {
    try { await likePost(postId); } 
    catch (err) { console.error("Failed to like post:", err); }
  };

  const toggleCommentBox = (postId) => {
    setActiveCommentBox(activeCommentBox === postId ? null : postId);
    setCommentText("");
  };

  const handleAddComment = async (postId) => {
    if (commentText.trim() === "") return;
    setIsCommenting(true);
    try {
      await commentPost(postId, commentText);
      setCommentText("");
    } catch (err) { console.error("Failed to comment:", err); } 
    finally { setIsCommenting(false); }
  };

  const handleShare = async (postId) => {
    const sharedContent = prompt("Add a comment to your share (optional):");
    if (sharedContent === null) return;
    try { await sharePost(postId, sharedContent); } 
    catch (err) { console.error("Failed to share post:", err); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row px-4 md:px-12 py-8 gap-8">
      {/* Feed Section */}
      <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Campus Feed</h1>

        {/* Create Post */}
        <motion.div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 mb-6" whileHover={{ scale: 1.01 }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <textarea
              placeholder="Start a post..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 resize-none border-b border-gray-200 focus:border-blue-400 pb-2"
              rows="2"
            />
          </div>

          {newMediaPreview && (
            <div className="mb-3 rounded-xl overflow-hidden relative bg-black flex justify-center">
               {/* Manually applying sizing here to keep the Close button logic simple */}
              {mediaType === "video" ? (
                <video src={newMediaPreview} controls className="w-full h-auto max-h-[300px] object-contain" />
              ) : (
                <img src={newMediaPreview} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
              )}
              <button onClick={clearMedia} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75">
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-4 text-gray-500 text-sm">
              <label className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                <ImageIcon size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleMediaUpload} />
                Photo
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                <Video size={18} />
                <input type="file" accept="video/*" className="hidden" onChange={handleMediaUpload} />
                Video
              </label>
            </div>
            <button 
              onClick={handlePost} 
              disabled={isPosting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-medium transition disabled:bg-blue-300"
            >
              {isPosting ? <Loader size={16} className="animate-spin" /> : "Post"}
            </button>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader size={32} className="animate-spin text-blue-500" />
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="space-y-5">
          {!loading && posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              user={user}
              onLike={handleLike}
              onDelete={deletePost}
              onShare={handleShare}
              onToggleComment={toggleCommentBox}
              onAddComment={handleAddComment}
              activeCommentBox={activeCommentBox}
              commentText={commentText}
              setCommentText={setCommentText}
              isCommenting={isCommenting}
              onReplyToComment={replyToComment}
              onLikeComment={likeComment}
            />
          ))}
        </div>
      </motion.div>

      {/* Sidebar */}
      <motion.div className="w-full md:w-1/3 bg-white rounded-2xl p-5 shadow-md border border-gray-200 h-fit" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <Flame className="text-orange-500" size={18} /> Trending Topics
        </h2>
        <ul className="space-y-2">
          {["#ReactJS", "#TechFest2025", "#Hackathon", "#CampusVibes", "#AIInnovation"].map((topic, i) => (
            <li key={i} className="text-blue-600 font-medium cursor-pointer hover:underline">{topic}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default FeedPage;


// ===================================================================
// --- Post Card Component ---
// ===================================================================
const PostCard = ({ 
  post, 
  user, 
  onLike, 
  onDelete,
  onShare,
  onToggleComment, 
  onAddComment, 
  activeCommentBox,
  commentText,
  setCommentText,
  isCommenting,
  onReplyToComment,
  onLikeComment
}) => {
  const { updatePost } = useFeed(); 

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editMediaFile, setEditMediaFile] = useState(null);     
  const [editMediaPreview, setEditMediaPreview] = useState(null); 
  const [editMediaType, setEditMediaType] = useState(null);     

  const isLiked = post.likes.includes(user?._id);
  const isAuthor = post.author._id === user?._id;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await onDelete(post._id); 
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Error: Could not delete the post.");
      }
    }
    setMenuOpen(false);
  };

  const handleEditToggle = () => {
    const editing = !isEditing;
    setIsEditing(editing);
    setMenuOpen(false);
    
    setEditContent(post.content);
    setEditMediaFile(null); 
    setEditMediaPreview(post.media || null); 
    setEditMediaType(post.media && isVideo(post.media) ? 'video' : 'image');
  };

  const handleEditMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type.startsWith("video") ? "video" : "image";
    setEditMediaType(type);
    setEditMediaFile(file); 
    setEditMediaPreview(URL.createObjectURL(file)); 
    e.target.value = null;
  };

  const handleUpdate = async () => {
    const contentChanged = editContent.trim() !== post.content.trim();
    const mediaChanged = editMediaFile !== null; 
    
    if (!contentChanged && !mediaChanged) {
      setIsEditing(false); 
      return;
    }
    
    setIsUpdating(true);
    try {
      await updatePost(post._id, editContent, editMediaFile); 
      setIsEditing(false);
      setEditMediaFile(null);
    } catch (err) {
      console.error("Failed to update post:", err);
      alert(`Error updating post: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200" 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex items-start justify-between">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden">
             {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
              ) : (
                post.author?.name?.charAt(0) || '?'
              )}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{post.author.name}</p>
            <p className="text-xs text-gray-400">{formatTime(post.createdAt)}</p>
          </div>
        </div>
        
        {/* Post Menu (Delete/Edit) */}
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} disabled={isEditing}>
              <MoreVertical size={20} className="text-gray-500" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-6 bg-white shadow-lg rounded-md border border-gray-200 w-32 z-10"
                >
                  <button 
                    onClick={handleEditToggle} 
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* --- Post Content --- */}
      {isEditing ? (
        // --- EDITING VIEW ---
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          />
          
          {/* Edit Media Preview */}
          {editMediaPreview && (
            <div className="my-3 rounded-xl overflow-hidden relative bg-black flex justify-center">
               {/* Manually applying classes for Edit Preview to support Close button */}
              {editMediaType === "video" ? (
                <video src={editMediaPreview} controls className="w-full h-auto max-h-[300px] object-contain" />
              ) : (
                <img src={editMediaPreview} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
              )}
              {editMediaFile && (
                <button onClick={() => { setEditMediaFile(null); setEditMediaPreview(post.media || null); setEditMediaType(post.media && isVideo(post.media) ? 'video' : 'image'); }} 
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75">
                  <X size={18} />
                </button>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-4 text-gray-500 text-sm">
              <label className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                <ImageIcon size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleEditMediaUpload} />
                Change Photo
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                <Video size={18} />
                <input type="file" accept="video/*" className="hidden" onChange={handleEditMediaUpload} />
                Change Video
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded-md font-medium disabled:bg-blue-300"
            >
              {isUpdating ? <Loader size={16} className="animate-spin" /> : 'Save'}
            </button>
            <button 
              onClick={handleEditToggle} 
              className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // --- NORMAL VIEW ---
        <>
          {post.sharedContent && (
            <p className="text-gray-600 mb-2 italic">"{post.sharedContent}"</p>
          )}
          {post.content && !post.originalPost && (
            <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
          )}
          {/* USING NEW COMPONENT */}
          {post.media && !post.originalPost && (
             <div className="mb-3">
                <MediaViewer url={post.media} maxHeight="500px" />
             </div>
          )}
        </>
      )}

      {/* --- Shared Post Card (if it exists) --- */}
      {!isEditing && post.originalPost && (
        <div className="border border-gray-200 rounded-xl p-4 mt-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden">
              {post.originalPost.author?.avatar ? (
                  <img src={post.originalPost.author.avatar} alt={post.originalPost.author.name} className="w-full h-full object-cover" />
                ) : (
                  post.originalPost.author?.name?.charAt(0) || '?'
                )}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{post.originalPost.author.name}</p>
              <p className="text-xs text-gray-400">{formatTime(post.originalPost.createdAt)}</p>
            </div>
          </div>
          {post.originalPost.content && (
            <p className="text-gray-700 mb-3 text-sm">{post.originalPost.content}</p>
          )}
          
          {/* USING NEW COMPONENT (Smaller Height for Shared Posts) */}
          {post.originalPost.media && (
             <div className="mb-3">
                <MediaViewer url={post.originalPost.media} maxHeight="400px" />
             </div>
          )}
        </div>
      )}

      {/* --- Stats --- */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
        <span>{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
        <span>{post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}</span>
      </div>

      {/* --- Actions --- */}
      <div className="flex justify-around items-center mt-2 pt-2 border-t border-gray-200 text-gray-500 text-sm font-medium">
        <button 
          onClick={() => onLike(post._id)}
          className={`flex-1 flex justify-center items-center gap-2 py-1 rounded-lg hover:bg-gray-100 ${isLiked ? 'text-blue-600' : ''}`}
        >
          <ThumbsUp size={18} className={`${isLiked ? 'fill-blue-600' : ''}`} /> 
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button 
          onClick={() => onToggleComment(post._id)}
          className="flex-1 flex justify-center items-center gap-2 py-1 rounded-lg hover:bg-gray-100"
        >
          <MessageCircle size={18} /> Comment
        </button>
        <button 
          onClick={() => onShare(post._id)}
          className="flex-1 flex justify-center items-center gap-2 py-1 rounded-lg hover:bg-gray-100"
        >
          <Share2 size={18} /> Share
        </button>
      </div>

      {/* --- Comment Input & List --- */}
      <AnimatePresence>
        {activeCommentBox === post._id && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden mt-1">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={() => onAddComment(post._id)}
                disabled={isCommenting || commentText.trim() === ""}
                className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm disabled:bg-blue-300"
              >
                {isCommenting ? <Loader size={16} className="animate-spin" /> : 'Post'}
              </button>
            </div>
            
            {post.comments.length > 0 && (
              <div className="mt-4 space-y-3 pl-4 border-l border-gray-200">
                {post.comments.map((comment) => (
                  <CommentItem 
                    key={comment._id} 
                    comment={comment} 
                    user={user}
                    postId={post._id}
                    onReplyToComment={onReplyToComment}
                    onLikeComment={onLikeComment}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// ===================================================================
// --- Comment Item Component ---
// ===================================================================
const CommentItem = ({ comment, user, postId, onReplyToComment, onLikeComment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const isLiked = comment.likes.includes(user?._id);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (replyText.trim() === "") return;
    setIsReplying(true);
    try {
      await onReplyToComment(postId, comment._id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    } catch (err) {
      console.error("Failed to submit reply:", err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleLike = () => {
    onLikeComment(postId, comment._id);
  };

  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
        {comment.user?.avatar ? (
          <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
        ) : (
          comment.user?.name?.charAt(0) || '?'
        )}
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-xl px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">{comment.user.name}</span>
            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
          </div>
          <p className="text-gray-700 text-sm">{comment.text}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 pl-2 mt-1">
          <button 
            onClick={handleLike}
            className={`font-semibold ${isLiked ? 'text-blue-600' : 'hover:underline'}`}
          >
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <span className="">{comment.likesCount > 0 && comment.likesCount}</span>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="font-semibold hover:underline"
          >
            Reply
          </button>
        </div>

        {/* --- Nested Reply Form --- */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.form 
              onSubmit={handleReplySubmit}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 mt-2"
            >
              <input 
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={isReplying || replyText.trim() === ""}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold disabled:bg-blue-300"
              >
                {isReplying ? <Loader size={14} className="animate-spin" /> : 'Send'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* --- Nested Reply List --- */}
        {comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <ReplyItem 
                key={reply._id} 
                reply={reply} 
                user={user}
                postId={postId}
                commentId={comment._id}
                onLikeComment={onLikeComment}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// ===================================================================
// --- Reply Item Component ---
// ===================================================================
const ReplyItem = ({ reply, user, postId, commentId, onLikeComment }) => {
  const isLiked = reply.likes.includes(user?._id);

  const handleLike = () => {
    onLikeComment(postId, commentId, reply._id);
  };

  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
        {reply.user?.avatar ? (
          <img src={reply.user.avatar} alt={reply.user.name} className="w-full h-full object-cover" />
        ) : (
          reply.user?.name?.charAt(0) || '?'
        )}
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-xl px-3 py-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-xs">{reply.user.name}</span>
            <span className="text-xs text-gray-400">{formatTime(reply.createdAt)}</span>
          </div>
          <p className="text-gray-700 text-sm">{reply.text}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 pl-2 mt-1">
          <button 
            onClick={handleLike}
            className={`font-semibold ${isLiked ? 'text-blue-600' : 'hover:underline'}`}
          >
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <span className="">{reply.likesCount > 0 && reply.likesCount}</span>
        </div>
      </div>
    </div>
  );
};