const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    required_skills: {
      type: [String],
      default: [],
    },

    duration: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    applicants: [{
      volunteer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      applied_date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
