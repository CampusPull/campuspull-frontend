import React from "react";
import { FaUserCircle } from "react-icons/fa"; 
import { useChat } from "../../context/chatContext";
import ChatSidebar from "../../components/chat/chatSidebar";
import ChatWindow from "../../components/chat/chatWindow";

const ChatPage = () => {
  const { chatList, activeChat } = useChat();
  
  // Find the details of the active chat
  const activeChatData = chatList.find(c => c.chatWith?._id === activeChat);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
      
      <ChatSidebar />

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat && activeChatData ? (
          <div className="flex-1 overflow-hidden bg-gray-50 relative">
             {/* ✅ We pass the RAW profileImage path here.
                 ChatWindow.jsx will use its internal helper to add "http://localhost:5000"
             */}
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