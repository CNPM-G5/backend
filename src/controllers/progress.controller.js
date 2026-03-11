const pool = require("../config/db");

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Kiểm tra course tồn tại
    const courseCheck = await pool.query(
      "SELECT id, title FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const course = courseCheck.rows[0];

    // Lấy tổng số bài học và progress
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

    const progressResult = await pool.query(progressQuery, [userId, courseId]);
    const lessons = progressResult.rows;

    // Tính toán thống kê
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(lesson => lesson.completed).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title
        },
        progress: {
          totalLessons,
          completedLessons,
          progressPercentage
        },
        lessons: lessons.map(lesson => ({
          id: lesson.lesson_id,
          title: lesson.lesson_title,
          orderIndex: lesson.order_index,
          completed: lesson.completed,
          completedAt: lesson.completed_at
        }))
      }
    });

  } catch (error) {
    console.error('Progress Error:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};