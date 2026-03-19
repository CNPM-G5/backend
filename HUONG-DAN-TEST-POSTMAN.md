# Hướng Dẫn Test Toàn Bộ Chức Năng Backend Trên Postman
**Project:** PLearn Backend  
**Base URL:** `http://localhost:3001`  
**Database:** Neon/Postgres

---

## Mục Lục
1. [Chuẩn bị môi trường](#1-chuẩn-bị-môi-trường)
2. [Lấy Token (Bắt buộc làm trước)](#2-lấy-token-bắt-buộc-làm-trước)
3. [Iteration 1 — Xác thực (Auth)](#3-iteration-1--xác-thực-auth)
4. [Iteration 2 — Course & Lesson & Progress](#4-iteration-2--course--lesson--progress)
5. [Iteration 3 — AI Chat & Progress nâng cao](#5-iteration-3--ai-chat--progress-nâng-cao)
6. [Iteration 4 — Admin, Error & Edge Case](#6-iteration-4--admin-error--edge-case)
7. [Bảng tổng hợp kết quả](#7-bảng-tổng-hợp-kết-quả)

---

## 1. Chuẩn Bị Môi Trường

### Bước 1 — Khởi động server
```bash
cd backend
npm start
# Server chạy tại http://localhost:3001
```

### Bước 2 — Tạo tài khoản admin (nếu chưa có)
```bash
node scripts/createAdmin.js
```

### Bước 3 — Import Collection vào Postman
1. Mở Postman → Click **Import**
2. Chọn file `postman_collection.json` trong thư mục `backend/`
3. Collection **PLearn Backend API** xuất hiện ở sidebar trái

### Bước 4 — Tạo Environment
1. Click **Environments** (icon bánh răng góc trên phải) → **New**
2. Đặt tên: `PLearn Local`
3. Thêm các biến sau:

| Variable | Initial Value | Ghi chú |
|----------|--------------|---------|
| `base_url` | `http://localhost:3001` | URL server local |
| `admin_token` | _(để trống)_ | Tự điền sau khi login admin |
| `user_token` | _(để trống)_ | Tự điền sau khi login user |

4. Click **Save** → Chọn environment `PLearn Local` ở góc trên phải Postman

---

## 2. Lấy Token (Bắt Buộc Làm Trước)

> Phải hoàn thành bước này trước khi test các API cần xác thực.

### Login Admin

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/auth/login` |
| Body (raw JSON) | `{"email": "admin@plearn.com", "password": "Admin@123"}` |

**Các bước thực hiện:**
1. Tạo request mới → chọn `POST`
2. Nhập URL: `{{base_url}}/api/auth/login`
3. Chọn tab **Body** → chọn **raw** → chọn **JSON**
4. Nhập body:
```json
{
  "email": "admin@plearn.com",
  "password": "Admin@123"
}
```
5. Click **Send**
6. Kết quả trả về `200` → copy giá trị `token` trong response
7. Vào **Environments** → dán token vào `admin_token` → Save

### Login User Thường

Làm tương tự với:
```json
{
  "email": "postman@test.com",
  "password": "postman123"
}
```
Copy token → dán vào `user_token` → Save

---

## 3. Iteration 1 — Xác Thực (Auth)

### Test 1.1 — Đăng ký tài khoản mới (thành công)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/auth/register` |
| Authorization | Không cần |

**Body (raw JSON):**
```json
{
  "name": "Nguyen Van A",
  "email": "newuser@test.com",
  "password": "password123"
}
```

**Các bước:**
1. Tạo request `POST` → URL `{{base_url}}/api/auth/register`
2. Tab **Body** → **raw** → **JSON** → nhập body trên
3. Click **Send**

**Kỳ vọng:** `201 Created` — response có `token` và thông tin user  
**Kiểm tra thêm:** Vào DB Neon xem bảng `users`, password phải được hash (không phải plain text)

---

### Test 1.2 — Đăng ký email đã tồn tại

Dùng lại body của Test 1.1 (email `newuser@test.com` vừa tạo) → Click **Send**

**Kỳ vọng:** `409 Conflict` — message thông báo email đã tồn tại

---

### Test 1.3 — Đăng nhập đúng thông tin

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/auth/login` |

**Body:**
```json
{
  "email": "postman@test.com",
  "password": "postman123"
}
```

**Kỳ vọng:** `200 OK` — có `token` + `user` (id, email, role)

---

### Test 1.4 — Đăng nhập sai mật khẩu

```json
{
  "email": "postman@test.com",
  "password": "saimatkhau"
}
```

**Kỳ vọng:** `401 Unauthorized` — message lỗi

---

### Test 1.5 — Xem profile (có token)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/auth/profile` |
| Authorization | Bearer Token → `{{user_token}}` |

**Các bước:**
1. Tạo request `GET`
2. Tab **Authorization** → Type: **Bearer Token** → Token: `{{user_token}}`
3. Click **Send**

**Kỳ vọng:** `200 OK` — trả về đúng thông tin user đang đăng nhập

---

### Test 1.6 — Xem profile (không có token)

Dùng lại request trên, tab **Authorization** → chọn **No Auth** → Click **Send**

**Kỳ vọng:** `401 Unauthorized`

---

### Test 1.7 — User thường gọi API chỉ dành cho Admin

Thử gọi `POST {{base_url}}/api/courses` với `{{user_token}}` (xem chi tiết ở Test 2.4)

**Kỳ vọng:** `403 Forbidden`

---

### Test 1.8 — Kiểm tra DB sau khi migrate

```bash
node src/config/migrate.js
```

Vào DB Neon kiểm tra 4 bảng đã tạo: `users`, `courses`, `lessons`, `user_progress`

---

## 4. Iteration 2 — Course & Lesson & Progress

### Test 2.1 — Lấy danh sách tất cả khóa học

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/courses` |
| Authorization | Không cần |

**Kỳ vọng:** `200 OK` — array các course, mỗi course có trường `lesson_count` đúng số bài

---

### Test 2.2 — Lấy chi tiết một khóa học

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/courses/2` |
| Authorization | Không cần |

**Kỳ vọng:** `200 OK` — object có `course` + mảng `lessons`

> Thử với ID không tồn tại (vd: `/api/courses/9999`) → kỳ vọng `404`

---

### Test 2.3 — Tạo khóa học mới (Admin)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/courses` |
| Authorization | Bearer Token → `{{admin_token}}` |

**Body:**
```json
{
  "title": "Khóa học mới",
  "description": "Mô tả khóa học"
}
```

**Kỳ vọng:** `201 Created` — trả về course vừa tạo kèm `id`

---

### Test 2.4 — Tạo khóa học (User thường — bị chặn)

Dùng lại request 2.3, đổi Authorization → `{{user_token}}`

**Kỳ vọng:** `403 Forbidden`

---

### Test 2.5 — Cập nhật khóa học (Admin)

| Trường | Giá trị |
|--------|---------|
| Method | `PUT` |
| URL | `{{base_url}}/api/courses/2` |
| Authorization | Bearer Token → `{{admin_token}}` |

**Body:**
```json
{
  "title": "Tên mới đã cập nhật",
  "description": "Mô tả mới"
}
```

**Kỳ vọng:** `200 OK` — trả về course đã được cập nhật

---

### Test 2.6 — Xóa khóa học (Admin)

| Trường | Giá trị |
|--------|---------|
| Method | `DELETE` |
| URL | `{{base_url}}/api/courses/99` |
| Authorization | Bearer Token → `{{admin_token}}` |

**Kỳ vọng:** `200 OK` — message xác nhận đã xóa  
> Dùng ID của course vừa tạo ở Test 2.3 để tránh xóa dữ liệu quan trọng

---

### Test 2.7 — Kiểm tra seed data

```bash
node src/config/seed.js
```

Gọi `GET {{base_url}}/api/courses` → kiểm tra có ít nhất 1 course với 3 lessons mẫu

---

### Test 2.8 — Xem chi tiết bài học (có token)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/lessons/1` |
| Authorization | Bearer Token → `{{user_token}}` |

**Kỳ vọng:** `200 OK` — có `content`, `completed` phản ánh đúng trạng thái học của user

---

### Test 2.9 — Đánh dấu hoàn thành bài học

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/lessons/1/complete` |
| Authorization | Bearer Token → `{{user_token}}` |
| Body | Không cần |

**Kỳ vọng:** `200 OK` — message "Lesson marked as completed"  
**Kiểm tra thêm:** Gọi lại Test 2.8 → `completed` phải là `true`

---

### Test 2.10 — Đánh dấu hoàn thành (không có token)

Dùng lại request 2.9, bỏ Authorization → Click **Send**

**Kỳ vọng:** `401 Unauthorized`

---

### Test 2.11 — Tạo bài học mới (Admin)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/lessons` |
| Authorization | Bearer Token → `{{admin_token}}` |

**Body:**
```json
{
  "course_id": 2,
  "title": "Bài học mới",
  "content": "Nội dung bài học...",
  "order_index": 4
}
```

**Kỳ vọng:** `201 Created` — trả về lesson vừa tạo

---

### Test 2.12 — Cập nhật bài học (Admin)

| Trường | Giá trị |
|--------|---------|
| Method | `PUT` |
| URL | `{{base_url}}/api/lessons/1` |
| Authorization | Bearer Token → `{{admin_token}}` |

**Body:**
```json
{
  "title": "Tiêu đề bài học đã sửa",
  "content": "Nội dung đã cập nhật",
  "order_index": 1
}
```

**Kỳ vọng:** `200 OK`

---

### Test 2.13 — Xóa bài học (Admin)

| Trường | Giá trị |
|--------|---------|
| Method | `DELETE` |
| URL | `{{base_url}}/api/lessons/99` |
| Authorization | Bearer Token → `{{admin_token}}` |

**Kỳ vọng:** `200 OK`  
> Dùng ID lesson vừa tạo ở Test 2.11

---

### Test 2.14 — Course không có bài học

Tạo course mới (Test 2.3) nhưng không thêm lesson → Gọi `GET /api/courses/:id`

**Kỳ vọng:** `200 OK` — `lesson_count = 0`, mảng `lessons` rỗng

---

## 5. Iteration 3 — AI Chat & Progress Nâng Cao

### Test 3.1 — Chat AI hỏi về nội dung bài học

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/ai/chat` |
| Authorization | Bearer Token → `{{user_token}}` |

**Body:**
```json
{
  "message": "Iterative Model có ưu điểm gì?",
  "lessonId": 1
}
```

**Kỳ vọng:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "...(câu trả lời tiếng Việt)...",
    "hasContext": true,
    "degraded": false
  }
}
```

---

### Test 3.2 — Chat AI khi backend lỗi (Fail-safe)

Tạm thời đổi `GROQ_API_KEY` trong `.env` thành giá trị sai → restart server → gửi request như Test 3.1

**Kỳ vọng:** `200 OK` — `degraded: true`, message thân thiện, server không crash  
> Nhớ đổi lại API key đúng sau khi test xong

---

### Test 3.3 — Xem tiến độ học (đã học một số bài)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/progress/2` |
| Authorization | Bearer Token → `{{user_token}}` |

**Kỳ vọng:** `200 OK` — có `totalLessons`, `completedLessons`, `progressPercentage`

---

### Test 3.4 — Xem tiến độ (user mới chưa học bài nào)

Đăng ký user mới (Test 1.1) → login lấy token → gọi `GET /api/progress/2` với token mới

**Kỳ vọng:** `200 OK` — `completedLessons = 0`, `progressPercentage = 0`

---

### Test 3.5 — Complete bài học đã hoàn thành (idempotent)

Gọi lại `POST /api/lessons/1/complete` với `{{user_token}}` (bài đã complete ở Test 2.9)

**Kỳ vọng:** `200 OK` — không lỗi, progress không tăng thêm (vẫn đúng số cũ)

---

## 6. Iteration 4 — Admin, Error & Edge Case

### Test 4.1 — Kiểm tra tài khoản admin trong DB

```bash
node scripts/createAdmin.js
```

Vào DB Neon → bảng `users` → kiểm tra có user `admin@plearn.com` với `role = 'admin'`

---

### Test 4.2 — Admin thực hiện đầy đủ CRUD

Lần lượt thực hiện với `{{admin_token}}`:
- `POST /api/courses` → tạo course
- `PUT /api/courses/:id` → cập nhật
- `DELETE /api/courses/:id` → xóa
- `POST /api/lessons` → tạo lesson
- `PUT /api/lessons/:id` → cập nhật
- `DELETE /api/lessons/:id` → xóa

**Kỳ vọng:** Tất cả đều thành công (`201` hoặc `200`)

---

### Test 4.3 — User thường cố gọi API Admin

Dùng `{{user_token}}` gọi các API trên (POST/PUT/DELETE course, lesson)

**Kỳ vọng:** Tất cả đều trả `403 Forbidden`

---

### Test 4.4 — Kiểm tra Postman Collection

Mở file `postman_collection.json` → đối chiếu với file `POSTMAN-GUIDE.md`  
Kiểm tra: endpoint đúng, request body đúng, response mẫu khớp

---

### Test 4.5 — Error handling — Dữ liệu sai định dạng

Gửi body thiếu field bắt buộc, ví dụ:
```json
{
  "title": ""
}
```
Gọi `POST /api/courses` với `{{admin_token}}`

**Kỳ vọng:** `400 Bad Request` — message lỗi rõ ràng, không crash server

---

### Test 4.6 — Simulate mạng chậm

Trong Postman: **Settings** → **Request timeout** → đặt thấp (vd: 2000ms)  
Gọi `POST /api/ai/chat` với câu hỏi dài

**Kỳ vọng:** Backend trả về đúng kết quả, không timeout sớm bất thường

---

### Test 4.7 — Edge case: Course/Lesson không tồn tại

| Request | Kỳ vọng |
|---------|---------|
| `GET /api/courses/9999` | `404` |
| `GET /api/lessons/9999` | `404` |
| `GET /api/progress/9999` | `404` |
| `POST /api/lessons/9999/complete` | `404` |

---

### Test 4.8 — Test trên thiết bị di động / mạng khác

Thay `localhost` bằng IP máy tính trong mạng LAN (vd: `192.168.1.x:3001`)  
Gửi một số request cơ bản từ Postman trên điện thoại hoặc máy khác

**Kỳ vọng:** Kết quả giống hệt khi test trên desktop

---

## 7. Bảng Tổng Hợp Kết Quả

Điền `✅` hoặc `❌` vào cột **Kết quả** sau khi test.

| # | Endpoint | Method | Auth | Kỳ vọng | Kết quả |
|---|----------|--------|------|---------|---------|
| 1.1 | /api/auth/register | POST | — | 201 + token | |
| 1.2 | /api/auth/register | POST | — | 409 (email trùng) | |
| 1.3 | /api/auth/login | POST | — | 200 + token | |
| 1.4 | /api/auth/login | POST | — | 401 (sai pass) | |
| 1.5 | /api/auth/profile | GET | user | 200 + user info | |
| 1.6 | /api/auth/profile | GET | — | 401 | |
| 1.7 | /api/courses (POST) | POST | user | 403 | |
| 2.1 | /api/courses | GET | — | 200 + lesson_count | |
| 2.2 | /api/courses/:id | GET | — | 200 + lessons | |
| 2.2b | /api/courses/9999 | GET | — | 404 | |
| 2.3 | /api/courses | POST | admin | 201 | |
| 2.4 | /api/courses | POST | user | 403 | |
| 2.5 | /api/courses/:id | PUT | admin | 200 | |
| 2.6 | /api/courses/:id | DELETE | admin | 200 | |
| 2.8 | /api/lessons/:id | GET | user | 200 + completed | |
| 2.9 | /api/lessons/:id/complete | POST | user | 200 | |
| 2.10 | /api/lessons/:id/complete | POST | — | 401 | |
| 2.11 | /api/lessons | POST | admin | 201 | |
| 2.12 | /api/lessons/:id | PUT | admin | 200 | |
| 2.13 | /api/lessons/:id | DELETE | admin | 200 | |
| 2.14 | /api/courses/:id (trống) | GET | — | 200 + lesson_count=0 | |
| 3.1 | /api/ai/chat | POST | user | 200 + hasContext:true | |
| 3.2 | /api/ai/chat | POST | user | 200 + degraded:true | |
| 3.3 | /api/progress/:courseId | GET | user | 200 + % tiến độ | |
| 3.4 | /api/progress/:courseId | GET | user mới | 200 + 0% | |
| 3.5 | /api/lessons/:id/complete | POST | user | 200 (không tăng thêm) | |
| 4.2 | CRUD course/lesson | POST/PUT/DELETE | admin | 200/201 | |
| 4.3 | CRUD course/lesson | POST/PUT/DELETE | user | 403 | |
| 4.5 | /api/courses (body sai) | POST | admin | 400 | |
| 4.7 | /api/courses/9999 | GET | — | 404 | |
| 4.7b | /api/progress/9999 | GET | user | 404 | |

---

## Tài Khoản Test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@plearn.com | Admin@123 |
| User | postman@test.com | postman123 |

## Lưu Ý Quan Trọng

- Luôn chọn đúng **Method** (GET/POST/PUT/DELETE) trước khi gửi
- Với API cần token: tab **Authorization** → **Bearer Token** → nhập `{{admin_token}}` hoặc `{{user_token}}`
- Body JSON: tab **Body** → **raw** → dropdown chọn **JSON**
- Nếu server báo lỗi kết nối: kiểm tra `npm start` đã chạy chưa và đúng port `3001`
- Sau mỗi test nên ghi kết quả vào bảng tổng hợp để theo dõi
