import express from "express";
import {
  showResumeForm,
  saveResume,
  previewResume,
  downloadResume,
  sendResumeEmail,
  publicPortfolio
} from "../presenters/resumePresenter.js";

const router = express.Router(); // ✅ DECLARE THIS BEFORE USING router

// ROUTES BELOW
router.get("/form", showResumeForm);
router.post("/form", saveResume);
router.get("/preview", previewResume);
router.get("/download", downloadResume);
router.post("/email", sendResumeEmail);
router.get("/u/:username", publicPortfolio); // ✅ No error now

export default router;
