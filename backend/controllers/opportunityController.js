const Opportunity = require("../models/opportunity");
const Application = require("../models/application");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeCommaInput = (value = "") =>
  String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");

// Create Opportunity (NGO only)
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, required_skills, duration, location, status } = req.body;
    const normalizedLocation = normalizeCommaInput(location);

    // Validate required fields
    if (!title || !description || !duration || !normalizedLocation) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const opportunity = new Opportunity({
      ngo_id: req.user,
      title,
      description,
      required_skills: required_skills || [],
      duration,
      location: normalizedLocation,
      status: status === "closed" ? "closed" : "open",
    });

    await opportunity.save();

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in NGO's opportunities
exports.getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ ngo_id: req.user });

    const opportunityIds = opportunities.map((opp) => opp._id);
    let applicationCounts = [];

    if (opportunityIds.length > 0) {
      applicationCounts = await Application.aggregate([
        { $match: { opportunity_id: { $in: opportunityIds } } },
        { $group: { _id: "$opportunity_id", count: { $sum: 1 } } }
      ]);
    }

    const countsMap = new Map(
      applicationCounts.map((item) => [item._id.toString(), item.count])
    );

    const opportunitiesWithCounts = opportunities.map((opp) => {
      const countFromApplications = countsMap.get(opp._id.toString()) || 0;
      const countFromEmbedded = Array.isArray(opp.applicants) ? opp.applicants.length : 0;
      return {
        ...opp.toObject(),
        applicant_count: Math.max(countFromApplications, countFromEmbedded),
      };
    });

    res.json({
      message: "Opportunities retrieved successfully",
      opportunities: opportunitiesWithCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all opportunities
exports.getAllOpportunities = async (req, res) => {
  try {
    const { skills, location, duration, status } = req.query;

    let filter = {};
    const parsedStatus = (status || "all").toString().trim().toLowerCase();

    // Filter by status
    if (parsedStatus === "open" || parsedStatus === "closed") {
      filter.status = parsedStatus;
    }

    // Filter by location (case-insensitive partial match)
    if (location && location.trim()) {
      const locationTokens = location
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (locationTokens.length > 0) {
        filter.$or = locationTokens.map((token) => ({
          location: {
            $regex: `(^|,\\s*)${escapeRegex(token)}(\\s*,|$)`,
            $options: "i",
          },
        }));
      }
    }

    // Filter by duration (accepts both singular/plural wording)
    if (duration && duration.trim()) {
      const durationKey = duration.trim().toLowerCase();
      const durationPatternMap = {
        "1 week": /^\s*1\s*week(s)?\s*$/i,
        "1 month": /^\s*1\s*month(s)?\s*$/i,
        "3 month": /^\s*3\s*month(s)?\s*$/i,
        "6 month": /^\s*6\s*month(s)?\s*$/i,
        "1 year": /^\s*1\s*year(s)?\s*$/i,
      };

      filter.duration = durationPatternMap[durationKey]
        ? { $regex: durationPatternMap[durationKey] }
        : { $regex: `^${duration.trim()}$`, $options: "i" };
    }

    // Filter by skills (opportunities that have at least one of the specified skills)
    if (skills && skills.trim()) {
      const skillArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      if (skillArray.length > 0) {
        filter.required_skills = {
          $in: skillArray.map((skill) => new RegExp(`^\\s*${escapeRegex(skill)}\\s*$`, "i")),
        };
      }
    }

    console.log('Opportunity filter:', filter);

    const opportunities = await Opportunity.find(filter).populate(
      "ngo_id",
      "name email location organization_name organization_description website_url"
    );

    res.json({
      message: "Opportunities retrieved successfully",
      opportunities,
      filter: {
        skills: skills || '',
        location: location || '',
        duration: duration || '',
        status: parsedStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single opportunity by ID
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "organization_name location contact_email"
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Opportunity (NGO only - owner)
exports.updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if user is the owner
    if (opportunity.ngo_id.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this opportunity",
      });
    }

    // Allowed fields to update
    const { title, description, required_skills, duration, location, status } =
      req.body;

    if (title) opportunity.title = title;
    if (description) opportunity.description = description;
    if (required_skills) opportunity.required_skills = required_skills;
    if (duration) opportunity.duration = duration;
    if (location !== undefined) {
      opportunity.location = normalizeCommaInput(location);
    }
    if (status) opportunity.status = status;

    await opportunity.save();

    res.json({
      message: "Opportunity updated successfully",
      opportunity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Opportunity (NGO only - owner)
exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if user is the owner
    if (opportunity.ngo_id.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this opportunity",
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    res.json({
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
