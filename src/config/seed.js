const pool = require("./db");

async function seed() {
  try {
    // Kiểm tra xem đã có course "Iterative Model" chưa
    const existingCourse = await pool.query(
      "SELECT id FROM courses WHERE title = $1",
      ["Iterative Model"]
    );

    if (existingCourse.rows.length > 0) {
      console.log("⚠️  Seed data đã tồn tại, bỏ qua để tránh trùng lặp");
      process.exit(0);
    }

    // Tạo course mới
    const course = await pool.query(`
      INSERT INTO courses (title, description)
      VALUES ('Iterative Model', 'Course sample')
      RETURNING *
    `);

    const courseId = course.rows[0].id;

    // Tạo 3 lessons
    await pool.query(
      `INSERT INTO lessons (course_id, title, content, order_index)
       VALUES
         ($1, 'Intro', 'Content of intro', 1),
         ($1, 'Phase 1', 'Content of phase 1', 2),
         ($1, 'Phase 2', 'Content of phase 2', 3)
      `,
      [courseId]
    );

    console.log("✅ Seed done");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();