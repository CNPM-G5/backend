# 📮 Hướng Dẫn Test API Trên Postman — PLearn Backend

## ⚙️ Setup

### 1. Import Collection
1. Mở Postman → Click **Import**
2. Chọn file `postman_collection.json`
3. Collection **PLearn Backend API** xuất hiện

### 2. Tạo Environment
1. Click **Environments** → **New**
2. Đặt tên: `PLearn Local`
3. Thêm 3 variables:

| Variable | Initial Value |
|----------|--------------|
| `base_url` | `http://localhost:3001` |
| `admin_token` | _(để trống, tự điền sau login)_ |
| `user_token` | _(để trống, tự điền sau login)_ |

4. **Save** → Chọn environment `PLearn Local`

### 3. Start Server
```bash
cd backend
npm start
# Server running on port 3001
```

---

## 🔑 BƯỚC BẮT BUỘC: Lấy Token

> Phải chạy 2 request này trước, token sẽ tự lưu vào variable.

### Login Admin
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "admin@plearn.com",
  "password": "Admin@123"
}
```
- **Expected:** `200` — token tự lưu vào `{{admin_token}}`

### Login User
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "postman@test.com",
  "password": "postman123"
}
```
- **Expected:** `200` — token tự lưu vào `{{user_token}}`

---

## 1️⃣ AUTH API

### POST /api/auth/register
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Body:**
```json
{
  "name": "Test User",
  "email": "newuser@test.com",
  "password": "password123"
}
```

| Case | Expected |
|------|----------|
| Đủ thông tin | `201` + token |
| Email đã tồn tại | `409` |
| Thiếu field | `400` |

---

### POST /api/auth/login
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body:**
```json
{
  "email": "admin@plearn.com",
  "password": "Admin@123"
}
```

| Case | Expected |
|------|----------|
| Đúng credentials | `200` + token + user |
| Sai password | `401` |
| Email không tồn tại | `401` |
| Thiếu field | `400` |

---

### GET /api/auth/profile
- **Method:** `GET`
- **URL:** `{{base_url}}/api/auth/profile`
- **Header:** `Authorization: Bearer {{admin_token}}`

| Case | Expected |
|------|----------|
| Có token hợp lệ | `200` + user info |
| Không có token | `401` |
| Token sai | `401` |

---

## 2️⃣ COURSE API

### GET /api/courses — Lấy tất cả
- **Method:** `GET`
- **URL:** `{{base_url}}/api/courses`
- **Header:** Không cần

**Expected `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Iterative Model",
      "description": "Course sample",
      "lesson_count": 3
    }
  ]
}
```

| Case | Expected |
|------|----------|
| Gọi bình thường | `200` + array có `lesson_count` |

---

### GET /api/courses/:id — Chi tiết course
- **Method:** `GET`
- **URL:** `{{base_url}}/api/courses/2`

**Expected `200`:**
```json
{
  "success": true,
  "data": {
    "course": { "id": 2, "title": "..." },
    "lessons": [
      { "id": 1, "title": "Intro", "order_index": 1 }
    ]
  }
}
```

| Case | Expected |
|------|----------|
| ID tồn tại | `200` + course + lessons |
| ID không tồn tại | `404` |

---

### POST /api/courses — Tạo course (Admin only)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/courses`
- **Header:** `Authorization: Bearer {{admin_token}}`
- **Body:**
```json
{
  "title": "New Course",
  "description": "Course description"
}
```

| Case | Token | Expected |
|------|-------|----------|
| Admin | `{{admin_token}}` | `201` + course data |
| User thường | `{{user_token}}` | `403 Forbidden` |
| Không có token | _(bỏ header)_ | `401 Unauthorized` |

---

### PUT /api/courses/:id — Cập nhật (Admin only)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/courses/2`
- **Header:** `Authorization: Bearer {{admin_token}}`
- **Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

| Case | Token | Expected |
|------|-------|----------|
| Admin | `{{admin_token}}` | `200` + updated data |
| User thường | `{{user_token}}` | `403` |
| Không có token | _(bỏ header)_ | `401` |
| ID không tồn tại | `{{admin_token}}` | `404` |

---

### DELETE /api/courses/:id — Xóa (Admin only)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/courses/99`
- **Header:** `Authorization: Bearer {{admin_token}}`

| Case | Token | Expected |
|------|-------|----------|
| Admin, ID tồn tại | `{{admin_token}}` | `200` + message |
| User thường | `{{user_token}}` | `403` |
| Không có token | _(bỏ header)_ | `401` |
| ID không tồn tại | `{{admin_token}}` | `404` |

---

## 3️⃣ LESSON API

### GET /api/lessons/:id — Xem bài học
- **Method:** `GET`
- **URL:** `{{base_url}}/api/lessons/1`

**Không có token — Expected `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Intro",
    "content": "Iterative Model là...",
    "completed": false
  }
}
```

**Có token — `completed` phản ánh đúng progress:**
- **Header:** `Authorization: Bearer {{user_token}}`

| Case | Header | Expected |
|------|--------|----------|
| Không có token | _(bỏ header)_ | `200` + `completed: false` |
| Có token, chưa học | `{{user_token}}` | `200` + `completed: false` |
| Có token, đã học | `{{user_token}}` | `200` + `completed: true` |
| ID không tồn tại | _(bất kỳ)_ | `404` |

---

### POST /api/lessons/:id/complete — Đánh dấu hoàn thành
- **Method:** `POST`
- **URL:** `{{base_url}}/api/lessons/3/complete`
- **Header:** `Authorization: Bearer {{user_token}}`
- **Body:** Không cần

| Case | Expected |
|------|----------|
| Lần đầu complete | `200` + "Lesson marked as completed" |
| Complete lại (idempotent) | `200` + "Lesson marked as completed" |
| Không có token | `401` |
| Lesson không tồn tại | `404` |

---

### POST /api/lessons — Tạo lesson (Admin only)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/lessons`
- **Header:** `Authorization: Bearer {{admin_token}}`
- **Body:**
```json
{
  "course_id": 2,
  "title": "New Lesson",
  "content": "Lesson content here",
  "order_index": 4
}
```

| Case | Token | Expected |
|------|-------|----------|
| Admin | `{{admin_token}}` | `201` + lesson data |
| User thường | `{{user_token}}` | `403` |
| Không có token | _(bỏ header)_ | `401` |

---

### PUT /api/lessons/:id — Cập nhật (Admin only)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/lessons/1`
- **Header:** `Authorization: Bearer {{admin_token}}`
- **Body:**
```json
{
  "title": "Updated Lesson",
  "content": "Updated content",
  "order_index": 1
}
```

| Case | Token | Expected |
|------|-------|----------|
| Admin | `{{admin_token}}` | `200` + updated data |
| User thường | `{{user_token}}` | `403` |
| Không có token | _(bỏ header)_ | `401` |
| ID không tồn tại | `{{admin_token}}` | `404` |

---

### DELETE /api/lessons/:id — Xóa (Admin only)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/lessons/99`
- **Header:** `Authorization: Bearer {{admin_token}}`

| Case | Token | Expected |
|------|-------|----------|
| Admin, ID tồn tại | `{{admin_token}}` | `200` + message |
| User thường | `{{user_token}}` | `403` |
| Không có token | _(bỏ header)_ | `401` |
| ID không tồn tại | `{{admin_token}}` | `404` |

---

## 4️⃣ PROGRESS API

### GET /api/progress/:courseId — Tiến độ học
- **Method:** `GET`
- **URL:** `{{base_url}}/api/progress/2`
- **Header:** `Authorization: Bearer {{user_token}}`

**Expected `200`:**
```json
{
  "success": true,
  "data": {
    "course": { "id": 2, "title": "Iterative Model" },
    "progress": {
      "totalLessons": 3,
      "completedLessons": 2,
      "progressPercentage": 67
    },
    "lessons": [
      { "id": 1, "title": "Intro", "orderIndex": 1, "completed": true, "completedAt": "2026-03-11T..." },
      { "id": 2, "title": "Phase 1", "orderIndex": 2, "completed": true, "completedAt": "2026-03-11T..." },
      { "id": 3, "title": "Phase 2", "orderIndex": 3, "completed": false, "completedAt": null }
    ]
  }
}
```

| Case | Expected |
|------|----------|
| User đã học 2/3 bài | `200` + `progressPercentage: 67` |
| Course không tồn tại | `404` |
| Không có token | `401` |

---

## 5️⃣ AI CHAT API

### POST /api/ai/chat — Chat với AI

- **Method:** `POST`
- **URL:** `{{base_url}}/api/ai/chat`
- **Header:** `Authorization: Bearer {{user_token}}`

---

#### Case 1: Hỏi về nội dung bài học
- **Body:**
```json
{
  "message": "Iterative Model có ưu điểm gì?",
  "lessonId": 1
}
```
**Expected `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Iterative Model có các ưu điểm: linh hoạt, dễ thay đổi yêu cầu...",
    "lessonId": 1,
    "hasContext": true,
    "degraded": false
  }
}
```

---

#### Case 2: Hỏi về tiến độ học tập
- **Body:**
```json
{
  "message": "Tiến độ học tập của tôi thế nào?",
  "courseId": 2
}
```
**Expected `200`:**
```json
{
  "success": true,
  "data": {
    "message": "Tiến độ của bạn là 67%, đã hoàn thành 2/3 bài...",
    "hasContext": true,
    "degraded": false
  }
}
```

---

#### Case 3: Hỏi bài đã hoàn thành
- **Body:**
```json
{
  "message": "Tôi đã hoàn thành những bài nào?",
  "courseId": 2
}
```

---

#### Case 4: Hỏi danh sách khóa học
- **Body:**
```json
{
  "message": "Có những khóa học nào?"
}
```

---

#### Case 5: Hỏi kiến thức chung (không dùng API)
- **Body:**
```json
{
  "message": "Git là gì?"
}
```
**Expected:** `hasContext: false` — AI trả lời từ kiến thức chung

---

#### Case 6: Không có token
- **Body:** `{ "message": "Test" }`
- **Header:** _(bỏ Authorization)_
- **Expected:** `401`

---

#### Case 7: Message rỗng
- **Body:** `{}`
- **Expected:** `400` + "Vui lòng nhập câu hỏi"

---

#### Case 8: AI lỗi (Fail-safe)
Khi GROQ_API_KEY sai/hết quota:
```json
{
  "success": true,
  "data": {
    "message": "Xin lỗi, tôi đang gặp sự cố kỹ thuật...",
    "degraded": true
  }
}
```
> Server vẫn trả `200`, không crash.

---

## 📊 Tổng Hợp Tất Cả Cases

| # | Endpoint | Method | Auth | Expected |
|---|----------|--------|------|----------|
| 1 | /api/auth/register | POST | — | 201 |
| 2 | /api/auth/register | POST | — | 409 (email trùng) |
| 3 | /api/auth/login | POST | — | 200 + token |
| 4 | /api/auth/login | POST | — | 401 (sai pass) |
| 5 | /api/auth/profile | GET | user | 200 |
| 6 | /api/auth/profile | GET | — | 401 |
| 7 | /api/courses | GET | — | 200 + lesson_count |
| 8 | /api/courses/:id | GET | — | 200 + lessons |
| 9 | /api/courses/:id | GET | — | 404 (not found) |
| 10 | /api/courses | POST | admin | 201 |
| 11 | /api/courses | POST | user | 403 |
| 12 | /api/courses | POST | — | 401 |
| 13 | /api/courses/:id | PUT | admin | 200 |
| 14 | /api/courses/:id | PUT | user | 403 |
| 15 | /api/courses/:id | DELETE | admin | 200 |
| 16 | /api/courses/:id | DELETE | user | 403 |
| 17 | /api/lessons/:id | GET | — | 200 + completed:false |
| 18 | /api/lessons/:id | GET | user | 200 + completed:true/false |
| 19 | /api/lessons/:id | GET | — | 404 (not found) |
| 20 | /api/lessons/:id/complete | POST | user | 200 |
| 21 | /api/lessons/:id/complete | POST | user | 200 (re-complete) |
| 22 | /api/lessons/:id/complete | POST | — | 401 |
| 23 | /api/lessons | POST | admin | 201 |
| 24 | /api/lessons | POST | user | 403 |
| 25 | /api/lessons/:id | PUT | admin | 200 |
| 26 | /api/lessons/:id | PUT | user | 403 |
| 27 | /api/lessons/:id | DELETE | admin | 200 |
| 28 | /api/lessons/:id | DELETE | user | 403 |
| 29 | /api/progress/:courseId | GET | user | 200 + stats |
| 30 | /api/progress/:courseId | GET | — | 401 |
| 31 | /api/progress/999 | GET | user | 404 |
| 32 | /api/ai/chat | POST | user | 200 + lesson context |
| 33 | /api/ai/chat | POST | user | 200 + progress context |
| 34 | /api/ai/chat | POST | user | 200 + hasContext:false |
| 35 | /api/ai/chat | POST | — | 401 |
| 36 | /api/ai/chat | POST | user | 400 (empty message) |

---

## 🚀 Quick Run (Automated)

```bash
# Tạo admin (nếu chưa có)
node scripts/createAdmin.js

# Start server
npm start

# Chạy test tự động
node scripts/testAdminAPIs.js
# Expected: ✅ Passed: 25/25
```

---

## 👤 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@plearn.com | Admin@123 |
| User | postman@test.com | postman123 |
