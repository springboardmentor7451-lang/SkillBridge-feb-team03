const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Get unread notification count (MUST be before /:notificationId routes)
router.get("/unread/count", protect, getUnreadCount);

// Get all notifications for user
router.get("/", protect, getNotifications);

// Mark all as read
router.put("/read/all", protect, markAllAsRead);

// Mark notification as read
router.put("/:notificationId/read", protect, markAsRead);

// Delete notification
router.delete("/:notificationId", protect, deleteNotification);

module.exports = router;

