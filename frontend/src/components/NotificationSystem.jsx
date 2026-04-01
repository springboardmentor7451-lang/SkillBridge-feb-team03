import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import socketService from "../services/socketService";
import { toast } from "sonner";

export default function NotificationSystem() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const handleMessage = (data) => {
      toast.info("New message", {
        description: data?.message?.content || data?.content || "You received a new message.",
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
      socketService.off("receive_message", handleMessage);
      socketService.off("new_notification", handleNotification);
    };
  }, [user]);

  return null;
}
