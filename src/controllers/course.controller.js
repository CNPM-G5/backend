const courseService = require("../services/course.service");

function handleError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
}

// GET All
exports.getAllCourses = async (req, res) => {
  try {
    const data = await courseService.getAllCourses();
    return res.json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET By ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await courseService.getCourseById(id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// CREATE (Admin)
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  try {
    const data = await courseService.createCourse({ title, description });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// UPDATE
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const data = await courseService.updateCourse({ id, title, description });
    return res.json({ success: true, data });
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await courseService.deleteCourse(id);
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return handleError(res, err);
  }
};