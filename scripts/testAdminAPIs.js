require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const BASE = "http://localhost:3001";
let pass = 0, fail = 0;

async function req(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

function check(label, condition, got) {
  if (condition) {
    console.log(`   ✅ ${label}`);
    pass++;
  } else {
    console.log(`   ❌ ${label} — got: ${JSON.stringify(got)}`);
    fail++;
  }
}

async function run() {
  console.log("=".repeat(60));
  console.log("🧪 ADMIN API TEST SUITE");
  console.log("=".repeat(60));

  // ── 1. Login admin ──────────────────────────────────────────
  console.log("\n📌 [1] Login Admin");
  const adminLogin = await req("POST", "/api/auth/login", {
    email: "admin@plearn.com",
    password: "Admin@123",
  });
  check("Status 200", adminLogin.status === 200, adminLogin.status);
  check("role = admin", adminLogin.data.user?.role === "admin", adminLogin.data.user?.role);
  const adminToken = adminLogin.data.token;

  // ── 2. Login user thường ────────────────────────────────────
  console.log("\n📌 [2] Login User thường");
  const userLogin = await req("POST", "/api/auth/login", {
    email: "postman@test.com",
    password: "postman123",
  });
  check("Status 200", userLogin.status === 200, userLogin.status);
  check("role = user/admin", !!userLogin.data.token, userLogin.data);
  const userToken = userLogin.data.token;

  // ── 3. POST /api/courses (admin) ────────────────────────────
  console.log("\n📌 [3] POST /api/courses — Admin tạo course");
  const createCourse = await req("POST", "/api/courses",
    { title: "Test Admin Course", description: "Created by admin test" },
    adminToken
  );
  check("Status 201", createCourse.status === 201, createCourse.status);
  check("success: true", createCourse.data.success === true, createCourse.data.success);
  check("Có id", !!createCourse.data.data?.id, createCourse.data.data);
  const courseId = createCourse.data.data?.id;

  // ── 4. POST /api/courses (user → 403) ──────────────────────
  console.log("\n📌 [4] POST /api/courses — User thường → 403");
  const createCourseUser = await req("POST", "/api/courses",
    { title: "Should Fail", description: "User cannot create" },
    userToken
  );
  check("Status 403", createCourseUser.status === 403, createCourseUser.status);

  // ── 5. PUT /api/courses/:id (admin) ────────────────────────
  console.log("\n📌 [5] PUT /api/courses/:id — Admin update course");
  const updateCourse = await req("PUT", `/api/courses/${courseId}`,
    { title: "Updated Admin Course", description: "Updated desc" },
    adminToken
  );
  check("Status 200", updateCourse.status === 200, updateCourse.status);
  check("Title updated", updateCourse.data.data?.title === "Updated Admin Course", updateCourse.data.data?.title);

  // ── 6. PUT /api/courses/:id (user → 403) ───────────────────
  console.log("\n📌 [6] PUT /api/courses/:id — User thường → 403");
  const updateCourseUser = await req("PUT", `/api/courses/${courseId}`,
    { title: "Hack", description: "Hack" },
    userToken
  );
  check("Status 403", updateCourseUser.status === 403, updateCourseUser.status);

  // ── 7. POST /api/lessons (admin) ───────────────────────────
  console.log("\n📌 [7] POST /api/lessons — Admin tạo lesson");
  const createLesson = await req("POST", "/api/lessons",
    { course_id: courseId, title: "Test Lesson", content: "Lesson content", order_index: 1 },
    adminToken
  );
  check("Status 201", createLesson.status === 201, createLesson.status);
  check("success: true", createLesson.data.success === true, createLesson.data.success);
  check("Có id", !!createLesson.data.data?.id, createLesson.data.data);
  const lessonId = createLesson.data.data?.id;

  // ── 8. POST /api/lessons (user → 403) ──────────────────────
  console.log("\n📌 [8] POST /api/lessons — User thường → 403");
  const createLessonUser = await req("POST", "/api/lessons",
    { course_id: courseId, title: "Hack", content: "Hack", order_index: 2 },
    userToken
  );
  check("Status 403", createLessonUser.status === 403, createLessonUser.status);

  // ── 9. PUT /api/lessons/:id (admin) ────────────────────────
  console.log("\n📌 [9] PUT /api/lessons/:id — Admin update lesson");
  const updateLesson = await req("PUT", `/api/lessons/${lessonId}`,
    { title: "Updated Lesson", content: "Updated content", order_index: 1 },
    adminToken
  );
  check("Status 200", updateLesson.status === 200, updateLesson.status);
  check("Title updated", updateLesson.data.data?.title === "Updated Lesson", updateLesson.data.data?.title);

  // ── 10. PUT /api/lessons/:id (user → 403) ──────────────────
  console.log("\n📌 [10] PUT /api/lessons/:id — User thường → 403");
  const updateLessonUser = await req("PUT", `/api/lessons/${lessonId}`,
    { title: "Hack", content: "Hack", order_index: 1 },
    userToken
  );
  check("Status 403", updateLessonUser.status === 403, updateLessonUser.status);

  // ── 11. DELETE /api/lessons/:id (admin) ────────────────────
  console.log("\n📌 [11] DELETE /api/lessons/:id — Admin xóa lesson");
  const deleteLesson = await req("DELETE", `/api/lessons/${lessonId}`, null, adminToken);
  check("Status 200", deleteLesson.status === 200, deleteLesson.status);
  check("success: true", deleteLesson.data.success === true, deleteLesson.data.success);

  // ── 12. DELETE /api/lessons/:id (user → 403) ───────────────
  console.log("\n📌 [12] DELETE /api/lessons/:id — User thường → 403");
  // Tạo lesson mới để test delete
  const tmpLesson = await req("POST", "/api/lessons",
    { course_id: courseId, title: "Tmp", content: "Tmp", order_index: 1 },
    adminToken
  );
  const tmpLessonId = tmpLesson.data.data?.id;
  const deleteLessonUser = await req("DELETE", `/api/lessons/${tmpLessonId}`, null, userToken);
  check("Status 403", deleteLessonUser.status === 403, deleteLessonUser.status);
  // Cleanup
  await req("DELETE", `/api/lessons/${tmpLessonId}`, null, adminToken);

  // ── 13. DELETE /api/courses/:id (user → 403) ───────────────
  console.log("\n📌 [13] DELETE /api/courses/:id — User thường → 403");
  const deleteCourseUser = await req("DELETE", `/api/courses/${courseId}`, null, userToken);
  check("Status 403", deleteCourseUser.status === 403, deleteCourseUser.status);

  // ── 14. DELETE /api/courses/:id (admin) ────────────────────
  console.log("\n📌 [14] DELETE /api/courses/:id — Admin xóa course");
  const deleteCourse = await req("DELETE", `/api/courses/${courseId}`, null, adminToken);
  check("Status 200", deleteCourse.status === 200, deleteCourse.status);
  check("success: true", deleteCourse.data.success === true, deleteCourse.data.success);

  // ── 15. No token → 401 ─────────────────────────────────────
  console.log("\n📌 [15] POST /api/courses — Không có token → 401");
  const noToken = await req("POST", "/api/courses", { title: "No token" });
  check("Status 401", noToken.status === 401, noToken.status);

  // ── Summary ─────────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log(`✅ Passed : ${pass}`);
  console.log(`❌ Failed : ${fail}`);
  console.log(`📈 Rate   : ${Math.round((pass / (pass + fail)) * 100)}%`);
  if (fail === 0) console.log("🎉 ALL TESTS PASSED!");
  console.log("=".repeat(60));

  process.exit(fail === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});
