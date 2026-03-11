const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progress.controller");
const auth = require("../middlewares/auth");

router.get("/:courseId", auth, progressController.getCourseProgress);

module.exports = router;