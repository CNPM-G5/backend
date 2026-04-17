const aiService = require("../services/ai.service");

function handleError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
}

exports.chat = async (req, res) => {
  try {
    const { message, lessonId, courseId } = req.body;
    const userId = req.user.id;
    const data = await aiService.chat({ userId, message, lessonId, courseId });
    return res.json({ success: true, data });

  } catch (error) {
    return handleError(res, error);
  }
};