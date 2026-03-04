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

  try {
    const result = await pool.query(
      `INSERT INTO lessons (course_id, title, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [course_id, title, content, order_index]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.updateLesson = async (req, res) => {
  const { id } = req.params;
  const { title, content, order_index } = req.body;

  try {
    const result = await pool.query(
      `UPDATE lessons
       SET title = $1,
           content = $2,
           order_index = $3
       WHERE id = $4
       RETURNING *`,
      [title, content, order_index, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM lessons WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    res.json({
      success: true,
      message: "Lesson deleted"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};