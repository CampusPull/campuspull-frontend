import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; 
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaCircle, FaPaperclip, FaTimes, FaArrowLeft, FaPaperPlane } from "react-icons/fa"; // Added FaArrowLeft, FaPaperPlane
import api from "../../utils/api"; 

const ChatWindow = ({ recipientId, recipientName, recipientImage }) => {
  const { messages, sendMessage, loadMessages, markAsRead, onlineUsers, setActiveChat } = useChat();
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
            <div className="mt-1 mb-1 max-w-xs rounded-xl overflow-hidden shadow-sm border border-gray-100/50">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <img src={fileUrl} alt="attachment" className="w-full h-auto object-cover hover:opacity-95 transition" />
                </a>
            </div>
        );
    }

    return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline text-sm break-all hover:text-blue-100 bg-black/10 px-3 py-1.5 rounded-lg w-fit">
           <FaPaperclip size={12} /> {fileName}
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
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
            {/* Back button on mobile */}
            <button
              onClick={() => setActiveChat(null)}
              className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Back to conversations"
            >
              <FaArrowLeft size={18} />
            </button>

            <Link to={`/profile/${recipientId}`}>
                <div className="relative w-10 h-10 rounded-full cursor-pointer hover:opacity-90 transition flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
                        {profilePic ? (
                            <img src={profilePic} alt={recipientName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                            <span className="font-bold text-gray-600 text-sm">{recipientName?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
            </Link>
 
            <div className="flex flex-col text-left">
                <Link to={`/profile/${recipientId}`} className="hover:underline">
                    <h2 className="font-semibold text-gray-900 text-base leading-tight cursor-pointer">{recipientName || "User"}</h2>
                </Link>
                <span className={`text-xs font-medium mt-0.5 ${isOnline ? "text-green-600" : "text-gray-400"}`}>
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>
        </div>

        <div className="flex gap-2">
          {pinnedMessages.length > 0 && (
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📌 {pinnedMessages.length} Pinned</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages?.[recipientId]?.map((msg, index) => {
          const isSender = (msg.sender?._id || msg.sender) === user?._id;
          const messageTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
          
          return (
            <div key={msg._id || index} className={`flex ${isSender ? "justify-end" : "justify-start"} group`}>
              <div className={`pt-2.5 pb-2 px-3 rounded-2xl max-w-sm relative shadow-sm transition-colors ${
                isSender 
                  ? "bg-primary text-white rounded-br-sm" 
                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}>
                
                {/* ✅ Render Attachments (Image Preview or Link) */}
                {msg.file && (
                  <div className="mb-2">
                    {renderFileLink(msg.file)}
                  </div>
                )}

                {msg.content && <p className="text-sm break-words pr-12 whitespace-pre-wrap">{msg.content}</p>}
                
                <div className="h-2" />
                <div className="absolute bottom-1 right-2.5 flex items-center gap-1 text-[10px] opacity-70 select-none">
                  <span>{messageTime}</span>
                  {isSender && <span>{msg.read ? "✔✔" : "✔"}</span>}
                </div>

                <button onClick={() => handlePin(msg)} className="absolute top-1.5 right-1.5 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 hover:text-yellow-500 transition cursor-pointer" title="Pin Message">
                  📌
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 flex flex-col">
        
        {/* ✅ Selected File Preview Bar */}
        {file && (
            <div className="px-4 py-2 bg-primary/5 border-b border-primary/10 flex justify-between items-center animate-fade-in-up">
                <span className="text-xs text-primary font-medium truncate flex items-center gap-2">
                    <FaPaperclip size={12} /> {file.name}
                </span>
                <button 
                    onClick={() => setFile(null)} 
                    className="text-primary/60 hover:text-red-500 transition p-1 cursor-pointer"
                >
                    <FaTimes size={12} />
                </button>
            </div>
        )}

        <div className="p-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-gray-700 placeholder-gray-400 font-medium"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            
            <label className="cursor-pointer p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition flex items-center justify-center">
              <FaPaperclip size={18} />
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() && !file}
              className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm flex items-center justify-center flex-shrink-0 cursor-pointer"
            >
              <FaPaperPlane size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;