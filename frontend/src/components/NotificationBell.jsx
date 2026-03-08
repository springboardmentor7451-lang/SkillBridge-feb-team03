import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notificationService";
import socketService from "../services/socketService";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchRecentNotifications();

      // Listen for real-time notifications
      socketService.onNotification(() => {
        fetchUnreadCount();
        fetchRecentNotifications();
      });
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
    setIsOpen(false);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      notificationService.markAsRead(notification._id);
      setUnreadCount(Math.max(0, unreadCount - 1));
    }

    if (notification.action_url) {
      navigate(notification.action_url);
    }
    setIsOpen(false);
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
    <div className="notification-bell-container">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="unread-badge-small">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="unread-count">{unreadCount} new</span>}
          </div>

          <div className="notifications-preview">
            {recentNotifications.length === 0 ? (
              <div className="empty-preview">
                <p>No notifications</p>
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`preview-item ${!notif.is_read ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <span className="preview-icon">{getNotificationIcon(notif.type)}</span>
                  <div className="preview-content">
                    <p className="preview-title">{notif.title}</p>
                    <p className="preview-message">{notif.message.substring(0, 50)}...</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="dropdown-footer">
            <button onClick={handleViewAll} className="view-all-btn">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
