const express = require("express");
const browseController = require("../controllers/browseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get NGOs for volunteers
router.get("/ngos", protect, browseController.getNGOs);

// Get volunteers for NGOs
router.get("/volunteers", protect, browseController.getVolunteers);

// Get user profile with ratings
router.get("/profile/:userId", browseController.getUserProfile);

// Connection endpoints
router.post("/connect", protect, browseController.createConnection);
router.put("/connect/:fromUserId", protect, browseController.acceptConnection);
router.get("/connections", protect, browseController.getConnections);

// Rating endpoints
router.post("/rate", protect, browseController.createRating);
router.get("/ratings/:userId", browseController.getRatings);

module.exports = router;
