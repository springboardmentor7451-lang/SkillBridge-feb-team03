import express from "express";
import { getMyProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET logged in user profile
router.get("/me", protect, getMyProfile);

export default router;