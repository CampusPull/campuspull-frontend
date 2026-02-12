import React, { createContext, useContext, useEffect } from "react";
import { socket } from "../socketServices"; 
import { useAuth } from "./AuthContext"; 

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user, loading } = useAuth(); 

  useEffect(() => {
    if (loading) return;

    if (user?._id) {
      // ONLY connect if we aren't already connected
      if (!socket.connected) {
        socket.io.opts.query = { userId: user._id };
        socket.connect();
      }
    } else {
      // ONLY disconnect if we are currently connected
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user?._id, loading]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};