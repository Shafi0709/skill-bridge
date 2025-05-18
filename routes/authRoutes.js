// routes/authRoutes.js
import express from "express";
import {
  showLogin,
  showRegister,
  handleRegister,
  handleLogin,
  handleLogout
} from "../presenters/authPresenter.js";

const router = express.Router();

router.get("/login", showLogin);
router.get("/register", showRegister);
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

export default router;
