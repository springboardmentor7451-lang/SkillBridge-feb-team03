const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["message", "application_accepted", "application_rejected", "application_received", "opportunity_match"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Related data
    related_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
    },

    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },

    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    is_read: {
      type: Boolean,
      default: false,
      index: true,
    },

    action_url: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for efficient querying of unread notifications
notificationSchema.index({ user_id: 1, is_read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
