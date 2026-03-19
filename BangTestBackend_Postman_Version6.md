# Bảng Test Backend (Kiểm thử trên Postman)

---

## Iteration 1: Xác thực & Database

| API | Method | Đầu vào | Mô tả | Kỳ vọng đầu ra | Check |
|-----|--------|---------|-------|---------------|-------|
| /api/auth/register | POST | JSON: email, password hợp lệ | Đăng ký với email & password hợp lệ | 201, trả token; password được hash trong DB |  |
| /api/auth/register | POST | JSON: email trùng với user đã có | Đăng ký với email đã tồn tại | 409 Conflict, thông báo lỗi cụ thể |  |
| /api/auth/login | POST | JSON: email, password đúng | Đăng nhập với email & password đúng | 200 OK, trả token và user info |  |
| /api/auth/login | POST | JSON: email đúng, password sai | Đăng nhập với sai mật khẩu | 401 Unauthorized, message lỗi rõ ràng |  |
| /api/auth/profile | GET | Bearer Token user hợp lệ | Lấy thông tin cá nhân khi đã đăng nhập | 200, trả đúng user info |  |
| /api/auth/profile | GET | Không Bearer Token | Lấy profile khi chưa đăng nhập | 401 Unauthorized |  |

---

## Iteration 2: Quản lý Course, Lesson, Progress

| API | Method | Đầu vào | Mô tả | Kỳ vọng đầu ra | Check |
|-----|--------|---------|-------|---------------|-------|
| /api/courses | GET | Không cần | Xem danh sách tất cả khóa học | 200, mảng course, lesson_count đúng |  |
| /api/courses/:id | GET | courseId hợp lệ | Xem chi tiết một khóa học | 200, object course + list lessons đúng |  |
| /api/courses | POST | JSON course, Bearer admin | Tạo mới khóa học với tài khoản admin | 201 Created, course mới xuất hiện ở GET |  |
| /api/courses | POST | JSON, Bearer user thường | Tạo khóa học với tài khoản user thường | 403 Forbidden |  |
| /api/courses/:id | PUT | JSON update, Bearer admin | Sửa thông tin khóa học với admin | 200, dữ liệu cập nhật đúng |  |
| /api/courses/:id | DELETE | courseId, Bearer admin | Xoá khóa học với admin | 200, course không còn ở GET |  |
| /api/lessons/:id | GET | lessonId, Bearer user | Xem chi tiết một bài học | 200, đủ trường, trạng thái progress |  |
| /api/lessons | POST | JSON lesson, Bearer admin | Tạo mới bài học với admin | 201, lesson thêm vào đúng course |  |
| /api/lessons/:id | PUT | JSON update, Bearer admin | Sửa bài học với admin | 200, lesson cập nhật đúng |  |
| /api/lessons/:id | DELETE | lessonId, Bearer admin | Xoá bài học với admin | 200, lesson không còn trong course |  |
| /api/lessons/:id/complete | POST | lessonId, Bearer user | Đánh dấu hoàn thành bài học | 200, user_progress tăng đúng |  |
| /api/lessons/:id/complete | POST | lessonId, không token | Đánh dấu hoàn thành khi chưa đăng nhập | 401 Unauthorized |  |
| /api/courses | GET | Course không có lesson | Xem khóa học trống (lesson_count = 0) | 200, lesson_count = 0, lessons rỗng |  |

---

## Iteration 3: AI Chat, Progress

| API | Method | Đầu vào | Mô tả | Kỳ vọng đầu ra | Check |
|-----|--------|---------|-------|---------------|-------|
| /api/ai/chat | POST | JSON: lessonId, message, Bearer user | Gửi câu hỏi AI với context bài học qua token user | 200, trả lời tiếng Việt, đúng nội dung bài học |  |
| /api/ai/chat | POST | Gây lỗi AI/sai API | Kiểm thử AI bị lỗi hoặc sai API | 200, degraded:true + message thân thiện |  |
| /api/progress/:courseId | GET | courseId, Bearer user | Kiểm tra tiến độ học với user đã học | 200, số bài, đã hoàn thành, % đúng |  |
| /api/progress/:courseId | GET | courseId, user mới chưa học | Tiến độ user chưa học gì | 200, đã hoàn thành = 0, % = 0 |  |
| /api/lessons/:id/complete | POST | Đã completed, gửi lại | Kiểm tra đánh dấu hoàn thành lại bài học | 200, không lỗi, trạng thái vẫn đúng |  |

---

## Iteration 4: Admin, Error, Edge Case

| API | Method | Đầu vào | Mô tả | Kỳ vọng đầu ra | Check |
|-----|--------|---------|-------|---------------|-------|
| POST/PUT/DELETE course/lesson | POST/PUT/DELETE | Bearer admin | Test đầy ��ủ quyền admin trên khóa học/bài học | Tất cả thao tác thành công |  |
| POST/PUT/DELETE course/lesson | POST/PUT/DELETE | Bearer user thường | Kiểm tra user thường thao tác khóa học/bài học | 403 Forbidden |  |
| -- | -- | Lỗi giả lập (DB/network) | Kiểm thử hệ thống khi lỗi DB, network | 500 hoặc mã lỗi hợp lý, message không tiết lộ thông tin nhạy cảm |  |
| -- | -- | Course/lesson trống, user chưa có progress | Test các trường hợp dữ liệu rỗng | 200, trả dữ liệu rỗng, không lỗi |  |
| -- | -- | Test API trên Postman mobile/app | Kiểm tra API trên thiết bị di động | Output giống trên PC, data giống, error giống |  |

---

> **Bạn có thể copy bảng này vào Excel hoặc Google Sheets để tick vào cột Check, teamwork thuận tiện.**