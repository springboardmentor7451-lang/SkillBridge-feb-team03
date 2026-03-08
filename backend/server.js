const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
connectDB();

const app = express();

// Socket.IO setup
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user-specific room for notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle new message
  socket.on('sendMessage', async (data) => {
    try {
      const { conversationId, content, senderId, receiverId } = data;

      // Broadcast to receiver's room
      socket.to(receiverId).emit('newMessage', {
        conversationId,
        content,
        senderId,
        timestamp: new Date()
      });

      // Also broadcast to sender's room (for multi-device support)
      socket.to(senderId).emit('messageSent', {
        conversationId,
        content
      });

    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.to(conversationId).emit('userTyping', {
      userId,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

//user Route
app.use("/api/users", userRoutes);

// Opportunity routes
app.use("/api/opportunities", opportunityRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);

// Conversation routes
app.use("/api/conversations", conversationRoutes);

// Message routes
app.use("/api/messages", messageRoutes);

// Matching routes
app.use("/api/matching", matchingRoutes);

// Notification routes
app.use("/api/notifications", notificationRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SkillBridge API running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Export io for use in controllers
module.exports = { io };
