const pool = require("../config/db");

// GET All
exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.title, c.description, c.created_at,
             COUNT(l.id)::int AS lesson_count
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET By ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [id]
    );

    if (course.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const lessons = await pool.query(
      "SELECT id, title, order_index FROM lessons WHERE course_id = $1 ORDER BY order_index",
      [id]
    );

    res.json({
      success: true,
      data: {
        course: course.rows[0],
        lessons: lessons.rows
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE (Admin)
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM courses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};