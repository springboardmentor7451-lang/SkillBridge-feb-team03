const Opportunity = require("../models/opportunity");

// Create Opportunity (NGO only)
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, required_skills, duration, location } = req.body;

    // Validate required fields
    if (!title || !description || !duration || !location) {
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
      location,
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

    res.json({
      message: "Opportunities retrieved successfully",
      opportunities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all opportunities
exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate(
      "ngo_id",
      "organization_name location"
    );

    res.json({
      message: "All opportunities retrieved",
      opportunities,
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
    if (location) opportunity.location = location;
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
