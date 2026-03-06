const express = require("express");
const router = express.Router();
const {
  createOpportunity,
  getMyOpportunities,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// Create opportunity (NGO only)
router.post("/", protect, authorizeRole("ngo"), createOpportunity);

// Get all opportunities (public)
router.get("/", getAllOpportunities);

// Get single opportunity
router.get("/:id", getOpportunityById);

// Get logged-in NGO's opportunities
router.get("/my", protect, getMyOpportunities);

// Update opportunity (NGO owner only)
router.put("/:id", protect, authorizeRole("ngo"), updateOpportunity);

// Delete opportunity (NGO owner only)
router.delete("/:id", protect, authorizeRole("ngo"), deleteOpportunity);

module.exports = router;
