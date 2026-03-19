# Hướng Dẫn Chạy Bảng Test Trên Postman
> Tài liệu này hướng dẫn thực hiện từng dòng trong `BangTestBackend_Postman_Version6.md` trên Postman.

---

## Chuẩn Bị (Làm 1 lần duy nhất)

### 1. Khởi động server
```bash
cd backend
npm start
```
Server chạy tại `http://localhost:3001`. Giữ terminal này mở trong suốt quá trình test.

### 2. Tạo Environment trong Postman
1. Postman → góc trên phải → click **Environments** → **+**
2. Đặt tên: `PLearn`
3. Thêm 3 biến:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:3001` |
| `admin_token` | _(để trống)_ |
| `user_token` | _(để trống)_ |

4. **Save** → chọn environment `PLearn` ở dropdown góc trên phải

### 3. Lấy token (Bắt buộc trước khi test)

**Lấy admin token:**
- Method: `POST` | URL: `{{base_url}}/api/auth/login`
- Tab **Body** → **raw** → **JSON**:
```json
{ "email": "admin@plearn.com", "password": "Admin@123" }
```
- Send → copy giá trị `token` trong response → dán vào biến `admin_token` trong Environment → Save

**Lấy user token:**
- Tương tự, body:
```json
{ "email": "postman@test.com", "password": "postman123" }
```
- Copy token → dán vào `user_token` → Save

---

## Cách Dùng Authorization Trong Postman

Với mọi request cần token, làm như sau:
1. Chọn tab **Authorization**
2. Type: **Bearer Token**
3. Token: nhập `{{admin_token}}` hoặc `{{user_token}}`

Với request **không cần token**: chọn **No Auth** hoặc để trống.

---

## Iteration 1 — Xác Thực & Database

---

### Dòng 1 — `POST /api/auth/register` (email hợp lệ)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/auth/register` |
| Authorization | No Auth |
| Body (raw JSON) | xem bên dưới |

```json
{
  "name": "Nguyen Van A",
  "email": "newuser@test.com",
  "password": "password123"
}
```

**Kỳ vọng:** Status `201` — response có `token`, password trong DB được hash (không phải plain text)

---

### Dòng 2 — `POST /api/auth/register` (email trùng)

Dùng lại request trên, **giữ nguyên body** (email `newuser@test.com` vừa tạo) → **Send**

**Kỳ vọng:** Status `409 Conflict` — message thông báo email đã tồn tại

---

### Dòng 3 — `POST /api/auth/login` (đúng thông tin)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/auth/login` |
| Authorization | No Auth |

```json
{
  "email": "postman@test.com",
  "password": "postman123"
}
```

**Kỳ vọng:** Status `200` — có `token` + `user` (id, email, role)

---

### Dòng 4 — `POST /api/auth/login` (sai mật khẩu)

Dùng lại request trên, đổi password thành `saimatkhau` → **Send**

**Kỳ vọng:** Status `401 Unauthorized` — message lỗi rõ ràng

---

### Dòng 5 — `GET /api/auth/profile` (có token)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/auth/profile` |
| Authorization | Bearer Token → `{{user_token}}` |

**Kỳ vọng:** Status `200` — trả đúng thông tin user đang đăng nhập

---

### Dòng 6 — `GET /api/auth/profile` (không token)

Dùng lại request trên → tab **Authorization** → chọn **No Auth** → **Send**

**Kỳ vọng:** Status `401 Unauthorized`

---

## Iteration 2 — Quản Lý Course, Lesson, Progress

---

### Dòng 7 — `GET /api/courses` (danh sách tất cả)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/courses` |
| Authorization | No Auth |

**Kỳ vọng:** Status `200` — mảng các course, mỗi course có trường `lesson_count` đúng số bài

---

### Dòng 8 — `GET /api/courses/:id` (chi tiết course)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/courses/2` |
| Authorization | No Auth |

**Kỳ vọng:** Status `200` — object có `course` + mảng `lessons`

> Thử thêm với ID không tồn tại: `{{base_url}}/api/courses/9999` → kỳ vọng `404`

---

### Dòng 9 — `POST /api/courses` (admin tạo course)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/courses` |
| Authorization | Bearer Token → `{{admin_token}}` |

```json
{
  "title": "Khóa học mới",
  "description": "Mô tả khóa học"
}
```

**Kỳ vọng:** Status `201` — trả về course vừa tạo có `id`  
**Kiểm tra thêm:** Gọi lại `GET /api/courses` → course mới xuất hiện trong danh sách

---

### Dòng 10 — `POST /api/courses` (user thường — bị chặn)

Dùng lại request trên → đổi Authorization → `{{user_token}}` → **Send**

**Kỳ vọng:** Status `403 Forbidden`

---

### Dòng 11 — `PUT /api/courses/:id` (admin sửa course)

| Trường | Giá trị |
|--------|---------|
| Method | `PUT` |
| URL | `{{base_url}}/api/courses/2` |
| Authorization | Bearer Token → `{{admin_token}}` |

```json
{
  "title": "Tên khóa học đã cập nhật",
  "description": "Mô tả mới"
}
```

**Kỳ vọng:** Status `200` — response trả về dữ liệu đã cập nhật

---

### Dòng 12 — `DELETE /api/courses/:id` (admin xóa course)

| Trường | Giá trị |
|--------|---------|
| Method | `DELETE` |
| URL | `{{base_url}}/api/courses/99` |
| Authorization | Bearer Token → `{{admin_token}}` |

> Dùng ID của course vừa tạo ở Dòng 9 để tránh xóa dữ liệu quan trọng

**Kỳ vọng:** Status `200` — message xác nhận đã xóa  
**Kiểm tra thêm:** Gọi `GET /api/courses` → course đó không còn trong danh sách

---

### Dòng 13 — `GET /api/lessons/:id` (xem bài học)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/lessons/1` |
| Authorization | Bearer Token → `{{user_token}}` |

**Kỳ vọng:** Status `200` — có đủ trường `title`, `content`, `completed` (true/false theo tiến độ user)

---

### Dòng 14 — `POST /api/lessons` (admin tạo lesson)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/lessons` |
| Authorization | Bearer Token → `{{admin_token}}` |

```json
{
  "course_id": 2,
  "title": "Bài học mới",
  "content": "Nội dung bài học...",
  "order_index": 4
}
```

**Kỳ vọng:** Status `201` — lesson được thêm vào đúng course  
**Kiểm tra thêm:** Gọi `GET /api/courses/2` → lesson mới xuất hiện trong danh sách

---

### Dòng 15 — `PUT /api/lessons/:id` (admin sửa lesson)

| Trường | Giá trị |
|--------|---------|
| Method | `PUT` |
| URL | `{{base_url}}/api/lessons/1` |
| Authorization | Bearer Token → `{{admin_token}}` |

```json
{
  "title": "Tiêu đề bài học đã sửa",
  "content": "Nội dung đã cập nhật",
  "order_index": 1
}
```

**Kỳ vọng:** Status `200` — lesson cập nhật đúng

---

### Dòng 16 — `DELETE /api/lessons/:id` (admin xóa lesson)

| Trường | Giá trị |
|--------|---------|
| Method | `DELETE` |
| URL | `{{base_url}}/api/lessons/99` |
| Authorization | Bearer Token → `{{admin_token}}` |

> Dùng ID lesson vừa tạo ở Dòng 14

**Kỳ vọng:** Status `200` — lesson không còn trong course

---

### Dòng 17 — `POST /api/lessons/:id/complete` (đánh dấu hoàn thành)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/lessons/1/complete` |
| Authorization | Bearer Token → `{{user_token}}` |
| Body | Không cần |

**Kỳ vọng:** Status `200` — `user_progress` tăng đúng  
**Kiểm tra thêm:** Gọi lại `GET /api/lessons/1` với `{{user_token}}` → `completed: true`

---

### Dòng 18 — `POST /api/lessons/:id/complete` (không token)

Dùng lại request trên → Authorization → **No Auth** → **Send**

**Kỳ vọng:** Status `401 Unauthorized`

---

### Dòng 19 — `GET /api/courses` (course không có lesson)

Tạo course mới (Dòng 9) nhưng không thêm lesson → Gọi `GET /api/courses/:id` với ID course đó

**Kỳ vọng:** Status `200` — `lesson_count = 0`, mảng `lessons` rỗng `[]`

---

## Iteration 3 — AI Chat & Progress

---

### Dòng 20 — `POST /api/ai/chat` (hỏi về bài học)

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `{{base_url}}/api/ai/chat` |
| Authorization | Bearer Token → `{{user_token}}` |

```json
{
  "message": "Iterative Model có ưu điểm gì?",
  "lessonId": 1
}
```

**Kỳ vọng:** Status `200`
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

### Dòng 21 — `POST /api/ai/chat` (AI bị lỗi — fail-safe)

1. Mở file `backend/.env` → đổi `GROQ_API_KEY` thành giá trị sai (vd: `GROQ_API_KEY=sai`)
2. Restart server: `Ctrl+C` → `npm start`
3. Gửi lại request như Dòng 20

**Kỳ vọng:** Status `200` — `degraded: true`, message thân thiện, server **không crash**

> Nhớ đổi lại API key đúng sau khi test xong rồi restart server

---

### Dòng 22 — `GET /api/progress/:courseId` (user đã học)

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `{{base_url}}/api/progress/2` |
| Authorization | Bearer Token → `{{user_token}}` |

**Kỳ vọng:** Status `200` — có `totalLessons`, `completedLessons`, `progressPercentage` đúng số

---

### Dòng 23 — `GET /api/progress/:courseId` (user mới chưa học)

1. Đăng ký user mới (Dòng 1) → login lấy token mới
2. Gọi `GET /api/progress/2` với token mới đó

**Kỳ vọng:** Status `200` — `completedLessons = 0`, `progressPercentage = 0`

---

### Dòng 24 — `POST /api/lessons/:id/complete` (complete lại bài đã xong)

Gọi lại `POST /api/lessons/1/complete` với `{{user_token}}` (bài đã complete ở Dòng 17)

**Kỳ vọng:** Status `200` — không lỗi, progress **không tăng thêm** (vẫn đúng số cũ)

---

## Iteration 4 — Admin, Error & Edge Case

---

### Dòng 25 — Admin thực hiện đầy đủ CRUD

Lần lượt chạy với `{{admin_token}}`:

| Request | Kỳ vọng |
|---------|---------|
| `POST /api/courses` | `201` |
| `PUT /api/courses/:id` | `200` |
| `DELETE /api/courses/:id` | `200` |
| `POST /api/lessons` | `201` |
| `PUT /api/lessons/:id` | `200` |
| `DELETE /api/lessons/:id` | `200` |

**Kỳ vọng:** Tất cả thành công

---

### Dòng 26 — User thường cố gọi API Admin

Dùng lại các request trên, đổi Authorization → `{{user_token}}` → Send từng cái

**Kỳ vọng:** Tất cả trả `403 Forbidden`

---

### Dòng 27 — Giả lập lỗi DB/network

Tắt kết nối DB (đổi `DATABASE_URL` trong `.env` thành sai) → restart server → gọi bất kỳ API nào

**Kỳ vọng:** Status `500` hoặc mã lỗi hợp lý — message **không tiết lộ** thông tin nhạy cảm (connection string, stack trace)

> Nhớ đổi lại `DATABASE_URL` đúng sau khi test

---

### Dòng 28 — Dữ liệu rỗng / edge case

| Request | Kỳ vọng |
|---------|---------|
| `GET /api/courses/9999` | `404` |
| `GET /api/lessons/9999` | `404` |
| `GET /api/progress/9999` với `{{user_token}}` | `404` |
| `POST /api/lessons/9999/complete` với `{{user_token}}` | `404` |
| `GET /api/courses/:id` course không có lesson | `200` + `lessons: []` |

---

### Dòng 29 — Test trên thiết bị di động

1. Tìm IP máy tính trong mạng LAN: `ipconfig` (Windows) → lấy IPv4 (vd: `192.168.1.5`)
2. Đổi `base_url` trong Environment thành `http://192.168.1.5:3001`
3. Mở Postman trên điện thoại hoặc máy khác cùng mạng
4. Gửi một số request cơ bản (login, GET courses, GET lessons)

**Kỳ vọng:** Kết quả giống hệt khi test trên desktop

---

## Bảng Tổng Hợp Kết Quả

Điền `✅` hoặc `❌` sau khi test từng dòng.

| Dòng | API | Method | Auth | Kỳ vọng | Kết quả |
|------|-----|--------|------|---------|---------|
| 1 | /api/auth/register | POST | — | 201 + token | |
| 2 | /api/auth/register | POST | — | 409 email trùng | |
| 3 | /api/auth/login | POST | — | 200 + token | |
| 4 | /api/auth/login | POST | — | 401 sai pass | |
| 5 | /api/auth/profile | GET | user | 200 + user info | |
| 6 | /api/auth/profile | GET | — | 401 | |
| 7 | /api/courses | GET | — | 200 + lesson_count | |
| 8 | /api/courses/:id | GET | — | 200 + lessons | |
| 9 | /api/courses | POST | admin | 201 | |
| 10 | /api/courses | POST | user | 403 | |
| 11 | /api/courses/:id | PUT | admin | 200 | |
| 12 | /api/courses/:id | DELETE | admin | 200 | |
| 13 | /api/lessons/:id | GET | user | 200 + completed | |
| 14 | /api/lessons | POST | admin | 201 | |
| 15 | /api/lessons/:id | PUT | admin | 200 | |
| 16 | /api/lessons/:id | DELETE | admin | 200 | |
| 17 | /api/lessons/:id/complete | POST | user | 200 | |
| 18 | /api/lessons/:id/complete | POST | — | 401 | |
| 19 | /api/courses/:id (trống) | GET | — | 200 + lessons:[] | |
| 20 | /api/ai/chat | POST | user | 200 + hasContext:true | |
| 21 | /api/ai/chat | POST | user | 200 + degraded:true | |
| 22 | /api/progress/:courseId | GET | user | 200 + % tiến độ | |
| 23 | /api/progress/:courseId | GET | user mới | 200 + 0% | |
| 24 | /api/lessons/:id/complete (lại) | POST | user | 200 không tăng | |
| 25 | CRUD course+lesson | POST/PUT/DELETE | admin | 200/201 | |
| 26 | CRUD course+lesson | POST/PUT/DELETE | user | 403 | |
| 27 | Lỗi DB giả lập | bất kỳ | — | 500 không lộ info | |
| 28 | ID không tồn tại | GET/POST | — | 404 | |
| 29 | Test mobile/LAN | bất kỳ | — | Giống desktop | |

---

## Tài Khoản Test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@plearn.com | Admin@123 |
| User | postman@test.com | postman123 |

---

## Lưu Ý

- Luôn chọn đúng **Method** trước khi Send
- Body JSON: tab **Body** → **raw** → dropdown chọn **JSON**
- Nếu báo lỗi kết nối: kiểm tra `npm start` đã chạy và đúng port `3001`
- Sau mỗi test ghi kết quả vào bảng tổng hợp để theo dõi tiến độ nhóm
