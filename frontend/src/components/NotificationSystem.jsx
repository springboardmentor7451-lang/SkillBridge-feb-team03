import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import socketService from "../services/socketService";
import { toast } from "sonner";

export default function NotificationSystem() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socketService.connect(user._id);

    const handleMessage = (data) => {
      toast.info("New message", {
        description: data?.content || "You received a new message.",
      });
    };

    const handleNotification = (data) => {
      toast(data?.title || "New notification", {
        description: data?.message || "You have a new update.",
      });
    };

    socketService.onNewMessage(handleMessage);
    socketService.onNotification(handleNotification);

    return () => {
      socketService.off("newMessage", handleMessage);
      socketService.off("notification", handleNotification);
      socketService.disconnect();
    };
  }, [user]);

  return null;
}
