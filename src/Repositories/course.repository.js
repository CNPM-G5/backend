const pool = require("../config/db");

async function getAllCourses() {
    const result = await pool.query(`
        SELECT c.id, c.title, c.description, c.created_at,
               COUNT(l.id)::int AS lesson_count
        FROM courses c
        LEFT JOIN lessons l ON l.course_id = c.id
        GROUP BY c.id
        ORDER BY c.created_at ASC
    `);
    return result.rows;
}

async function getCourseById(id) {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    return result.rows[0] || null;
}

async function getLessonsByCourseId(courseId) {
    const result = await pool.query(
        "SELECT id, title, order_index FROM lessons WHERE course_id = $1 ORDER BY order_index",
        [courseId]
    );
    return result.rows;
}

async function createCourse({ title, description }) {
    const result = await pool.query(
        "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
        [title, description]
    );
    return result.rows[0];
}

async function updateCourse({ id, title, description }) {
    const result = await pool.query(
        "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
        [title, description, id]
    );
    return result.rows[0] || null;
}

async function deleteCourse(id) {
    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
}

module.exports = {
    getAllCourses,
    getCourseById,
    getLessonsByCourseId,
    createCourse,
    updateCourse,
    deleteCourse,
};