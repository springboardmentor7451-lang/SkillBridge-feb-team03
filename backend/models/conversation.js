const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // The opportunity this conversation is about
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },

    // The application that led to this conversation
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    // The two participants
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Conversation status
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // Last message info for quick display
    last_message: {
      content: String,
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

// Index for efficient queries
conversationSchema.index({ ngo_id: 1, volunteer_id: 1, opportunity_id: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);