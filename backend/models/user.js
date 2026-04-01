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

    profile_picture_url: {
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationTokenHash: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    pendingEmail: {
      type: String,
      default: null,
    },

    pendingEmailVerificationTokenHash: {
      type: String,
      default: null,
    },

    pendingEmailVerificationExpires: {
      type: Date,
      default: null,
    },

    passwordResetTokenHash: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
