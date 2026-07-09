import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";
import ChatSidebar from "../../components/chat/chatSidebar";
import ChatWindow from "../../components/chat/chatWindow";

const ChatPage = () => {
  const { chatList, activeChat, setActiveChat } = useChat();
  const { user } = useAuth();
  const location = useLocation();
  
  // If navigating from a profile directly to message
  const newChatData = location.state?.newChat;

  useEffect(() => {
    if (newChatData?.id) {
      setActiveChat(newChatData.id);
      // Clear history state to avoid overriding if they click another chat
      window.history.replaceState({}, document.title)
    }
  }, [newChatData?.id, setActiveChat]);

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

  // Find the details of the active chat from list, or use newChatData as fallback
  const activeChatData = chatList.find(c => {
    const chatUser = getChatUser(c, user?._id);
    const userId = chatUser?._id || (typeof chatUser === "string" ? chatUser : null);
    return userId === activeChat;
  }) || (newChatData?.id === activeChat 
            ? { chatWith: { _id: newChatData.id, name: newChatData.name, profileImage: newChatData.profileImage } } 
            : null);

  const activeChatUser = activeChatData ? getChatUser(activeChatData, user?._id) : null;
  const recipientName = activeChatUser?.name || activeChatData?.name || newChatData?.name;
  const recipientImage = activeChatUser?.profileImage || activeChatData?.profileImage || newChatData?.profileImage;

  return (
    <div className="flex h-[calc(100vh-5rem)] mt-20 bg-gray-50 overflow-hidden">
      
      <ChatSidebar />

      {/* Main Chat Container */}
      <div className={`flex-1 flex flex-col bg-white ${activeChat ? "flex" : "hidden"} md:flex`}>
        {activeChat && activeChatData ? (
          <div className="flex-1 overflow-hidden bg-gray-50 relative">
             <ChatWindow 
                recipientId={activeChat} 
                recipientName={recipientName}
                recipientImage={recipientImage} 
             />
          </div>
        ) : (
          /* Empty State */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 bg-gray-50">
            <FaUserCircle className="text-6xl mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;