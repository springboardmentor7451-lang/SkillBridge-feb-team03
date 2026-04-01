import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import socketService from "../services/socketService";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    socketService.connect(user._id, token);

    return () => {
      socketService.disconnect();
    };
  }, [user?._id, token]);

  return <SocketContext.Provider value={socketService}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}
