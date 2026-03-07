import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import socketService from "../services/socketService";

export default function NotificationSystem() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      // Connect to socket for real-time notifications
      socketService.connect(user._id);

      // Listen for new messages
      socketService.onNewMessage((data) => {
        const notification = {
          id: Date.now(),
          type: 'message',
          title: 'New Message',
          message: `You have a new message in your conversation`,
          timestamp: new Date(),
          read: false
        };
        addNotification(notification);
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 most recent

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${notification.read ? 'read' : 'unread'}`}
        >
          <div className="notification-content">
            <div className="notification-title">{notification.title}</div>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
          <div className="notification-actions">
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="notification-btn"
              >
                ✓
              </button>
            )}
            <button
              onClick={() => dismissNotification(notification.id)}
              className="notification-btn"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}