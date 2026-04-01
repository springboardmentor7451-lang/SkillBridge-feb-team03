const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const matchRoutes = require("./routes/matchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const browseRoutes = require("./routes/browseRoutes");

dotenv.config();
connectDB();

const app = express();

// Socket.IO setup
const http = require('http');
const { Server } = require('socket.io');
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^https?:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^https?:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  return false;
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  }
});

const userSockets = new Map();

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    return next();
  } catch (error) {
    return next(new Error("Invalid socket token"));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const authenticatedUserId = socket.userId;
  console.log('User connected:', socket.id, 'User:', authenticatedUserId);

  if (authenticatedUserId) {
    socket.join(authenticatedUserId);
    userSockets.set(authenticatedUserId, socket.id);
  }

  // Join user-specific room for notifications
  socket.on('join', (userId) => {
    if (authenticatedUserId && userId !== authenticatedUserId) {
      return;
    }
    const roomUserId = authenticatedUserId || userId;
    socket.join(roomUserId);
    userSockets.set(roomUserId, socket.id);
    console.log(`User ${roomUserId} joined room`);
  });

  // Handle new message
  const handleSendMessage = async (data) => {
    try {
      const { conversationId, content, senderId } = data;

      if (!authenticatedUserId || senderId !== authenticatedUserId) {
        socket.emit('socket_error', { message: 'Sender identity mismatch' });
        return;
      }

      // Also broadcast to sender's room (for multi-device support)
      const sentPayload = {
        conversationId,
        content
      };
      socket.to(senderId).emit('messageSent', sentPayload);

    } catch (error) {
      console.error('Socket message error:', error);
    }
  };

  socket.on('send_message', handleSendMessage);
  socket.on('sendMessage', handleSendMessage);

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.to(conversationId).emit('userTyping', {
      userId,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    if (authenticatedUserId && userSockets.get(authenticatedUserId) === socket.id) {
      userSockets.delete(authenticatedUserId);
    }
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
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
app.use("/api/match", matchRoutes);

// Notification routes
app.use("/api/notifications", notificationRoutes);

// Browse routes
app.use("/api/browse", browseRoutes);

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
