const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    feedback: {
      type: String,
      default: "",
      maxlength: 500,
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate ratings from same user to same user
ratingSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
