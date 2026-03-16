const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress.controller");
const { protect } = require("../middlewares/auth.middleware");

// Route cụ thể phải đặt TRƯỚC route có param /:courseId
router.get("/completed-courses", protect, progressController.getCompletedCourses);
router.get("/:courseId", protect, progressController.getCourseProgress);

module.exports = router;
