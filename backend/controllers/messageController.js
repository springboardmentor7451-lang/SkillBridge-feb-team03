const mongoose = require("mongoose");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const { io } = require("../server");
const { createNotification } = require("./notificationController");
const User = require("../models/user");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, content, attachment } = req.body;
    const sender_id = req.user;

    console.log("Sending message from sender:", sender_id, "to conversation:", conversation_id);

    // Validate conversation exists and user is participant
    const userObjectId = mongoose.Types.ObjectId.isValid(sender_id) 
      ? new mongoose.Types.ObjectId(sender_id)
      : sender_id;

    const conversation = await Conversation.findOne({
      _id: conversation_id,
      $or: [
        { ngo_id: userObjectId },
        { volunteer_id: userObjectId }
      ],
      status: "active"
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or access denied" });
    }

    // Determine receiver
    const ngoIdStr = conversation.ngo_id.toString();
    const volunteerIdStr = conversation.volunteer_id.toString();
    const senderIdStr = userObjectId.toString();
    
    const receiver_id = ngoIdStr === senderIdStr ? conversation.volunteer_id : conversation.ngo_id;

    const trimmedContent = (content || "").trim();
    const hasAttachment = !!(attachment && attachment.name && attachment.dataUrl);

    if (!trimmedContent && !hasAttachment) {
      return res.status(400).json({ message: "Message content or attachment is required" });
    }

    // Basic duplicate guard for accidental double-submit bursts
    const recentDuplicate = await Message.findOne({
      conversation_id,
      sender_id: userObjectId,
      content: trimmedContent,
      createdAt: { $gte: new Date(Date.now() - 3000) },
    });

    if (recentDuplicate && !hasAttachment) {
      return res.status(409).json({ message: "Duplicate message ignored" });
    }

    // Create message
    const message = new Message({
      conversation_id,
      sender_id: userObjectId,
      receiver_id,
      content: trimmedContent,
      message_type: hasAttachment ? "file" : "text",
      attachment_name: hasAttachment ? attachment.name : "",
      attachment_type: hasAttachment ? attachment.type || "" : "",
      attachment_data_url: hasAttachment ? attachment.dataUrl : "",
    });

    await message.save();
    console.log("Message saved:", message._id);

    // Update conversation's last message
    conversation.last_message = {
      content: trimmedContent || (hasAttachment ? `Attachment: ${attachment.name}` : ""),
      sender_id: userObjectId,
      timestamp: new Date(),
    };
    await conversation.save();

    // Populate sender info for response
    await message.populate("sender_id", "name");

    // Run real-time and notification side effects without failing API response
    try {
      // Emit real-time message to receiver
      const messagePayload = {
        conversationId: conversation_id,
        message: {
          _id: message._id,
          content: trimmedContent,
          sender_id: userObjectId,
          receiver_id,
          message_type: message.message_type,
          attachment_name: message.attachment_name,
          attachment_type: message.attachment_type,
          attachment_data_url: message.attachment_data_url,
          createdAt: message.createdAt,
          status: "sent"
        }
      };

      io.to(receiver_id.toString()).emit('receive_message', messagePayload);
      io.to(receiver_id.toString()).emit('newMessage', messagePayload);

      // Also emit to sender for multi-device support
      io.to(senderIdStr).emit('messageSent', {
        conversationId: conversation_id,
        message: message
      });

      // Create notification for receiver
      const sender = await User.findById(userObjectId);
      const senderName = sender?.name || "Someone";
      
      await createNotification({
        user_id: receiver_id,
        type: "message",
        title: "New Message",
        message: `${senderName} sent you a message`,
        related_user_id: userObjectId,
        conversation_id,
        action_url: `/messages?conversation=${conversation_id}`,
      });

      // Emit notification via socket
      const notificationPayload = {
        type: 'message',
        title: 'New Message',
        message: `${senderName} sent you a message`,
        sender: senderName,
        timestamp: new Date()
      };

      io.to(receiver_id.toString()).emit('new_notification', notificationPayload);
      io.to(receiver_id.toString()).emit('notification', notificationPayload);
    } catch (sideEffectError) {
      console.error("Message side-effect error:", sideEffectError);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user;

    // Convert to ObjectId
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Validate user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [
        { ngo_id: userObjectId },
        { volunteer_id: userObjectId }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({
      conversation_id: conversationId
    })
    .populate("sender_id", "name")
    .sort({ createdAt: 1 });

    res.json({
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user;

    // Convert to ObjectId
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Validate user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [
        { ngo_id: userObjectId },
        { volunteer_id: userObjectId }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Mark messages as read where user is the receiver
    await Message.updateMany(
      {
        conversation_id: conversationId,
        receiver_id: userObjectId,
        status: { $ne: "read" }
      },
      { status: "read" }
    );

    res.json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Error marking messages as read", error: error.message });
  }
};

// Contract endpoint: GET /api/messages/:userId
exports.getMessagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user;

    const requesterObjectId = mongoose.Types.ObjectId.isValid(requesterId)
      ? new mongoose.Types.ObjectId(requesterId)
      : requesterId;
    const targetUserObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    if (!targetUserObjectId) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const conversation = await Conversation.findOne({
      status: "active",
      $or: [
        { ngo_id: requesterObjectId, volunteer_id: targetUserObjectId },
        { ngo_id: targetUserObjectId, volunteer_id: requesterObjectId },
      ],
    });

    if (!conversation) {
      return res.json({ messages: [], conversationId: null });
    }

    const messages = await Message.find({ conversation_id: conversation._id })
      .populate("sender_id", "name")
      .sort({ createdAt: 1 });

    res.json({
      conversationId: conversation._id,
      messages,
    });
  } catch (error) {
    console.error("Get messages by user id error:", error);
    res.status(500).json({ message: "Error fetching message history", error: error.message });
  }
};