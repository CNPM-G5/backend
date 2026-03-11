const OpenAI = require("openai");
const db = require("../config/db");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.chatWithLesson = async (req, res) => {
  const { lessonId, question } = req.body;

  try {

    // lấy content lesson
    const lesson = await db.query(
      "SELECT title, content FROM lessons WHERE id = $1",
      [lessonId]
    );

    if (lesson.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    const lessonContent = lesson.rows[0].content;

    const prompt = `
Bạn là trợ lý học tập cho khóa học lập trình.

Context bài học:
${lessonContent}

Câu hỏi của học viên:
${question}

Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    res.json({
      success: true,
      answer: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    // fail-safe
    res.json({
      success: true,
      degraded: true,
      message: "AI hiện không khả dụng, vui lòng thử lại sau."
    });

  }
};