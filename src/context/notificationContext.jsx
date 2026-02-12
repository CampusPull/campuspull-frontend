import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
// CHANGED: We now get the socket from our Context, not directly from the file
import { useSocket } from "./socketContext"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext"; 
import api from "../utils/api"; 

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth(); 
  
  // 1. GET THE SOCKET INSTANCE
  // This socket is already connected (or connecting) by SocketContext
  const socket = useSocket(); 

  // --- PART 1: Fetch History (The "Mailbox") ---
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        const { data } = await api.get("/notifications"); 
        
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error(">> [NotifContext] ERROR fetching history:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  // --- PART 2: Live Updates (The "Phone") ---
  useEffect(() => {
    // CHANGED: We don't connect here. We just check if socket exists.
    if (!socket) return;

    const handleNotification = (data) => {

      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // UI Popup
      toast.info(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    // Attach Listener
    socket.on("receive_notification", handleNotification);

    // Cleanup: Just remove the listener, DO NOT disconnect the socket
    return () => {
      socket.off("receive_notification", handleNotification);
    };
  }, [socket]); // Re-run only if the socket instance changes

  // --- PART 3: Mark as Read Function ---
  const markAsRead = useCallback(async () => {
    // 1. Optimistic Update 
    const originalCount = unreadCount;
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      // 2. Call Backend
      await api.put("/notifications/read");
    } catch (error) {
      console.error(">> [NotifContext] API Sync FAILED. Reverting UI.", error);
      setUnreadCount(originalCount); 
      toast.error("Could not sync read status.");
    }
  }, [unreadCount]);

  const value = useMemo(
    () => ({
      socket,
      notifications,
      unreadCount,
      markAsRead,
    }),
    [socket, notifications, unreadCount, markAsRead]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};