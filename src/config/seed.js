const pool = require("./db");

async function seed() {
  try {
    const course = await pool.query(`
      INSERT INTO courses (title, description)
      VALUES ('Iterative Model', 'Course sample')
      RETURNING *
    `);

    const courseId = course.rows[0].id;

    await pool.query(
      `INSERT INTO lessons (course_id, title, content)
       VALUES
         ($1, 'Intro', 'Content of intro'),
         ($1, 'Phase 1', 'Content of phase 1'),
         ($1, 'Phase 2', 'Content of phase 2')
      `,
      [courseId]
    );

    console.log("Seed done");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();