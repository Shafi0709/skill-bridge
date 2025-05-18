import Resume from "../models/Resume.js";
import User from "../models/User.js";
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Show resume form
export const showResumeForm = (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  res.render("resumes/form", { user: req.session.user });
};

// ✅ Save resume to MongoDB
export const saveResume = async (req, res) => {
  const { summary, institution, degree, year, company, position, duration, jobDesc, skills } = req.body;

  const resume = new Resume({
    user: req.session.user._id,
    summary,
    education: [{ institution, degree, year }],
    experience: [{ company, position, duration, description: jobDesc }],
    skills: skills.split(",").map(s => s.trim())
  });

  await resume.save();
  res.redirect("/resume/preview");
};

// ✅ Show resume preview
export const previewResume = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  const resume = await Resume.findOne({ user: req.session.user._id });
  if (!resume) return res.redirect("/resume/form");
  res.render("resumes/preview", { resume });
};

// ✅ Download PDF using Puppeteer
export const downloadResume = async (req, res) => {
  const resume = await Resume.findOne({ user: req.session.user._id });
  if (!resume) return res.redirect("/resume/form");

  const filePath = path.join(__dirname, "../views/resumes/pdf_template.ejs");
  const html = await ejs.renderFile(filePath, { resume });

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="resume.pdf"'
  });

  res.send(pdfBuffer);
};

// ✅ Send resume email using EmailJS
export const sendResumeEmail = async (req, res) => {
  const { to_email, message } = req.body;
  const user = req.session.user;

  const emailData = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      to_email,
      from_name: user.name,
      message
    }
  };

  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", emailData);
    res.send("✅ Resume sent successfully!");
  } catch (err) {
    console.error("❌ EmailJS Error:", err.message);
    res.send("❌ Failed to send email.");
  }
};

// ✅ Show public resume via username
export const publicPortfolio = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send("User not found.");

  const resume = await Resume.findOne({ user: user._id });
  if (!resume) return res.status(404).send("Resume not found.");

  res.render("resumes/public", { resume, user });
};

// ✅ Admin dashboard view
export const adminDashboard = async (req, res) => {
  const users = await User.find();
  const resumes = await Resume.find().populate("user");
  res.render("admin/dashboard", { users, resumes });
};

// ✅ Toggle featured resumes
export const toggleFeatured = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  resume.featured = !resume.featured;
  await resume.save();
  res.redirect("/admin");
};
