const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course.controller");
const { protect } = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/adminOnly");

// PUBLIC
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

// ADMIN ONLY
router.post("/", protect, adminOnly, courseController.createCourse);
router.put("/:id", protect, adminOnly, courseController.updateCourse);
router.delete("/:id", protect, adminOnly, courseController.deleteCourse);

module.exports = router;