const Groq = require('groq-sdk');
const pool = require('../config/db');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_demo_key_for_testing',
});

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên về Software Engineering, hỗ trợ học viên học tập.

Nhiệm vụ:
- Trả lời câu hỏi về NỘI DUNG BÀI HỌC dựa trên context được cung cấp
- Trả lời câu hỏi về TIẾN ĐỘ HỌC TẬP của học viên dựa trên dữ liệu progress
- Nếu câu hỏi không liên quan đến bài học hoặc tiến độ, nhắc nhở học viên tập trung vào nội dung chính

Yêu cầu:
- Trả lời bằng tiếng Việt
- Ngắn gọn, súc tích (tối đa 200 từ)
- Giọng điệu thân thiện, hỗ trợ
- Luôn dựa vào dữ liệu thực tế để trả lời`;

// Helper function để lấy progress
async function getUserProgress(userId, courseId) {
  try {
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
    const lessons = result.rows;
    
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(l => l.completed).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return {
      totalLessons,
      completedLessons,
      progressPercentage,
      lessons: lessons.map(l => ({
        id: l.lesson_id,
        title: l.lesson_title,
        orderIndex: l.order_index,
        completed: l.completed,
        completedAt: l.completed_at
      }))
    };
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
}

// Helper function để lấy tất cả courses
async function getAllCourses() {
  try {
    const result = await pool.query(`
      SELECT c.id, c.title, c.description,
             COUNT(l.id)::int AS lesson_count
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting courses:', error);
    return null;
  }
}

exports.chat = async (req, res) => {
  try {
    const { message, lessonId, courseId } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập câu hỏi"
      });
    }

    // Xác định loại câu hỏi
    const isProgressQuestion = /tiến độ|progress|học đến đâu|hoàn thành|đã học|chưa học/i.test(message);
    const isCourseListQuestion = /có những|danh sách|khóa học nào|course nào/i.test(message);
    
    let contextData = "";
    
    // 1. Nếu hỏi về tiến độ
    if (isProgressQuestion) {
      const targetCourseId = courseId || 2; // Default course
      const progress = await getUserProgress(userId, targetCourseId);
      
      if (progress) {
        contextData = `\n\nDỮ LIỆU TIẾN ĐỘ HỌC TẬP:
- Tổng số bài: ${progress.totalLessons}
- Đã hoàn thành: ${progress.completedLessons}
- Tiến độ: ${progress.progressPercentage}%

Chi tiết các bài học:
${progress.lessons.map(l => 
  `- ${l.completed ? '✅' : '⬜'} Bài ${l.orderIndex}: ${l.title}${l.completed ? ` (Hoàn thành: ${new Date(l.completedAt).toLocaleDateString('vi-VN')})` : ''}`
).join('\n')}`;
      }
    }
    
    // 2. Nếu hỏi về danh sách courses
    else if (isCourseListQuestion) {
      const courses = await getAllCourses();
      
      if (courses) {
        contextData = `\n\nDANH SÁCH KHÓA HỌC:
${courses.map(c => 
  `- ${c.title}: ${c.description || 'Không có mô tả'} (${c.lesson_count} bài học)`
).join('\n')}`;
      }
    }
    
    // 3. Nếu hỏi về nội dung bài học cụ thể
    else if (lessonId) {
      const lessonResult = await pool.query(
        "SELECT title, content FROM lessons WHERE id = $1",
        [lessonId]
      );
      
      if (lessonResult.rows.length > 0) {
        const lesson = lessonResult.rows[0];
        contextData = `\n\nBÀI HỌC:
Tiêu đề: ${lesson.title}
Nội dung: ${lesson.content}`;
      }
    }

    // Tạo prompt
    const userPrompt = contextData 
      ? `${contextData}\n\nCÂU HỎI CỦA HỌC VIÊN: ${message}`
      : `CÂU HỎI: ${message}\n\n(Lưu ý: Đây là câu hỏi chung, không liên quan đến bài học hoặc tiến độ cụ thể)`;

    // Gọi Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        message: aiResponse,
        lessonId: lessonId || null,
        courseId: courseId || null,
        hasContext: !!contextData,
        degraded: false
      }
    });

  } catch (error) {
    console.error('AI Error:', error.message);
    
    // Fail-safe response
    res.json({
      success: true,
      data: {
        message: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ giảng viên để được hỗ trợ tốt hơn.",
        lessonId: req.body.lessonId || null,
        courseId: req.body.courseId || null,
        hasContext: false,
        degraded: true
      }
    });
  }
};