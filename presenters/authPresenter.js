// presenters/authPresenter.js
import User from "../models/User.js";

// Show login form
export const showLogin = (req, res) => {
  res.render("users/login", { error: null });
};

// Show register form
export const showRegister = (req, res) => {
  res.render("users/register", { error: null });
};

// Handle user registration
export const handleRegister = async (req, res) => {
  const { name, email, password, username } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.render("users/register", { error: "Email already exists." });

    const user = new User({ name, email, password, username });
    await user.save();
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    res.render("users/register", { error: "Error registering user." });
  }
};

// Handle login
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render("users/login", { error: "Invalid email or password." });
    }
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    res.render("users/login", { error: "Login error." });
  }
};

// Logout
export const handleLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
