const User = require("../models/user");

// Get logged-in user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fields that can be updated
    const { name, location, bio, skills, organization_name, organization_description, website_url } = req.body;

    // Prevent role change
    if (req.body.role) {
      return res.status(400).json({ message: "You cannot change your role" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (location) user.location = location;
    if (bio) user.bio = bio;

    // Volunteer fields
    if (req.user.role === "volunteer" && skills) {
      user.skills = skills;
    }

    // NGO fields
    if (user.role === "ngo") {
      if (organization_name) user.organization_name = organization_name;
      if (organization_description) user.organization_description = organization_description;
      if (website_url) user.website_url = website_url;
    }

    await user.save();

    const updatedUser = await User.findById(req.user).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
