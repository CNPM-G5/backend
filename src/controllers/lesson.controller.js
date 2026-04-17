const lessonService = require("../services/lesson.service");

function handleError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
}

exports.getLessonById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await lessonService.getLessonById({ id, userId: req.user?.id });
    return res.json({ success: true, data });

  } catch (err) {
    return handleError(res, err);
  }
};



exports.completeLesson = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await lessonService.completeLesson({ id, userId });
    return res.json({ success: true, message: "Lesson marked as completed" });

  } catch (err) {
    return handleError(res, err);
  }
};


exports.createLesson = async (req, res) => {
  const { course_id, title, content, order_index } = req.body;

  try {
    const data = await lessonService.createLesson({
      course_id,
      title,
      content,
      order_index,
    });
    return res.status(201).json({ success: true, data });

  } catch (err) {
    return handleError(res, err);
  }
};


exports.updateLesson = async (req, res) => {
  const { id } = req.params;
  const { title, content, order_index } = req.body;

  try {
    const data = await lessonService.updateLesson({ id, title, content, order_index });
    return res.json({ success: true, data });

  } catch (err) {
    return handleError(res, err);
  }
};


exports.deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    await lessonService.deleteLesson(id);
    return res.json({ success: true, message: "Lesson deleted" });

  } catch (err) {
    return handleError(res, err);
  }
};