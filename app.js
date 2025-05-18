import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// 👇 Use dynamic import for express-ejs-layouts (since it's CommonJS)
const expressLayouts = (await import('express-ejs-layouts')).default;

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// View Engine + Layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);                   // ✅ layout engine
app.set("layout", "layout");               // uses views/layout.ejs

// Static + Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Routes
app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);

// Home
app.get("/", (req, res) => {
  res.render("index", {
    user: req.session.user,
    title: "Home | SkillBridge" // ✅ Add this line
  });
});



// Start
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
