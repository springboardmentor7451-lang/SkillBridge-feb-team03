const User = require("../models/user");
const Rating = require("../models/rating");
const Connection = require("../models/connection");
const Opportunity = require("../models/opportunity");

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const parseCommaValues = (value) =>
  String(value || "")
    .split(",")
    .map((item) => normalizeText(item))
    .filter(Boolean);

// Get NGOs for volunteers to browse with match scores
exports.getNGOs = async (req, res) => {
  try {
    const volunteerId = req.user;
    const {
      search,
      location,
      sortBy = "newest",
      limit = 20,
      offset = 0,
    } = req.query;

    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const volunteerLocationTokens = parseCommaValues(volunteer.location);
    const volunteerSkills = (volunteer.skills || [])
      .map((skill) => normalizeText(skill))
      .filter(Boolean);

    // Build query
    let query = { role: "ngo" };

    if (search) {
      query.$or = [
        { organization_name: new RegExp(search, "i") },
        { organization_description: new RegExp(search, "i") },
      ];
    }

    if (location) {
      const locationTokens = parseCommaValues(location);
      query.location = {
        $regex: locationTokens.map((token) => `(?=.*${token})`).join(""),
        $options: "i",
      };
    }

    // Fetch all NGOs
    const allNgos = await User.find(query)
      .select(
        "_id name organization_name organization_description location email website_url profile_picture_url"
      )
      .lean();

    // Calculate match scores for each NGO
    const ngosWithScores = await Promise.all(
      allNgos.map(async (ngo) => {
        // Get opportunities for this NGO
        const opportunities = await Opportunity.find({
          ngo_id: ngo._id,
          status: "open",
        }).lean();

        let totalMatch = 0;
        let matchedSkills = [];

        if (opportunities.length > 0) {
          // Calculate average match score across all opportunities
          const scores = opportunities.map((opp) => {
            const requiredSkills = (opp.required_skills || [])
              .map((skill) => normalizeText(skill))
              .filter(Boolean);

            const matched = requiredSkills.filter((requiredSkill) =>
              volunteerSkills.some((userSkill) => userSkill === requiredSkill)
            );

            matchedSkills.push(...matched);

            return requiredSkills.length > 0
              ? (matched.length / requiredSkills.length) * 100
              : 0;
          });

          totalMatch = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        // Get average rating
        const ratings = await Rating.find({ toUser: ngo._id }).lean();
        const avgRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
              ).toFixed(1)
            : 0;

        // Check connection status
        const connection = await Connection.findOne({
          fromUser: volunteerId,
          toUser: ngo._id,
        }).lean();

        return {
          ...ngo,
          matchScore: totalMatch,
          matchedSkills: [...new Set(matchedSkills)],
          averageRating: avgRating,
          ratingCount: ratings.length,
          isConnected: connection ? connection.status === "connected" : false,
          connectionPending: connection ? connection.status === "pending" : false,
        };
      })
    );

    // Sort NGOs
    let sorted = ngosWithScores;
    switch (sortBy) {
      case "matchScore":
        sorted = sorted.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case "rating":
        sorted = sorted.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "oldest":
        sorted = sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "newest":
      default:
        sorted = sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Paginate
    const paginatedNgos = sorted.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      data: paginatedNgos,
      total: sorted.length,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({ message: "Server error while fetching NGOs" });
  }
};

// Get Volunteers for NGOs to browse with match scores
exports.getVolunteers = async (req, res) => {
  try {
    const ngoId = req.user;
    const {
      search,
      location,
      skills,
      sortBy = "newest",
      limit = 20,
      offset = 0,
    } = req.query;

    const ngo = await User.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Build query
    let query = { role: "volunteer" };

    if (search) {
      query.name = new RegExp(search, "i");
    }

    if (location) {
      const locationTokens = parseCommaValues(location);
      query.location = {
        $regex: locationTokens.map((token) => `(?=.*${token})`).join(""),
        $options: "i",
      };
    }

    // Fetch all volunteers
    const allVolunteers = await User.find(query)
      .select("_id name bio location email skills profile_picture_url")
      .lean();

    // Calculate match scores for each volunteer
    const volunteersWithScores = await Promise.all(
      allVolunteers.map(async (volunteer) => {
        const volunteerSkills = (volunteer.skills || [])
          .map((skill) => normalizeText(skill))
          .filter(Boolean);

        // Get this NGO's open opportunities
        const opportunities = await Opportunity.find({
          ngo_id: ngoId,
          status: "open",
        }).lean();

        let totalMatch = 0;
        let matchedSkills = [];

        if (opportunities.length > 0) {
          // Calculate average match score across all opportunities
          const scores = opportunities.map((opp) => {
            const requiredSkills = (opp.required_skills || [])
              .map((skill) => normalizeText(skill))
              .filter(Boolean);

            const matched = requiredSkills.filter((requiredSkill) =>
              volunteerSkills.some((userSkill) => userSkill === requiredSkill)
            );

            matchedSkills.push(...matched);

            return requiredSkills.length > 0
              ? (matched.length / requiredSkills.length) * 100
              : 0;
          });

          totalMatch = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        // Apply skills filter if provided
        if (skills) {
          const filterSkills = parseCommaValues(skills);
          const hasSkills = filterSkills.some((skill) =>
            volunteerSkills.includes(normalizeText(skill))
          );
          if (!hasSkills) return null;
        }

        // Get average rating
        const ratings = await Rating.find({ toUser: volunteer._id }).lean();
        const avgRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
              ).toFixed(1)
            : 0;

        // Check connection status
        const connection = await Connection.findOne({
          fromUser: ngoId,
          toUser: volunteer._id,
        }).lean();

        return {
          ...volunteer,
          matchScore: totalMatch,
          matchedSkills: [...new Set(matchedSkills)],
          averageRating: avgRating,
          ratingCount: ratings.length,
          isConnected: connection ? connection.status === "connected" : false,
          connectionPending: connection ? connection.status === "pending" : false,
        };
      })
    );

    // Filter out nulls
    let filtered = volunteersWithScores.filter((v) => v !== null);

    // Sort volunteers
    let sorted = filtered;
    switch (sortBy) {
      case "matchScore":
        sorted = sorted.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case "rating":
        sorted = sorted.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "oldest":
        sorted = sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "newest":
      default:
        sorted = sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Paginate
    const paginatedVolunteers = sorted.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      data: paginatedVolunteers,
      total: sorted.length,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Server error while fetching volunteers" });
  }
};

// Get detailed user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get ratings
    const ratings = await Rating.find({ toUser: userId }).populate(
      "fromUser",
      "name role"
    );

    // Get average rating
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    // Check connection status
    const connection =
      currentUserId &&
      (await Connection.findOne({
        $or: [
          { fromUser: currentUserId, toUser: userId },
          { fromUser: userId, toUser: currentUserId },
        ],
      }));

    // Get opportunities count (if NGO)
    let opportunitiesCount = 0;
    if (user.role === "ngo") {
      opportunitiesCount = await Opportunity.countDocuments({ ngo_id: userId, status: "open" });
    }

    res.json({
      user,
      ratings,
      averageRating: avgRating,
      ratingCount: ratings.length,
      opportunitiesCount,
      connectionStatus: connection ? connection.status : null,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// Create or update connection
exports.createConnection = async (req, res) => {
  try {
    const fromUserId = req.user;
    const { toUserId, message } = req.body;

    if (!toUserId) {
      return res.status(400).json({ message: "toUserId is required" });
    }

    // Check if users exist
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if connection already exists
    let connection = await Connection.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
    });

    if (connection) {
      if (connection.status === "connected") {
        return res.status(400).json({ message: "Already connected" });
      }
      // Update existing pending connection
      connection.message = message || "";
      await connection.save();
    } else {
      // Create new connection
      connection = new Connection({
        fromUser: fromUserId,
        toUser: toUserId,
        message: message || "",
        status: "pending",
      });
      await connection.save();
    }

    res.status(201).json({
      message: "Connection request sent",
      connection,
    });
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ message: "Server error while creating connection" });
  }
};

// Accept connection
exports.acceptConnection = async (req, res) => {
  try {
    const userId = req.user;
    const { fromUserId } = req.params;

    const connection = await Connection.findOne({
      fromUser: fromUserId,
      toUser: userId,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connection.status = "connected";
    await connection.save();

    res.json({
      message: "Connection accepted",
      connection,
    });
  } catch (error) {
    console.error("Error accepting connection:", error);
    res.status(500).json({ message: "Server error while accepting connection" });
  }
};

// Get all connections for current user
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user;
    const { status = "connected" } = req.query;

    const connections = await Connection.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
      status,
    }).populate("fromUser toUser", "name email organization_name");

    res.json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Server error while fetching connections" });
  }
};

// Create rating/review
exports.createRating = async (req, res) => {
  try {
    const fromUserId = req.user;
    const { toUserId, rating, feedback, opportunityId } = req.body;

    if (!toUserId || !rating) {
      return res.status(400).json({ message: "toUserId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if users exist
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if rating already exists (update if it does)
    let ratingDoc = await Rating.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
    });

    if (ratingDoc) {
      ratingDoc.rating = rating;
      ratingDoc.feedback = feedback || "";
      ratingDoc.opportunityId = opportunityId || null;
      await ratingDoc.save();
    } else {
      ratingDoc = new Rating({
        fromUser: fromUserId,
        toUser: toUserId,
        rating,
        feedback: feedback || "",
        opportunityId: opportunityId || null,
      });
      await ratingDoc.save();
    }

    return res.status(201).json({
      message: "Rating submitted successfully",
      rating: ratingDoc,
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ message: "Server error while creating rating" });
  }
};

// Get ratings for a user
exports.getRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ toUser: userId })
      .populate("fromUser", "name role organization_name")
      .sort({ createdAt: -1 });

    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    res.json({
      ratings,
      averageRating: avgRating,
      ratingCount: ratings.length,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error while fetching ratings" });
  }
};
