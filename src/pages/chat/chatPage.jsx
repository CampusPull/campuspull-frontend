import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import { useChat } from "../../context/chatContext";
import ChatSidebar from "../../components/chat/chatSidebar";
import ChatWindow from "../../components/chat/chatWindow";

const ChatPage = () => {
  const { chatList, activeChat, setActiveChat } = useChat();
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

  // Find the details of the active chat from list, or use newChatData as fallback
  const activeChatData = chatList.find(c => c.chatWith?._id === activeChat) || 
                         (newChatData?.id === activeChat 
                            ? { chatWith: { _id: newChatData.id, name: newChatData.name, profileImage: newChatData.profileImage } } 
                            : null);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
      
      <ChatSidebar />

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat && activeChatData ? (
          <div className="flex-1 overflow-hidden bg-gray-50 relative">
             <ChatWindow 
                recipientId={activeChat} 
                recipientName={activeChatData?.chatWith?.name}
                recipientImage={activeChatData?.chatWith?.profileImage} 
             />
          </div>
        ) : (
          /* Empty State */
          <div className="flex h-full flex-col items-center justify-center text-gray-400 bg-gray-50">
            <FaUserCircle className="text-6xl mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;