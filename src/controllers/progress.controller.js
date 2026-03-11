const db = require("../config/db");

exports.getCourseProgress = async (req, res) => {

  const courseId = req.params.courseId;
  const userId = req.user.id;

  try {

    const result = await db.query(
      `
      SELECT
        COUNT(l.id) as total_lessons,
        COUNT(up.lesson_id) as completed_lessons
      FROM lessons l
      LEFT JOIN user_progress up
      ON l.id = up.lesson_id
      AND up.user_id = $2
      AND up.completed = true
      WHERE l.course_id = $1
      `,
      [courseId, userId]
    );

    const total = parseInt(result.rows[0].total_lessons);
    const completed = parseInt(result.rows[0].completed_lessons);

    const percent = total === 0
      ? 0
      : Math.round((completed / total) * 100);

    res.json({
      success: true,
      total_lessons: total,
      completed_lessons: completed,
      progress_percent: percent
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};