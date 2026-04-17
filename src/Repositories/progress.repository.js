const pool = require("../config/db");

async function findCourseById(courseId) {
    const result = await pool.query(
        "SELECT id, title FROM courses WHERE id = $1",
        [courseId]
    );

    return result.rows[0] || null;
}

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

async function getCompletedCoursesByUserId(userId) {
    const result = await pool.query(
        `
    SELECT c.id, c.title
    FROM courses c
    JOIN lessons l ON l.course_id = c.id
    LEFT JOIN user_progress up
      ON up.lesson_id = l.id AND up.user_id = $1
    GROUP BY c.id
    HAVING COUNT(l.id) = COUNT(
      CASE WHEN up.completed = true THEN 1 END
    )
    `,
        [userId]
    );

    return result.rows;
}

module.exports = {
    findCourseById,
    getLessonsWithProgress,
    getCompletedCoursesByUserId,
};
