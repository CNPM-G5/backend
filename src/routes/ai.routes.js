const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const { protect } = require("../middlewares/auth.middleware");

// POST /api/ai/chat - Chat with AI (protected)
router.post("/chat", protect, aiController.chat);

module.exports = router;