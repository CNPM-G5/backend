const progressRepo = require("../Repositories/progress.repository");

function appError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function getCourseProgress({ userId, courseId }) {
    const course = await progressRepo.findCourseById(courseId);

    if (!course) {
        throw appError(404, "Course not found");
    }

    const lessons = await progressRepo.getLessonsWithProgress({ userId, courseId });

    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson) => lesson.completed).length;
    const progressPercentage =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
        course: {
            id: course.id,
            title: course.title,
        },
        progress: {
            totalLessons,
            completedLessons,
            progressPercentage,
        },
        lessons: lessons.map((lesson) => ({
            id: lesson.lesson_id,
            title: lesson.lesson_title,
            orderIndex: lesson.order_index,
            completed: lesson.completed,
            completedAt: lesson.completed_at,
        })),
    };
}

async function getCompletedCourses({ userId }) {
    const courses = await progressRepo.getCompletedCoursesByUserId(userId);

    return {
        completed_courses: courses.length,
        courses,
    };
}

module.exports = {
    getCourseProgress,
    getCompletedCourses,
};
