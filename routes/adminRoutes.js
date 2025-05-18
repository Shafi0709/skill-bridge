import express from "express";
import { checkAdmin } from "../middleware/checkAdmin.js";
import {
  adminDashboard,
  toggleFeatured
} from "../presenters/adminPresenter.js";

const router = express.Router();

router.get("/", checkAdmin, adminDashboard);
router.post("/feature/:id", checkAdmin, toggleFeatured);

export default router;
