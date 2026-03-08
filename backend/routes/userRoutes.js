const express = require("express");
const router = express.Router();
const { getMe, updateMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;
