const express = require("express");
const router = express.Router();
const {
  applyToOpportunity,
  getMyApplications,
  getOpportunityApplications,
  getNGOApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// Volunteer routes
router.post("/", protect, authorizeRole("volunteer"), applyToOpportunity);
router.get("/my", protect, getMyApplications);
router.delete("/:applicationId/withdraw", protect, authorizeRole("volunteer"), withdrawApplication);

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
