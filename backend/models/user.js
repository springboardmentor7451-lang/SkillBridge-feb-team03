const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["volunteer", "ngo"],
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    // NGO-only fields
    organization_name: {
      type: String,
      default: "",
    },

    organization_description: {
      type: String,
      default: "",
    },

    website_url: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
