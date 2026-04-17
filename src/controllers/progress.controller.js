const progressService = require("../services/progress.service");

function handleError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
}

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const data = await progressService.getCourseProgress({ userId, courseId });
    return res.json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.getCompletedCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await progressService.getCompletedCourses({ userId });
    return res.json(data);
  } catch (err) {
    return handleError(res, err);
  }
};