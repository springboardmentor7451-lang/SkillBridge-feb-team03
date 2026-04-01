import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notificationService";
import socketService from "../services/socketService";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchRecentNotifications();

      // Listen for real-time notifications
      const handleNotification = () => {
        fetchUnreadCount();
        fetchRecentNotifications();
      };

      socketService.onNotification(handleNotification);

      return () => {
        socketService.off("new_notification", handleNotification);
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data.unread);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const res = await notificationService.getNotifications(5);
      setRecentNotifications(res.data.notifications);
    } catch (error) {
      console.error("Failed to fetch recent notifications:", error);
    }
  };

  const handleViewAll = () => {
    navigate("/notifications");
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      notificationService.markAsRead(notification._id);
      setUnreadCount(Math.max(0, unreadCount - 1));
    }

    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return "💬";
      case "application_accepted":
        return "✅";
      case "application_rejected":
        return "❌";
      case "application_received":
        return "📋";
      case "opportunity_match":
        return "🎯";
      default:
        return "🔔";
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && <span className="text-xs font-semibold text-orange-700">{unreadCount} new</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-slate-500">No notifications yet.</div>
        ) : (
          recentNotifications.map((notif) => (
            <DropdownMenuItem
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className="flex items-start gap-3 py-2"
            >
              <span className="mt-0.5 text-base">{getNotificationIcon(notif.type)}</span>
              <div className="flex-1 space-y-0.5">
                <p className="line-clamp-1 text-sm font-semibold text-slate-800">{notif.title}</p>
                <p className="line-clamp-2 text-xs text-slate-600">{notif.message}</p>
              </div>
              {!notif.is_read && <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewAll} className="justify-center font-semibold text-slate-700">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
