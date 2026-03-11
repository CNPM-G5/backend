const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const auth = require("../middlewares/auth");

router.post("/chat", auth, aiController.chatWithLesson);

module.exports = router;