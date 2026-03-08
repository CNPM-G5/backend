const pool = require("./src/config/db");

async function checkDatabase() {
  try {
    console.log("🔍 Kiểm tra database...\n");

    // Kiểm tra courses
    const courses = await pool.query("SELECT * FROM courses ORDER BY id");
    console.log("📚 COURSES:");
    console.table(courses.rows);

    // Kiểm tra lessons
    const lessons = await pool.query("SELECT * FROM lessons ORDER BY course_id, id");
    console.log("\n📖 LESSONS:");
    console.table(lessons.rows);

    // Kiểm tra user_progress
    const progress = await pool.query("SELECT * FROM user_progress ORDER BY id");
    console.log("\n📊 USER_PROGRESS:");
    console.table(progress.rows);

    // Kiểm tra trùng lặp courses
    const duplicateCourses = await pool.query(`
      SELECT title, COUNT(*) as count
      FROM courses
      GROUP BY title
      HAVING COUNT(*) > 1
    `);

    if (duplicateCourses.rows.length > 0) {
      console.log("\n⚠️  PHÁT HIỆN COURSES TRÙNG LẶP:");
      console.table(duplicateCourses.rows);
    } else {
      console.log("\n✅ Không có courses trùng lặp");
    }

    // Kiểm tra trùng lặp lessons
    const duplicateLessons = await pool.query(`
      SELECT course_id, title, COUNT(*) as count
      FROM lessons
      GROUP BY course_id, title
      HAVING COUNT(*) > 1
    `);

    if (duplicateLessons.rows.length > 0) {
      console.log("\n⚠️  PHÁT HIỆN LESSONS TRÙNG LẶP:");
      console.table(duplicateLessons.rows);
    } else {
      console.log("✅ Không có lessons trùng lặp");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
}

checkDatabase();
