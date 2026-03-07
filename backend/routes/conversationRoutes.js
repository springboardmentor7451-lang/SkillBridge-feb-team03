const express = require("express");
const router = express.Router();
const {
  getUserConversations,
  getConversation,
  closeConversation,
} = require("../controllers/conversationController");
const { protect } = require("../middleware/authMiddleware");

// All conversation routes require authentication
router.get("/", protect, getUserConversations);
router.get("/:conversationId", protect, getConversation);
router.put("/:conversationId/close", protect, closeConversation);

module.exports = router;