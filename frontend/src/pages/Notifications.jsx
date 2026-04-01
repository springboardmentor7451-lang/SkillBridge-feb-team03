import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import notificationService from "../services/notificationService";
import socketService from "../services/socketService";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function Notifications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!loading && user) {
      fetchNotifications();
      fetchUnreadCount();
      socketService.onNotification(handleNewNotification);
    }

    return () => {
      socketService.off("new_notification", handleNewNotification);
    };
  }, [user, loading]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data.unread || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleNewNotification = () => {
    fetchNotifications();
    fetchUnreadCount();
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification._id, { stopPropagation: () => {} });
    }

    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.is_read;
    if (filter === "message") return notif.type === "message";
    if (filter === "application") {
      return ["application_accepted", "application_rejected", "application_received"].includes(notif.type);
    }
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return "Message";
      case "application_accepted":
        return "Accepted";
      case "application_rejected":
        return "Rejected";
      case "application_received":
        return "Application";
      case "opportunity_match":
        return "Match";
      default:
        return "Notice";
    }
  };

  const getNotificationTone = (type) => {
    switch (type) {
      case "message":
        return "border-sky-200 bg-sky-50/70";
      case "application_accepted":
        return "border-emerald-200 bg-emerald-50/70";
      case "application_rejected":
        return "border-rose-200 bg-rose-50/70";
      case "application_received":
        return "border-amber-200 bg-amber-50/70";
      case "opportunity_match":
        return "border-violet-200 bg-violet-50/70";
      default:
        return "border-slate-200 bg-white";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading notifications...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Please login first.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-600">Track new messages, application updates, and opportunity matches.</p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{notifications.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">{unreadCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Read</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{notifications.length - unreadCount}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === "all" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === "unread" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("message")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === "message" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
              >
                Messages
              </button>
              <button
                onClick={() => setFilter("application")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === "application" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
              >
                Applications
              </button>
            </div>

            {unreadCount > 0 && <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>}
          </div>

          {loadingNotifications ? (
            <p className="text-sm text-slate-600">Loading notifications...</p>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
              <p>
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "message"
                    ? "No message notifications"
                    : filter === "application"
                      ? "No application notifications"
                      : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`cursor-pointer rounded-xl border p-4 transition hover:shadow-sm ${notification.is_read ? "border-slate-200 bg-white" : `${getNotificationTone(notification.type)}`}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-900/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                          {getNotificationIcon(notification.type)}
                        </span>
                        {!notification.is_read && (
                          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-slate-900">{notification.title}</h3>
                      <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
                      {notification.related_user_id?.name && (
                        <p className="mt-1 text-xs text-slate-500">
                          From: {notification.related_user_id.organization_name || notification.related_user_id.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{formatTime(notification.createdAt)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {!notification.is_read && (
                      <Button size="sm" variant="secondary" onClick={(e) => handleMarkAsRead(notification._id, e)}>
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={(e) => handleDeleteNotification(notification._id, e)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
