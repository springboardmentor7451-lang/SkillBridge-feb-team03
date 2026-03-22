const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      skills,
      bio,
      organization_name,
      organization_description,
      website_url,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Role-specific validation
    if (role === "volunteer") {
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ message: "Volunteers must have at least one skill" });
      }
      if (!bio || bio.length < 10) {
        return res.status(400).json({ message: "Bio must be at least 10 characters" });
      }
    }

    if (role === "ngo") {
      if (!organization_name || organization_name.trim().length === 0) {
        return res.status(400).json({ message: "Organization Name is required for NGOs" });
      }
      if (!organization_description || organization_description.trim().length < 10) {
        return res.status(400).json({ message: "Organization Description must be at least 10 characters" });
      }
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      location,
    };

    // Add role-specific fields
    if (role === "volunteer") {
      userData.skills = skills;
      userData.bio = bio;
    } else if (role === "ngo") {
      userData.organization_name = organization_name;
      userData.organization_description = organization_description;
      userData.website_url = website_url || "";
    }

    // Create user
    const user = await User.create(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
