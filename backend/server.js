const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//user Route
app.use("/api/users", userRoutes);

// Opportunity routes
app.use("/api/opportunities", opportunityRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SkillBridge API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
