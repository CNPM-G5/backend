const pool = require("../config/db");

async function findLessonById(id) {
    const result = await pool.query("SELECT * FROM lessons WHERE id = $1", [id]);
    return result.rows[0] || null;
}

async function findUserLessonProgress({ userId, lessonId }) {
    const result = await pool.query(
        "SELECT completed FROM user_progress WHERE user_id = $1 AND lesson_id = $2",
        [userId, lessonId]
    );

    return result.rows[0] || null;
}

async function findUserProgressRecord({ userId, lessonId }) {
    const result = await pool.query(
        "SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2",
        [userId, lessonId]
    );

    return result.rows[0] || null;
}

async function insertCompletedUserProgress({ userId, lessonId }) {
    await pool.query(
        `INSERT INTO user_progress (user_id, lesson_id, completed, completed_at)
       VALUES ($1, $2, true, NOW())`,
        [userId, lessonId]
    );
}

async function markUserProgressCompleted({ userId, lessonId }) {
    await pool.query(
        `UPDATE user_progress
       SET completed = true, completed_at = NOW()
       WHERE user_id = $1 AND lesson_id = $2`,
        [userId, lessonId]
    );
}

async function createLessonWithReorder({ course_id, title, content, order_index }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query(
            `UPDATE lessons
       SET order_index = order_index + 1
       WHERE course_id = $1 AND order_index >= $2`,
            [course_id, order_index]
        );

        const result = await client.query(
            `INSERT INTO lessons (course_id, title, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [course_id, title, content, order_index]
        );

        await client.query("COMMIT");
        return result.rows[0] || null;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function updateLessonWithReorder({ id, title, content, order_index }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const oldLessonResult = await client.query(
            "SELECT course_id, order_index FROM lessons WHERE id = $1",
            [id]
        );

        if (oldLessonResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const oldLesson = oldLessonResult.rows[0];
        const oldOrderIndex = oldLesson.order_index;
        const courseId = oldLesson.course_id;

        if (order_index !== oldOrderIndex) {
            if (order_index < oldOrderIndex) {
                await client.query(
                    `UPDATE lessons
           SET order_index = order_index + 1
           WHERE course_id = $1 AND id != $2 AND order_index >= $3 AND order_index < $4`,
                    [courseId, id, order_index, oldOrderIndex]
                );
            } else {
                await client.query(
                    `UPDATE lessons
           SET order_index = order_index - 1
           WHERE course_id = $1 AND id != $2 AND order_index > $3 AND order_index <= $4`,
                    [courseId, id, oldOrderIndex, order_index]
                );
            }
        }

        const result = await client.query(
            `UPDATE lessons
       SET title = $1,
           content = $2,
           order_index = $3
       WHERE id = $4
       RETURNING *`,
            [title, content, order_index, id]
        );

        await client.query("COMMIT");
        return result.rows[0] || null;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function deleteLessonWithReorder(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const lesson = await client.query(
            "SELECT course_id, order_index FROM lessons WHERE id = $1",
            [id]
        );

        if (lesson.rows.length === 0) {
            await client.query("ROLLBACK");
            return false;
        }

        const { course_id, order_index } = lesson.rows[0];

        await client.query("DELETE FROM lessons WHERE id = $1", [id]);

        await client.query(
            `UPDATE lessons
       SET order_index = order_index - 1
       WHERE course_id = $1 AND order_index > $2`,
            [course_id, order_index]
        );

        await client.query("COMMIT");
        return true;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    findLessonById,
    findUserLessonProgress,
    findUserProgressRecord,
    insertCompletedUserProgress,
    markUserProgressCompleted,
    createLessonWithReorder,
    updateLessonWithReorder,
    deleteLessonWithReorder,
};
