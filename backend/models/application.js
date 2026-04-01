const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    applicant_name: String,
    applicant_email: String,
    cover_letter: String,
    rejection_reason: {
      type: String,
      default: "",
    },
    applied_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ opportunity_id: 1, volunteer_id: 1 }, { unique: true });
applicationSchema.index({ volunteer_id: 1, applied_date: -1 });

module.exports = mongoose.model("Application", applicationSchema);
