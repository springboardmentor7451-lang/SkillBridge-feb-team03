const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markMessagesAsRead,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// All message routes require authentication
router.post("/", protect, sendMessage);
router.get("/conversation/:conversationId", protect, getMessages);
router.put("/conversation/:conversationId/read", protect, markMessagesAsRead);

module.exports = router;