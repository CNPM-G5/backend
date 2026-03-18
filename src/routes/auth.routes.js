const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", protect, authController.getProfile);
router.post("/change-password", protect, authController.changePassword);
router.post("/update-profile", protect, authController.updateProfile);
router.post("/update-avatar", protect, authController.updateAvatar);

// upload avatar
router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  authController.uploadAvatar
);

module.exports = router;