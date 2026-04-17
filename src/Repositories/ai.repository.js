const pool = require("../config/db");

async function getLessonsWithProgress({ userId, courseId }) {
    const progressQuery = `
    SELECT
      l.id as lesson_id,
      l.title as lesson_title,
      l.order_index,
      COALESCE(up.completed, false) as completed,
      up.completed_at
    FROM lessons l
    LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
    WHERE l.course_id = $2
    ORDER BY l.order_index
  `;

    const result = await pool.query(progressQuery, [userId, courseId]);
    return result.rows;
}

async function getAllCourses() {
    const result = await pool.query(`
    SELECT c.id, c.title, c.description,
           COUNT(l.id)::int AS lesson_count
    FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `);

    return result.rows;
}

async function getLessonContext(lessonId) {
    const lessonResult = await pool.query(
        "SELECT title, content FROM lessons WHERE id = $1",
        [lessonId]
    );

    return lessonResult.rows[0] || null;
}

module.exports = {
    getLessonsWithProgress,
    getAllCourses,
    getLessonContext,
};
