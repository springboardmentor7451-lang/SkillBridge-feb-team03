const express = require("express");
const router = express.Router();
const {
	register,
	login,
	verifyEmail,
	resendVerification,
	forgotPassword,
	resetPassword,
	verifyEmailChange,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email-change", verifyEmailChange);

module.exports = router;
