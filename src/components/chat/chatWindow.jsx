import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; 
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaCircle, FaPaperclip, FaTimes } from "react-icons/fa"; // Added FaTimes for closing
import api from "../../utils/api"; 

const ChatWindow = ({ recipientId, recipientName, recipientImage }) => {
  const { messages, sendMessage, loadMessages, markAsRead, onlineUsers } = useChat();
  const { user } = useAuth();
  
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const isOnline = onlineUsers.includes(recipientId);

  // ✅ 1. HELPER: Process Image URLs (Handles Cloudinary & Local)
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path; // Cloudinary URL -> Return as is
    
    let baseUrl = api.defaults.baseURL || "";
    baseUrl = baseUrl.replace(/\/api\/?$/, ""); 
    return `${baseUrl}${path}`;
  };

  // Process the Profile Image Prop
  const profilePic = getImageUrl(recipientImage);

  // ✅ 2. HELPER: Render File Link
  const renderFileLink = (fileData) => {
    if (!fileData) return null;
    let fileUrl;
    let fileName = "Attachment";

    if (fileData instanceof File) {
        fileUrl = URL.createObjectURL(fileData);
        fileName = fileData.name;
    } else if (typeof fileData === 'string') {
        fileUrl = getImageUrl(fileData); 
        fileName = "View Attachment";
    } else if (fileData.path || fileData.url) {
        fileUrl = getImageUrl(fileData.path || fileData.url);
        fileName = fileData.name || "Attachment";
    }

    // Optional: If it's an image, show a thumbnail preview instead of just a link
    const isImage = fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;

    if (isImage) {
        return (
            <div className="mt-2 mb-1 max-w-[200px] rounded-lg overflow-hidden border border-gray-200">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <img src={fileUrl} alt="attachment" className="w-full h-auto" />
                </a>
            </div>
        );
    }

    return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline text-sm break-all hover:text-blue-100 bg-black/10 px-2 py-1 rounded w-fit">
           📎 {fileName}
        </a>
    );
  };

  useEffect(() => {
    if (recipientId) loadMessages(recipientId);
  }, [recipientId, loadMessages]);

  useEffect(() => {
    if (messages[recipientId] && user?._id) {
      const unreadMessages = messages[recipientId].filter(
        (msg) => (msg.recipient?._id || msg.recipient) === user._id && !msg.read
      );
      if (unreadMessages.length > 0) markAsRead(unreadMessages);
    }
  }, [messages[recipientId], recipientId, user?._id, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[recipientId]]);

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;
    await sendMessage(recipientId, newMessage, file);
    setNewMessage("");
    setFile(null); // Clear file after sending
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handlePin = (msg) => {
    if (pinnedMessages.includes(msg)) return;
    setPinnedMessages((prev) => [msg, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 via-white to-blue-50 rounded-2xl shadow-xl overflow-hidden">
      
      {/* HEADER */}
      <div className="px-4 py-3 bg-white/50 backdrop-blur-md border-b border-white/40 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
            <Link to={`/profile/${recipientId}`}>
                <div className="relative w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition">
                    <div className="w-full h-full rounded-full overflow-hidden border border-gray-300 shadow-sm bg-white flex items-center justify-center">
                        {profilePic ? (
                            <img src={profilePic} alt={recipientName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-300" />
                        )}
                    </div>
                    {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
            </Link>

            <div className="flex flex-col">
                <Link to={`/profile/${recipientId}`} className="hover:underline decoration-indigo-500">
                    <h2 className="font-semibold text-gray-800 text-lg leading-tight cursor-pointer">{recipientName || "User"}</h2>
                </Link>
                <div className="flex items-center gap-1.5">
                    <FaCircle size={8} className={isOnline ? "text-green-500" : "text-gray-300"} />
                    <span className={`text-xs font-medium ${isOnline ? "text-green-600" : "text-gray-400"}`}>{isOnline ? "Online" : "Offline"}</span>
                </div>
            </div>
        </div>

        <div className="flex gap-2">
          {pinnedMessages.length > 0 && (
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📌 {pinnedMessages.length} Pinned</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages?.[recipientId]?.map((msg, index) => {
          const isSender = (msg.sender?._id || msg.sender) === user?._id;
          const messageTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
          
          return (
            <div key={msg._id || index} className={`flex ${isSender ? "justify-end" : "justify-start"} group`}>
              <div className={`p-3 rounded-2xl max-w-md shadow-md transition transform hover:scale-102 relative ${
                isSender ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white" : "bg-white/50 backdrop-blur-md text-gray-800"
              }`}>
                
                {/* ✅ Render Attachments (Image Preview or Link) */}
                {msg.file && (
                  <div className="mb-1">
                    {renderFileLink(msg.file)}
                  </div>
                )}

                {msg.content && <p className="text-sm">{msg.content}</p>}
                
                <div className={`text-xs mt-1 flex items-center gap-1.5 ${isSender ? "justify-end text-white/80" : "justify-start text-gray-500"}`}>
                  <span>{messageTime}</span>
                  {isSender && <span className={msg.read ? "text-white" : "text-white/70"}>{msg.read ? "✔✔" : "✔"}</span>}
                </div>

                <button onClick={() => handlePin(msg)} className="absolute top-1 right-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-yellow-500 transition" title="Pin Message">
                  📌
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/50 backdrop-blur-md border-t border-white/30 shadow-inner">
        
        {/* ✅ NEW: Selected File Preview Bar */}
        {file && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex justify-between items-center animate-fade-in-up">
                <span className="text-xs text-blue-700 font-medium truncate flex items-center gap-2">
                    📎 {file.name}
                </span>
                <button 
                    onClick={() => setFile(null)} 
                    className="text-blue-400 hover:text-red-500 transition p-1"
                >
                    <FaTimes size={12} />
                </button>
            </div>
        )}

        <div className="p-3 flex items-center gap-2">
            <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/70 backdrop-blur-md"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            
            <label className={`cursor-pointer px-3 py-2 rounded-full text-sm transition ${file ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
            <FaPaperclip />
            <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            
            <button
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transition shadow"
            >
            Send
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;