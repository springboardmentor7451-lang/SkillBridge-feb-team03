const express = require("express");
const router = express.Router();
const {
  getMatchSuggestions,
  getVolunteerMatches,
} = require("../controllers/matchingController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// Get match suggestions for volunteers
router.get("/suggestions", protect, authorizeRole("volunteer"), getMatchSuggestions);

// Get volunteer matches for NGOs
router.get("/volunteers", protect, authorizeRole("ngo"), getVolunteerMatches);

module.exports = router;