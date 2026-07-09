import { useState, useMemo } from "react"; 
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";
import { FaCircle } from "react-icons/fa"; // Removed unused FaUserCircle
import api from "../../utils/api"; // Import API

const formatLastMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays > 7) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays > 0) return `${diffDays}d`;
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours > 0) return `${diffHours}h`;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins > 0) return `${diffMins}m`;
  return 'now';
};

const ChatSidebar = () => {
  const { chatList, onlineUsers, loadMessages, activeChat, setActiveChat, unreadCounts, clearUnreadCount } = useChat();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");

  // Helper to extract user details from chat item
  const getChatUser = (chat, currentUserId) => {
    if (!chat) return null;
    return chat.chatWith || 
           chat.user || 
           (chat.participants && Array.isArray(chat.participants) 
              ? chat.participants.find(p => (p?._id || p) !== currentUserId) 
              : null) || 
           chat;
  };

  const filteredChats = useMemo(() => {
    console.log("ChatSidebar render: chatList =", chatList);
    if (!chatList) return [];
    return chatList.filter(chat => {
      const chatUser = getChatUser(chat, currentUser?._id);
      const displayName = chat?.name || chatUser?.name || "";
      return displayName.toLowerCase().includes(search.toLowerCase());
    });
  }, [chatList, search, currentUser]);

  // Helper for dynamic image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    
    let baseUrl = api.defaults.baseURL || "";
    baseUrl = baseUrl.replace(/\/api\/?$/, ""); // Strip /api to get root
    return `${baseUrl}${path}`;
  };

  return (
    <div className={`w-full md:w-80 h-full flex flex-col bg-white border-r border-gray-100 flex-shrink-0 ${activeChat ? 'hidden' : 'flex'} md:flex`}>
      
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border-none bg-gray-100 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-sm"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChats.map(chat => {
          const chatUser = getChatUser(chat, currentUser?._id);
          const userId = chatUser?._id || (typeof chatUser === "string" ? chatUser : null) || chat?._id;
          if (!userId) return null;
          
          const isOnline = onlineUsers.includes(userId);
          const unreadCount = unreadCounts?.[userId] || 0;
          const isActive = activeChat === userId;
          const imgSrc = getImageUrl(chatUser?.profileImage || chat?.profileImage); 
          const lastMsgTime = chat.lastMessageTime || chat.updatedAt || chat.lastMessage?.createdAt;
          const formattedTime = formatLastMessageTime(lastMsgTime);
          const displayName = chat.name || chatUser?.name || "Unknown";

          return (
            <button
              key={userId}
              onClick={() => {
                setActiveChat(userId);
                loadMessages(userId);
                clearUnreadCount?.(userId);
              }}
              type="button"
              className={`flex items-center w-full p-3 rounded-xl transition-colors duration-150 border-b border-gray-100/50 ${
                isActive 
                  ? "bg-blue-50 text-gray-900" 
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                  {imgSrc ? (
                    <img 
                        src={imgSrc} 
                        alt={displayName} 
                        className="w-full h-full object-cover"
                        //SAFETY: Hides image if it fails to load (404)
                        onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                  ) : (
                    <span className="font-bold text-gray-600 text-sm">{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
              </div>

              <div className="ml-3 flex-1 min-w-0 text-left relative pr-10">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base pr-2">{displayName}</h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap absolute right-0 top-0.5">{formattedTime}</span>
                </div>
                <p className={`text-sm truncate ${unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>

              {unreadCount > 0 && (
                <div className="ml-2 flex-shrink-0">
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white shadow-sm">
                    {unreadCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;