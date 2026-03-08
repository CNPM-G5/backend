const pool = require("./src/config/db");

async function fixDatabase() {
  try {
    console.log("🔧 Bắt đầu fix database...\n");

    // 1. Thêm cột order_index nếu chưa có
    console.log("1️⃣ Kiểm tra và thêm cột order_index...");
    try {
      await pool.query(`
        ALTER TABLE lessons 
        ADD COLUMN IF NOT EXISTS order_index INTEGER
      `);
      console.log("✅ Đã thêm cột order_index");
    } catch (err) {
      console.log("⚠️  Cột order_index đã tồn tại hoặc lỗi:", err.message);
    }

    // 2. Update order_index cho các lesson hiện tại (dựa vào id)
    console.log("\n2️⃣ Update order_index cho lessons hiện tại...");
    const lessons = await pool.query("SELECT id, course_id FROM lessons ORDER BY course_id, id");
    
    let currentCourseId = null;
    let orderIndex = 1;
    
    for (const lesson of lessons.rows) {
      if (lesson.course_id !== currentCourseId) {
        currentCourseId = lesson.course_id;
        orderIndex = 1;
      }
      
      await pool.query(
        "UPDATE lessons SET order_index = $1 WHERE id = $2",
        [orderIndex, lesson.id]
      );
      
      orderIndex++;
    }
    console.log(`✅ Đã update order_index cho ${lessons.rows.length} lessons`);

    // 3. Xóa courses trùng lặp (giữ lại course có id nhỏ nhất)
    console.log("\n3️⃣ Xóa courses trùng lặp...");
    const duplicates = await pool.query(`
      SELECT title, MIN(id) as keep_id, ARRAY_AGG(id) as all_ids
      FROM courses
      GROUP BY title
      HAVING COUNT(*) > 1
    `);

    for (const dup of duplicates.rows) {
      const idsToDelete = dup.all_ids.filter(id => id !== dup.keep_id);
      
      if (idsToDelete.length > 0) {
        console.log(`   Xóa course "${dup.title}" với id: ${idsToDelete.join(", ")}`);
        
        // Chuyển lessons sang course gốc
        await pool.query(
          "UPDATE lessons SET course_id = $1 WHERE course_id = ANY($2)",
          [dup.keep_id, idsToDelete]
        );
        
        // Xóa courses trùng
        await pool.query(
          "DELETE FROM courses WHERE id = ANY($1)",
          [idsToDelete]
        );
      }
    }
    console.log("✅ Đã xóa courses trùng lặp");

    // 4. Kiểm tra lại
    console.log("\n4️⃣ Kiểm tra lại database...\n");
    const courses = await pool.query("SELECT * FROM courses ORDER BY id");
    console.log("📚 COURSES:");
    console.table(courses.rows);

    const lessonsCheck = await pool.query("SELECT id, course_id, title, order_index FROM lessons ORDER BY course_id, order_index");
    console.log("\n📖 LESSONS:");
    console.table(lessonsCheck.rows);

    console.log("\n✅ Hoàn thành fix database!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
}

fixDatabase();
