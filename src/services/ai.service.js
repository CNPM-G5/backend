const Groq = require("groq-sdk");
const aiRepo = require("../Repositories/ai.repository");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "gsk_demo_key_for_testing",
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

function appError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function getUserProgress(userId, courseId) {
    const lessons = await aiRepo.getLessonsWithProgress({ userId, courseId });

    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((l) => l.completed).length;
    const progressPercentage =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
        totalLessons,
        completedLessons,
        progressPercentage,
        lessons: lessons.map((l) => ({
            id: l.lesson_id,
            title: l.lesson_title,
            orderIndex: l.order_index,
            completed: l.completed,
            completedAt: l.completed_at,
        })),
    };
}

async function getAllCourses() {
    return await aiRepo.getAllCourses();
}

async function getLessonContext(lessonId) {
    return await aiRepo.getLessonContext(lessonId);
}

async function chat({ userId, message, lessonId, courseId }) {
    if (!message) {
        throw appError(400, "Vui lòng nhập câu hỏi");
    }

    try {
        const isProgressQuestion = /tiến độ|progress|học đến đâu|hoàn thành|đã học|chưa học/i.test(message);
        const isCourseListQuestion = /có những|danh sách|khóa học nào|course nào/i.test(message);

        let contextData = "";

        if (isProgressQuestion) {
            const targetCourseId = courseId || 2;
            const progress = await getUserProgress(userId, targetCourseId);

            contextData = `\n\nDỮ LIỆU TIẾN ĐỘ HỌC TẬP:\n- Tổng số bài: ${progress.totalLessons}\n- Đã hoàn thành: ${progress.completedLessons}\n- Tiến độ: ${progress.progressPercentage}%\n\nChi tiết các bài học:\n${progress.lessons
                .map(
                    (l) =>
                        `- ${l.completed ? "✅" : "⬜"} Bài ${l.orderIndex}: ${l.title}${l.completed
                            ? ` (Hoàn thành: ${new Date(l.completedAt).toLocaleDateString("vi-VN")})`
                            : ""
                        }`
                )
                .join("\n")}`;
        } else if (isCourseListQuestion) {
            const courses = await getAllCourses();

            contextData = `\n\nDANH SÁCH KHÓA HỌC:\n${courses
                .map(
                    (c) =>
                        `- ${c.title}: ${c.description || "Không có mô tả"} (${c.lesson_count} bài học)`
                )
                .join("\n")}`;
        } else if (lessonId) {
            const lesson = await getLessonContext(lessonId);
            if (lesson) {
                contextData = `\n\nBÀI HỌC:\nTiêu đề: ${lesson.title}\nNội dung: ${lesson.content}`;
            }
        }

        const userPrompt = contextData
            ? `${contextData}\n\nCÂU HỎI CỦA HỌC VIÊN: ${message}`
            : `CÂU HỎI: ${message}\n\n(Lưu ý: Đây là câu hỏi chung, không liên quan đến bài học hoặc tiến độ cụ thể)`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;

        return {
            message: aiResponse,
            lessonId: lessonId || null,
            courseId: courseId || null,
            hasContext: !!contextData,
            degraded: false,
        };
    } catch (error) {
        console.error("AI Error:", error.message);

        return {
            message:
                "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ giảng viên để được hỗ trợ tốt hơn.",
            lessonId: lessonId || null,
            courseId: courseId || null,
            hasContext: false,
            degraded: true,
        };
    }
}

module.exports = {
    chat,
};
