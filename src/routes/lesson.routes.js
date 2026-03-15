const express = require("express");
const router = express.Router();

const lessonController = require("../controllers/lesson.controller");
const { protect } = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/adminOnly");

// PUBLIC
router.get("/:id", lessonController.getLessonById);

// USER
router.post("/:id/complete", protect, lessonController.completeLesson);

// ADMIN
router.post("/", protect, adminOnly, lessonController.createLesson);
router.put("/:id", protect, adminOnly, lessonController.updateLesson);
router.delete("/:id", protect, adminOnly, lessonController.deleteLesson);

module.exports = router;