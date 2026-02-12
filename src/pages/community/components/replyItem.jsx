import React from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Trash2, Loader } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
// import { useCommunity } from '../context/CommunityContext'; // Uncomment if you add delete/edit reply

// --- Helper Function (Embedded) ---
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

export const ReplyItem = ({ reply }) => {
    const { user } = useAuth();
    // const { deleteReply, updateReply } = useCommunity(); // Get these when you add them to context
    
    const { _id, body, author, createdAt } = reply;

    // --- Internal State (for when you add edit/delete) ---
    // const [isDeleting, setIsDeleting] = useState(false);
    // const [isEditing, setIsEditing] = useState(false);
    // const [editBody, setEditBody] = useState(body);
    // const [editLoading, setEditLoading] = useState(false);

    // --- Computed Values ---
    const isOwner = user ? user._id === author?._id : false;
    const canModify = isOwner || user?.role === 'admin';

    // --- Handlers (Uncomment when you add context logic) ---
    /*
    const handleDelete = async () => {
        if (!window.confirm("Delete this reply?")) return;
        setIsDeleting(true);
        try {
            // await deleteReply(reply.answerId, _id); // You'll need to pass answerId down
        } catch (error) {
            console.error("Delete reply failed:", error);
            setIsDeleting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            // await updateReply(_id, { body: editBody });
            // setIsEditing(false);
        } catch (error) {
            console.error("Update reply failed:", error);
        } finally {
            setEditLoading(false);
        }
    };
    */

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2"
        >
            {/* Author Avatar */}
            <img
                src={author?.avatar || '/default-avatar.png'}
                alt={author?.name || 'Author'}
                className="w-7 h-7 rounded-full mt-1 border border-slate-200"
            />
            {/* Reply Content */}
            <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{author?.name || 'User'}</span>
                    <span className="text-xs text-slate-400">{formatTime(createdAt)}</span>
                </div>
                {/* // --- UNCOMMENT THIS BLOCK TO ADD EDITING ---
                {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="space-y-2 mt-1">
                        <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <div className="flex gap-2">
                            <button type="submit" disabled={editLoading} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="text-xs bg-gray-200 px-2 py-1 rounded">Cancel</button>
                        </div>
                    </form>
                ) : (
                */}
                    <p className="text-sm text-slate-600 whitespace-pre-wrap mt-0.5">{body}</p>
                {/* )} 
                */}
            </div>

            {/* --- UNCOMMENT THIS BLOCK TO ADD EDIT/DELETE ACTIONS ---
            {canModify && !isEditing && (
                <div className="flex items-center gap-1 text-slate-400">
                    <button onClick={() => setIsEditing(true)} title="Edit Reply">
                        <Edit size={12} className="hover:text-blue-600" />
                    </button>
                    <button onClick={handleDelete} disabled={isDeleting} title="Delete Reply">
                        {isDeleting ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} className="hover:text-red-500" />}
                    </button>
                </div>
            )}
            */}
        </motion.div>
    );
};