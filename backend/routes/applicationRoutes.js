const express = require("express");
const router = express.Router();
const {
  applyToOpportunity,
  getMyApplications,
  getOpportunityApplications,
  getNGOApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// Volunteer routes
router.post("/", protect, authorizeRole("volunteer"), applyToOpportunity);
router.get("/my", protect, getMyApplications);

// NGO routes
router.get(
  "/ngo",
  protect,
  authorizeRole("ngo"),
  getNGOApplications
);
router.get(
  "/opportunity/:opportunityId",
  protect,
  authorizeRole("ngo"),
  getOpportunityApplications
);
router.put(
  "/:applicationId",
  protect,
  authorizeRole("ngo"),
  updateApplicationStatus
);

module.exports = router;
