const lessonRepo = require("../Repositories/lesson.repository");

function appError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function getLessonById({ id, userId }) {
    const lesson = await lessonRepo.findLessonById(id);

    if (!lesson) {
        throw appError(404, "Lesson not found");
    }

    let completed = false;

    if (userId) {
        const progress = await lessonRepo.findUserLessonProgress({
            userId,
            lessonId: id,
        });

        if (progress) {
            completed = progress.completed;
        }
    }

    return {
        ...lesson,
        completed,
    };
}

async function completeLesson({ id, userId }) {
    const lesson = await lessonRepo.findLessonById(id);

    if (!lesson) {
        throw appError(404, "Lesson not found");
    }

    const existing = await lessonRepo.findUserProgressRecord({ userId, lessonId: id });

    if (!existing) {
        await lessonRepo.insertCompletedUserProgress({ userId, lessonId: id });
    } else {
        await lessonRepo.markUserProgressCompleted({ userId, lessonId: id });
    }
}

async function createLesson({ course_id, title, content, order_index }) {
    if (!course_id || !title || !content || order_index === undefined || order_index === null) {
        throw appError(400, "Vui lòng điền đầy đủ thông tin bài học");
    }

    if (order_index < 1 || !Number.isInteger(Number(order_index))) {
        throw appError(400, "Thứ tự bài học phải là số nguyên dương");
    }

    return await lessonRepo.createLessonWithReorder({
        course_id,
        title,
        content,
        order_index,
    });
}

async function updateLesson({ id, title, content, order_index }) {
    const updated = await lessonRepo.updateLessonWithReorder({
        id,
        title,
        content,
        order_index,
    });

    if (!updated) {
        throw appError(404, "Lesson not found");
    }

    return updated;
}

async function deleteLesson(id) {
    const deleted = await lessonRepo.deleteLessonWithReorder(id);

    if (!deleted) {
        throw appError(404, "Lesson not found");
    }
}

module.exports = {
    getLessonById,
    completeLesson,
    createLesson,
    updateLesson,
    deleteLesson,
};
