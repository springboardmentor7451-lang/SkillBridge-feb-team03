import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["volunteer", "ngo"] },

    skills: [String],
    location: String,
    bio: String,

    organization_name: String,
    organization_description: String,
    website_url: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);