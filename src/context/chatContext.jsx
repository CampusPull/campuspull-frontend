import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  
  // ✅ ADDED: State for unread counts
  const [unreadCounts, setUnreadCounts] = useState({});

  // --- SOCKET CONNECTION & LISTENERS ---
  useEffect(() => {
    if (!user?._id) return;

    // Connect to Socket
    const newSocket = io(api.defaults.baseURL.replace("/api", ""), {
      query: { userId: user._id },
    });
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", setOnlineUsers);

    // ✅ HANDLE NEW MESSAGE
    newSocket.on("newMessage", (message) => {
      const chatId = message.sender._id === user._id ? message.recipient._id : message.sender._id;

      // 1. Update Messages
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));

      // 2. Update Unread Counts (if not currently looking at this chat)
      if (activeChat !== chatId && message.sender._id !== user._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1
        }));
      }

      // 3. Update Chat List (Bubble to top)
      setChatList((prev) => {
        const existingIndex = prev.findIndex((c) => c.chatWith._id === chatId);
        const existingChat = prev[existingIndex] || {};

        const updatedChatItem = {
          ...existingChat,
          chatWith: { 
            // ✅ CRITICAL FIX: Preserve existing details (like profileImage)
            ...existingChat.chatWith, 
            _id: chatId, 
            name: message.sender._id === user._id ? message.recipient.name : message.sender.name 
          },
          lastMessage: message.file ? "📎 Attachment" : message.content, // Show attachment icon if file
          lastMessageTime: message.createdAt,
        };

        let updatedList = [...prev];
        if (existingIndex > -1) {
          updatedList.splice(existingIndex, 1);
        }
        return [updatedChatItem, ...updatedList];
      });
    });

    // ✅ HANDLE MESSAGE READ RECEIPT
    newSocket.on("messageRead", (payload) => {
      const messageIdToUpdate = typeof payload === 'object' && payload._id ? payload._id : payload;

      setMessages((prevMessages) => {
        const newMessagesState = JSON.parse(JSON.stringify(prevMessages));
        
        for (const chatId in newMessagesState) {
          const messageIndex = newMessagesState[chatId].findIndex(m => m._id === messageIdToUpdate);
          if (messageIndex !== -1) {
            newMessagesState[chatId][messageIndex].read = true;
            break;
          }
        }
        return newMessagesState;
      });
    });

    return () => {
      newSocket.off("getOnlineUsers");
      newSocket.off("newMessage");
      newSocket.off("messageRead");
      newSocket.disconnect();
    };
  }, [user, activeChat]); // Added activeChat dependency for unread logic

  // --- FETCH INITIAL CHAT LIST ---
  useEffect(() => {
    if (!user?._id) return;
    const fetchChats = async () => {
      try {
        const res = await api.get(`/message/chatlist/${user._id}`);
        setChatList(res.data || []);
      } catch (err) {
        console.error("Error fetching chat list:", err);
      }
    };
    fetchChats();
  }, [user?._id]);

  // --- LOAD MESSAGES ---
  const loadMessages = useCallback(async (recipientId) => {
    if (!user?._id || !recipientId) return;
    try {
      const res = await api.get(`/message/${user._id}/${recipientId}`);
      setMessages((prev) => ({
        ...prev,
        [recipientId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  }, [user?._id]);

  // --- ✅ FIXED: SEND MESSAGE (Supports Files) ---
  const sendMessage = useCallback(async (recipientId, text, file) => {
    if (!user?._id || !recipientId) return;
    if (!text?.trim() && !file) return;

    try {
      let response;
      
      // If there is a file, we MUST use FormData
      if (file) {
        const formData = new FormData();
        formData.append("sender", user._id);
        formData.append("recipient", recipientId);
        if (text) formData.append("content", text.trim());
        formData.append("file", file); // Backend must use Multer to catch this

        response = await api.post("/message", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Text only (JSON)
        response = await api.post("/message", {
            sender: user._id,
            recipient: recipientId,
            content: text.trim(),
        });
      }
      
      // We rely on the socket "newMessage" event to update state
      // to avoid duplicates.
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }, [user, socket]);

  // --- MARK MESSAGES AS READ ---
  const markAsRead = useCallback(async (messagesToMarkAsRead) => {
    if (!user?._id || messagesToMarkAsRead.length === 0) return;

    // Get Chat ID to clear unread counts locally
    const chatId = messagesToMarkAsRead[0].sender._id === user._id 
        ? messagesToMarkAsRead[0].recipient._id 
        : messagesToMarkAsRead[0].sender._id;

    // 1. Clear Unread Count in State immediately
    setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));

    // 2. Call API for each message (Keep existing loop logic)
    for (const msg of messagesToMarkAsRead) {
      try {
        await api.patch(`/message/read/${msg._id}`);

        setMessages((prev) => ({
          ...prev,
          [chatId]: prev[chatId]?.map((m) =>
            m._id === msg._id ? { ...m, read: true } : m
          ),
        }));
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
    }
  }, [user?._id]); 

  // --- Helper to clear unread manually when clicking a chat ---
  const clearUnreadCount = (chatId) => {
      setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
  };

  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
      messages,
      activeChat,
      setActiveChat,
      chatList,
      loadMessages,
      sendMessage,
      markAsRead,
      unreadCounts,     // ✅ Exported
      clearUnreadCount, // ✅ Exported
    }),
    [socket, onlineUsers, messages, activeChat, chatList, loadMessages, sendMessage, markAsRead, unreadCounts]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);