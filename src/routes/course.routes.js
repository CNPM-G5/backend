const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course.controller");
const { protect } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// PUBLIC
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

// ADMIN ONLY
router.post("/", protect, isAdmin, courseController.createCourse);
router.put("/:id", protect, isAdmin, courseController.updateCourse);
router.delete("/:id", protect, isAdmin, courseController.deleteCourse);

module.exports = router;