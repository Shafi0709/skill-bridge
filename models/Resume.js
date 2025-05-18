// models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  summary: String,
  education: [
    {
      institution: String,
      degree: String,
      year: String
    }
  ],
  experience: [
    {
      company: String,
      position: String,
      duration: String,
      description: String
    }
  ],
  skills: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Resume", resumeSchema);
