import api from "./api";

const notificationService = {
  // Get all notifications
  getNotifications: async (limit = 20, skip = 0) => {
    return api.get(`/notifications?limit=${limit}&skip=${skip}`);
  },

  // Get unread count
  getUnreadCount: async () => {
    return api.get("/notifications/unread/count");
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: async () => {
    return api.put("/notifications/read/all");
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;
