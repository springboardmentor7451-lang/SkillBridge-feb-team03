const express = require("express");
const router = express.Router();
const {
  getMatchedOpportunities,
  getVolunteersForOpportunity,
} = require("../controllers/matchingController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// Milestone 4 contract routes
router.get("/opportunities", protect, authorizeRole("volunteer"), getMatchedOpportunities);
router.get("/volunteers/:opportunityId", protect, authorizeRole("ngo"), getVolunteersForOpportunity);

module.exports = router;
