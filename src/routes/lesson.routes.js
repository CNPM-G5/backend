const express = require("express");
const router = express.Router();

const lessonController = require("../controllers/lesson.controller");
const { protect } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// PUBLIC
router.get("/:id", lessonController.getLessonById);

// USER
router.post("/:id/complete", protect, lessonController.completeLesson);

// ADMIN
router.post("/", protect, isAdmin, lessonController.createLesson);
router.put("/:id", protect, isAdmin, lessonController.updateLesson);
router.delete("/:id", protect, isAdmin, lessonController.deleteLesson);

module.exports = router;