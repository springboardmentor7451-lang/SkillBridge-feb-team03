const express = require("express");
const router = express.Router();
const { getMe, updateMe, changePassword, requestEmailChange, deleteMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/me/password", protect, changePassword);
router.post("/me/email-request", protect, requestEmailChange);
router.delete("/me", protect, deleteMe);

module.exports = router;
