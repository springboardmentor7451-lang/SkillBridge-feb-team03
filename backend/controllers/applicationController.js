const Application = require("../models/application");
const Opportunity = require("../models/opportunity");
const User = require("../models/user");
const mongoose = require("mongoose");

// Apply to an opportunity
exports.applyToOpportunity = async (req, res) => {
  try {
    const { opportunity_id, cover_letter } = req.body;
    const volunteer_id = req.user;

    console.log("Apply request:", { opportunity_id, volunteer_id, cover_letter });

    // Validate opportunity_id
    if (!opportunity_id || !mongoose.Types.ObjectId.isValid(opportunity_id)) {
      console.log("Invalid opportunity_id:", opportunity_id);
      return res.status(400).json({ message: "Invalid opportunity ID" });
    }

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) {
      console.log("Opportunity not found:", opportunity_id);
      return res.status(404).json({ message: "Opportunity not found" });
    }

    console.log("Opportunity found:", opportunity._id);

    // Check if already applied
    const existingApp = await Application.findOne({
      opportunity_id,
      volunteer_id,
    });
    if (existingApp) {
      console.log("Already applied:", existingApp._id);
      return res
        .status(400)
        .json({ message: "You have already applied to this opportunity" });
    }

    // Get volunteer details
    const volunteer = await User.findById(volunteer_id);
    if (!volunteer) {
      console.log("Volunteer not found:", volunteer_id);
      return res.status(404).json({ message: "Volunteer not found" });
    }

    console.log("Creating application for volunteer:", volunteer.name);

    // Create application
    const application = new Application({
      opportunity_id,
      volunteer_id,
      status: "pending",
      applicant_name: volunteer.name,
      applicant_email: volunteer.email,
      cover_letter: cover_letter || "",
    });

    await application.save();
    console.log("Application saved:", application._id);

    // Add application to opportunity's applicants array
    if (!opportunity.applicants) {
      opportunity.applicants = [];
    }
    opportunity.applicants.push({
      volunteer_id,
      application_id: application._id,
      status: "pending",
    });
    await opportunity.save();
    console.log("Opportunity updated with applicant");

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Error submitting application", error: error.message });
  }
};

// Get volunteer's applications
exports.getMyApplications = async (req, res) => {
  try {
    const volunteer_id = req.user.id;
    const applications = await Application.find({ volunteer_id })
      .populate("opportunity_id")
      .sort({ applied_date: -1 });

    res.json({
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

// Get opportunity applications (NGO only)
exports.getOpportunityApplications = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const applications = await Application.find({
      opportunity_id: opportunityId,
    }).populate("volunteer_id", "name email skills");

    res.json({
      applications,
    });
  } catch (error) {
    console.error("Get opportunity applications error:", error);
    res
      .status(500)
      .json({ message: "Error fetching applications", error });
  }
};

// Get all applications for NGO's opportunities
exports.getNGOApplications = async (req, res) => {
  try {
    const ngo_id = req.user;

    // First get all opportunities for this NGO
    const opportunities = await Opportunity.find({ ngo_id });
    const opportunityIds = opportunities.map(opp => opp._id);

    // Then get all applications for these opportunities
    const applications = await Application.find({
      opportunity_id: { $in: opportunityIds }
    })
    .populate("opportunity_id", "title location duration")
    .populate("volunteer_id", "name email skills")
    .sort({ applied_date: -1 });

    res.json({
      applications,
    });
  } catch (error) {
    console.error("Get NGO applications error:", error);
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

// Update application status (NGO only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res
      .status(500)
      .json({ message: "Error updating application", error });
  }
};
