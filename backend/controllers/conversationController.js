const mongoose = require("mongoose");
const Conversation = require("../models/conversation");
const Application = require("../models/application");
const Opportunity = require("../models/opportunity");
const User = require("../models/user");

// Create conversation when application is accepted
exports.createConversation = async (applicationId) => {
  try {
    const application = await Application.findById(applicationId)
      .populate({
        path: "opportunity_id",
        select: "title ngo_id"
      })
      .populate("volunteer_id", "name");

    console.log("Creating conversation for application:", application._id);
    console.log("Application data:", {
      opportunity_id: application.opportunity_id?._id,
      ngo_id: application.opportunity_id?.ngo_id,
      volunteer_id: application.volunteer_id?._id,
      status: application.status
    });

    if (!application || application.status !== "accepted") {
      throw new Error("Application not found or not accepted");
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      application_id: applicationId,
    });

    if (existingConversation) {
      console.log("Conversation already exists:", existingConversation._id);
      return existingConversation;
    }

    const conversation = new Conversation({
      opportunity_id: application.opportunity_id._id,
      application_id: applicationId,
      ngo_id: application.opportunity_id.ngo_id,
      volunteer_id: application.volunteer_id._id,
      status: "active",
    });

    await conversation.save();
    console.log("Conversation created successfully:", conversation._id);
    return conversation;
  } catch (error) {
    console.error("Create conversation error:", error);
    throw error;
  }
};

exports.createDirectConversation = async (req, res) => {
  try {
    const currentUserId = req.user;
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: "participantId is required" });
    }

    const [currentUser, participant] = await Promise.all([
      User.findById(currentUserId),
      User.findById(participantId),
    ]);

    if (!currentUser || !participant) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.role === participant.role) {
      return res.status(400).json({ message: "Conversation requires one volunteer and one NGO" });
    }

    const ngoId = currentUser.role === "ngo" ? currentUserId : participantId;
    const volunteerId = currentUser.role === "volunteer" ? currentUserId : participantId;

    let conversation = await Conversation.findOne({
      ngo_id: ngoId,
      volunteer_id: volunteerId,
      status: "active",
    });

    if (!conversation) {
      conversation = new Conversation({
        ngo_id: ngoId,
        volunteer_id: volunteerId,
        status: "active",
      });
      await conversation.save();
    }

    conversation = await Conversation.findById(conversation._id)
      .populate("opportunity_id", "title description location duration required_skills")
      .populate("ngo_id", "name email location organization_name organization_description website_url")
      .populate("volunteer_id", "name email location skills bio");

    return res.status(200).json({
      message: "Conversation ready",
      conversation,
    });
  } catch (error) {
    console.error("Create direct conversation error:", error);
    return res.status(500).json({ message: "Error creating conversation", error: error.message });
  }
};

// Get user's conversations
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user;
    
    console.log("Fetching conversations for user:", userId, "Type:", typeof userId);

    // Convert to ObjectId if it's a string
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const conversations = await Conversation.find({
      $or: [
        { ngo_id: userObjectId },
        { volunteer_id: userObjectId }
      ],
      status: "active"
    })
    .populate("opportunity_id", "title description location duration required_skills")
    .populate("ngo_id", "name email location organization_name organization_description website_url")
    .populate("volunteer_id", "name email location skills bio")
    .populate("last_message.sender_id", "name")
    .sort({ updatedAt: -1 });

    console.log("Found conversations:", conversations.length, "Conversations:", conversations);

    res.json({
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
};

// Get single conversation with messages
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user;

    // Convert to ObjectId if it's a string
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [
        { ngo_id: userObjectId },
        { volunteer_id: userObjectId }
      ]
    })
    .populate("opportunity_id", "title description location duration required_skills")
    .populate("ngo_id", "name email location organization_name organization_description website_url")
    .populate("volunteer_id", "name email location skills bio");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Get messages for this conversation
    const Message = require("../models/message");
    const messages = await Message.find({
      conversation_id: conversationId
    })
    .populate("sender_id", "name")
    .sort({ createdAt: 1 });

    res.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Error fetching conversation", error: error.message });
  }
};

// Close conversation
exports.closeConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user;

    // Convert to ObjectId
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        $or: [
          { ngo_id: userObjectId },
          { volunteer_id: userObjectId }
        ]
      },
      { status: "closed" },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json({
      message: "Conversation closed",
      conversation,
    });
  } catch (error) {
    console.error("Close conversation error:", error);
    res.status(500).json({ message: "Error closing conversation", error: error.message });
  }
};