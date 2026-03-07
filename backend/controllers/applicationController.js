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

    // Create notification for NGO
    try {
      const { createNotification } = require("./notificationController");
      const ngo = await User.findById(opportunity.ngo_id);
      const ngoId = ngo?._id;
      
      await createNotification({
        user_id: ngoId,
        type: "application_received",
        title: "New Application Received 📋",
        message: `${volunteer.name} applied for "${opportunity.title}"`,
        related_user_id: volunteer_id,
        opportunity_id: opportunity._id,
        application_id: application._id,
        action_url: `/applications`,
      });

      // Emit notification via socket
      const { io } = require("../server");
      io.to(ngoId.toString()).emit('notification', {
        type: 'application_received',
        title: 'New Application Received 📋',
        message: `${volunteer.name} applied for "${opportunity.title}"`,
        timestamp: new Date()
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

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
    const volunteer_id = req.user;
    const applications = await Application.find({ volunteer_id })
      .populate("opportunity_id")
      .populate("volunteer_id", "name email")
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
    ).populate("opportunity_id");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    console.log("Updating application", applicationId, "to status", status);

    // Create notification for volunteer
    try {
      const { createNotification } = require("./notificationController");
      const ngo = await User.findById(req.user);
      const ngoName = ngo?.organization_name || ngo?.name || "An NGO";
      const opportunityTitle = application.opportunity_id?.title || "an opportunity";

      let notificationTitle, notificationMessage;
      if (status === "accepted") {
        notificationTitle = "Application Accepted! 🎉";
        notificationMessage = `${ngoName} accepted your application for "${opportunityTitle}"`;
      } else if (status === "rejected") {
        notificationTitle = "Application Rejected";
        notificationMessage = `${ngoName} rejected your application for "${opportunityTitle}"`;
      }

      if (notificationTitle) {
        await createNotification({
          user_id: application.volunteer_id,
          type: status === "accepted" ? "application_accepted" : "application_rejected",
          title: notificationTitle,
          message: notificationMessage,
          related_user_id: req.user,
          opportunity_id: application.opportunity_id._id,
          application_id: application._id,
          action_url: `/applications`,
        });

        // Emit notification via socket
        const { io } = require("../server");
        io.to(application.volunteer_id.toString()).emit('notification', {
          type: status === "accepted" ? "application_accepted" : "application_rejected",
          title: notificationTitle,
          message: notificationMessage,
          timestamp: new Date()
        });
      }
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    // If application is accepted, create a conversation
    let conversation = null;
    if (status === "accepted") {
      try {
        const { createConversation } = require("./conversationController");
        conversation = await createConversation(applicationId);
        console.log("Conversation created/retrieved:", conversation?._id);
      } catch (convError) {
        console.error("Failed to create conversation:", convError);
        // Don't fail the entire request if conversation creation fails
      }
    }

    res.json({
      message: "Application status updated",
      application,
      conversation: conversation ? { _id: conversation._id } : null,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res
      .status(500)
      .json({ message: "Error updating application", error });
  }
};
