import { useState, useMemo } from "react"; 
import { useChat } from "../../context/chatContext";
import { FaCircle } from "react-icons/fa"; // Removed unused FaUserCircle
import api from "../../utils/api"; // ✅ Import API

const ChatSidebar = () => {
  const { chatList, onlineUsers, loadMessages, activeChat, setActiveChat, unreadCounts, clearUnreadCount } = useChat();
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(() => {
    if (!chatList) return [];
    return chatList.filter(chat =>
      chat?.chatWith?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [chatList, search]);

  // ✅ Helper for dynamic image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    
    let baseUrl = api.defaults.baseURL || "";
    baseUrl = baseUrl.replace(/\/api\/?$/, ""); // Strip /api to get root
    return `${baseUrl}${path}`;
  };

  return (
    <div className="w-80 h-full flex flex-col bg-gradient-to-b from-pink-50 via-white to-blue-50 border-r border-white/40 shadow-lg">
      
      {/* Search Bar */}
      <div className="p-4 border-b border-white/30">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-full border border-white/30 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-500 shadow-sm"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredChats.map(chat => {
          const chatUser = chat.chatWith;
          if (!chatUser?._id) return null;
          
          const isOnline = onlineUsers.includes(chatUser._id);
          const unreadCount = unreadCounts?.[chatUser._id] || 0;
          const isActive = activeChat === chatUser._id;
          const imgSrc = getImageUrl(chatUser.profileImage); // ✅ Use helper

          return (
            <button
              key={chatUser._id}
              onClick={() => {
                setActiveChat(chatUser._id);
                loadMessages(chatUser._id);
                clearUnreadCount?.(chatUser._id);
              }}
              type="button"
              className={`flex items-center w-full p-3 rounded-2xl transition transform hover:scale-105 ${
                isActive 
                  ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg" 
                  : "bg-white/30 backdrop-blur-md text-gray-800 hover:bg-white/50"
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center overflow-hidden shadow border border-white/50">
                  {imgSrc ? (
                    <img 
                        src={imgSrc} 
                        alt={chatUser.name} 
                        className="w-full h-full object-cover"
                        // ✅ SAFETY: Hides image if it fails to load (404)
                        onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                  ) : (
                    <span className="font-bold text-gray-700">{chatUser.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {isOnline && <FaCircle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 border-2 border-white rounded-full" />}
              </div>

              <div className="ml-3 flex-1 overflow-hidden text-left">
                <h4 className="font-medium truncate">{chatUser.name || "Unknown"}</h4>
                <p className={`text-xs truncate ${unreadCount > 0 ? "font-bold" : "opacity-80"}`}>
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>

              {unreadCount > 0 && (
                <div className="ml-auto text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow">
                  {unreadCount}
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