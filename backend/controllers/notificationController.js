const Notification = require("../models/notification");
const User = require("../models/user");
const mongoose = require("mongoose");

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user;
    const { limit = 20, skip = 0 } = req.query;

    const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
      ? new mongoose.Types.ObjectId(user_id)
      : user_id;

    const notifications = await Notification.find({ user_id: userObjectId })
      .populate("related_user_id", "name email organization_name")
      .populate("opportunity_id", "title")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments({ user_id: userObjectId });
    const unread = await Notification.countDocuments({
      user_id: userObjectId,
      is_read: false,
    });

    res.json({
      message: "Notifications retrieved successfully",
      notifications,
      total,
      unread,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const user_id = req.user;

    const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
      ? new mongoose.Types.ObjectId(user_id)
      : user_id;

    const unread = await Notification.countDocuments({
      user_id: userObjectId,
      is_read: false,
    });

    res.json({
      unread,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Error fetching unread count", error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user_id = req.user;

    const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
      ? new mongoose.Types.ObjectId(user_id)
      : user_id;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user_id: userObjectId,
      },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Error marking notification as read", error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user;

    const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
      ? new mongoose.Types.ObjectId(user_id)
      : user_id;

    const result = await Notification.updateMany(
      { user_id: userObjectId, is_read: false },
      { is_read: true }
    );

    res.json({
      message: "All notifications marked as read",
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Error marking notifications as read", error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user_id = req.user;

    const userObjectId = mongoose.Types.ObjectId.isValid(user_id)
      ? new mongoose.Types.ObjectId(user_id)
      : user_id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user_id: userObjectId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
};

// Create notification (helper function for other controllers)
exports.createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
  }
};
