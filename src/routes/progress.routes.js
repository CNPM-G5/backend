const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress.controller");
const { protect } = require("../middlewares/auth.middleware");

// GET /api/progress/:courseId - Get course progress for user
router.get("/:courseId", protect, progressController.getCourseProgress);
router.get("/completed-courses", auth, progressController.getCompletedCourses);

module.exports = router;