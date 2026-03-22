const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Message status
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    // Message type (for future extensions like images, files)
    message_type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    attachment_name: {
      type: String,
      default: "",
    },

    attachment_type: {
      type: String,
      default: "",
    },

    attachment_data_url: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for efficient queries
messageSchema.index({ conversation_id: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);