const pool = require("../config/db");
const jwt = require("jsonwebtoken");

exports.getLessonById = async (req, res) => {
  const { id } = req.params;

  try {
    
    const lessonResult = await pool.query(
      "SELECT * FROM lessons WHERE id = $1",
      [id]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    const lesson = lessonResult.rows[0];
    let completed = false;

    
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const progressResult = await pool.query(
          "SELECT completed FROM user_progress WHERE user_id = $1 AND lesson_id = $2",
          [decoded.id, id]
        );

        if (progressResult.rows.length > 0) {
          completed = progressResult.rows[0].completed;
        }

      } catch (err) {
        
      }
    }

    res.json({
      success: true,
      data: {
        ...lesson,
        completed
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



exports.completeLesson = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // 1️⃣ Kiểm tra lesson tồn tại
    const lessonCheck = await pool.query(
      "SELECT id FROM lessons WHERE id = $1",
      [id]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    const existing = await pool.query(
      "SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2",
      [userId, id]
    );

    if (existing.rows.length === 0) {
      // Chưa có → INSERT
      await pool.query(
        `INSERT INTO user_progress (user_id, lesson_id, completed, completed_at)
         VALUES ($1, $2, true, NOW())`,
        [userId, id]
      );
    } else {
      await pool.query(
        `UPDATE user_progress
         SET completed = true, completed_at = NOW()
         WHERE user_id = $1 AND lesson_id = $2`,
        [userId, id]
      );
    }

    res.json({
      success: true,
      message: "Lesson marked as completed"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.createLesson = async (req, res) => {
  const { course_id, title, content, order_index } = req.body;

  // Validate inputs
  if (!course_id || !title || !content || order_index === undefined || order_index === null) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin bài học"
    });
  }

  if (order_index < 1 || !Number.isInteger(Number(order_index))) {
    return res.status(400).json({
      success: false,
      message: "Thứ tự bài học phải là số nguyên dương"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Dời các lesson phía sau lên +1
    await client.query(
      `UPDATE lessons
       SET order_index = order_index + 1
       WHERE course_id = $1 AND order_index >= $2`,
      [course_id, order_index]
    );

    // 2. Thêm lesson mới
    const result = await client.query(
      `INSERT INTO lessons (course_id, title, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [course_id, title, content, order_index]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  } finally {
    client.release();
  }
};


exports.updateLesson = async (req, res) => {
  const { id } = req.params;
  const { title, content, order_index } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lấy lesson cũ để biết course_id và order_index cũ
    const oldLessonResult = await client.query(
      "SELECT course_id, order_index FROM lessons WHERE id = $1",
      [id]
    );

    if (oldLessonResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    const oldLesson = oldLessonResult.rows[0];
    const oldOrderIndex = oldLesson.order_index;
    const courseId = oldLesson.course_id;

    // 2. Nếu order_index thay đổi, cần dời các lesson khác
    if (order_index !== oldOrderIndex) {
      if (order_index < oldOrderIndex) {
        // Nếu dời sang trái (order_index giảm)
        // Tăng order_index của các lesson từ order_index mới đến cũ-1
        await client.query(
          `UPDATE lessons
           SET order_index = order_index + 1
           WHERE course_id = $1 AND id != $2 AND order_index >= $3 AND order_index < $4`,
          [courseId, id, order_index, oldOrderIndex]
        );
      } else {
        // Nếu dời sang phải (order_index tăng)
        // Giảm order_index của các lesson từ cũ+1 đến order_index mới
        await client.query(
          `UPDATE lessons
           SET order_index = order_index - 1
           WHERE course_id = $1 AND id != $2 AND order_index > $3 AND order_index <= $4`,
          [courseId, id, oldOrderIndex, order_index]
        );
      }
    }

    // 3. Update lesson
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

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  } finally {
    client.release();
  }
};


exports.deleteLesson = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lấy thông tin lesson cần xoá
    const lesson = await client.query(
      "SELECT course_id, order_index FROM lessons WHERE id = $1",
      [id]
    );

    if (lesson.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    const { course_id, order_index } = lesson.rows[0];

    // 2. Xoá lesson
    await client.query(
      "DELETE FROM lessons WHERE id = $1",
      [id]
    );

    // 3. Dồn lại order_index
    await client.query(
      `UPDATE lessons
       SET order_index = order_index - 1
       WHERE course_id = $1 AND order_index > $2`,
      [course_id, order_index]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Lesson deleted"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  } finally {
    client.release();
  }
};