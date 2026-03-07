import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import notificationService from "../services/notificationService";
import socketService from "../services/socketService";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Notifications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, message, application

  useEffect(() => {
    if (!loading && user) {
      fetchNotifications();
      fetchUnreadCount();

      // Listen for real-time notifications
      socketService.onNotification(handleNewNotification);
    }
  }, [user, loading]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data.unread);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleNewNotification = (data) => {
    console.log("New notification received:", data);
    fetchNotifications();
    fetchUnreadCount();
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(n => n._id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      handleMarkAsRead(notification._id, { stopPropagation: () => {} });
    }

    // Navigate to the relevant page
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.is_read;
    if (filter === "message") return notif.type === "message";
    if (filter === "application") return ["application_accepted", "application_rejected", "application_received"].includes(notif.type);
    return true;
  });

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

  const getNotificationColor = (type) => {
    switch (type) {
      case "message":
        return "#007bff";
      case "application_accepted":
        return "#28a745";
      case "application_rejected":
        return "#dc3545";
      case "application_received":
        return "#ff9800";
      case "opportunity_match":
        return "#6f42c1";
      default:
        return "#6c757d";
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

  if (loading) return (<><Navbar /><div className="dashboard-wrapper"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-wrapper"><p>Please login first</p></div></>);

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div>
            <h1>Notifications</h1>
            <p className="breadcrumb">SkillBridge / Notifications</p>
          </div>
        </div>

        <div className="notifications-container">
          {/* Header with actions */}
          <div className="notifications-header">
            <div className="notifications-title">
              <h2>All Notifications</h2>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} new</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="btn-mark-all">
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="notification-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-btn ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-btn ${filter === "message" ? "active" : ""}`}
              onClick={() => setFilter("message")}
            >
              Messages
            </button>
            <button
              className={`filter-btn ${filter === "application" ? "active" : ""}`}
              onClick={() => setFilter("application")}
            >
              Applications
            </button>
          </div>

          {/* Notifications List */}
          {loadingNotifications ? (
            <p>Loading notifications...</p>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-icon">🔔</div>
              <p>
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "message"
                    ? "No messages"
                    : filter === "application"
                      ? "No applications"
                      : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-card ${!notification.is_read ? "unread" : "read"}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    borderLeftColor: getNotificationColor(notification.type),
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notification.title}</h3>
                      <span className="notification-time">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    {notification.related_user_id?.name && (
                      <p className="notification-related">
                        From: {notification.related_user_id.organization_name || notification.related_user_id.name}
                      </p>
                    )}
                  </div>

                  <div className="notification-actions">
                    {!notification.is_read && (
                      <button
                        className="action-btn"
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={(e) => handleDeleteNotification(notification._id, e)}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
