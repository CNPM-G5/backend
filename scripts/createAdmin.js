require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

const ADMIN = {
  name: "Admin",
  email: "admin@plearn.com",
  password: "Admin@123",
};

async function createAdmin() {
  try {
    // Kiểm tra đã tồn tại chưa
    const existing = await pool.query(
      "SELECT id, email, role FROM users WHERE email = $1",
      [ADMIN.email]
    );

    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      if (user.role === "admin") {
        console.log(`✅ Admin đã tồn tại: ${user.email} (id: ${user.id})`);
      } else {
        // Upgrade lên admin
        await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [ADMIN.email]);
        console.log(`✅ Đã upgrade user thành admin: ${user.email}`);
      }
      process.exit(0);
    }

    // Tạo mới
    const hashed = await bcrypt.hash(ADMIN.password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, name, email, role`,
      [ADMIN.name, ADMIN.email, hashed]
    );

    const admin = result.rows[0];
    console.log("✅ Tạo admin thành công!");
    console.log(`   ID   : ${admin.id}`);
    console.log(`   Name : ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role : ${admin.role}`);
    console.log(`   Pass : ${ADMIN.password}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    process.exit(1);
  }
}

createAdmin();
