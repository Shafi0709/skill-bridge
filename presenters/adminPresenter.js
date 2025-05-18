import User from "../models/User.js";
import Resume from "../models/Resume.js";

export const adminDashboard = async (req, res) => {
  const users = await User.find();
  const resumes = await Resume.find().populate("user");
  res.render("admin/dashboard", { users, resumes });
};

export const toggleFeatured = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  resume.featured = !resume.featured;
  await resume.save();
  res.redirect("/admin");
};
