const courseRepo = require("../Repositories/course.repository");


function appError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function getAllCourses() {
    return await courseRepo.getAllCourses();
}

async function getCourseById(id) {
    const course = await courseRepo.getCourseById(id);
    if (!course) {
        throw appError(404, "Course not found");
    }
    const lessons = await courseRepo.getLessonsByCourseId(id);
    return { course, lessons };
}

async function createCourse({ title, description }) {
    return await courseRepo.createCourse({ title, description });
}

async function updateCourse({ id, title, description }) {
    const update = await courseRepo.updateCourse({ id, title, description });
    if (!update) throw appError(404, "Course not found");
    return update
}

async function deleteCourse(id) {
    const deleted = await courseRepo.deleteCourse(id);
    if (!deleted) throw appError(404, "Course not found");
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
