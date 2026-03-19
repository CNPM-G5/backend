# Bảng Test Backend - Kiểm thử Trên Postman
**Repo:** CNPM-G5/backend  
**Ngôn ngữ:** JavaScript (Node.js/Express)  
**Database:** Neon/Postgres

> **Khuyến nghị:** Luôn gửi token qua tab "Authorization" chọn "Bearer Token", trừ lúc test lỗi chưa đăng nhập.

## Iteration 1: Xác thực & Database

| STT | API | Method | Đầu vào (Body/Params/Auth) | Mô tả thao tác trên Postman | Kỳ vọng | Check |
|-----|-----|--------|---------------------------|-----------------------------|---------|-------|
| 1.1 | /api/auth/register | POST | JSON: email, password | Body dạng JSON; không cần token | 201, trả token; kiểm tra DB thấy password được hash |  |
| 1.2 | /api/auth/register | POST | Email trùng với user đã có | Body JSON; không cần token | Đăng ký lại email cũ | 409, thông báo lỗi |  |
| 1.3 | /api/auth/login | POST | JSON: email, password hợp lệ | Body JSON; không cần token | Đăng nhập đúng | 200, trả token, user info |  |
| 1.4 | /api/auth/login | POST | Sai password hoặc email | Body JSON; không cần token | Đăng nhập sai | 401, thông báo lỗi |  |
| 1.5 | /api/auth/profile | GET | Bearer Token | Thêm token vào tab Authorization | Trả về đúng user info |  |
| 1.6 | /api/auth/profile | GET | Không Bearer Token | Không nhập Authorization | 401 Unauthorized |  |
| 1.7 | AdminOnly Middleware | GET/POST/PUT bất kỳ | Bearer Token user thường | Thử API chỉ admin được phép | 403 Forbidden |  |
| 1.8 | migrate.js | (script) | - | N/A | Kiểm tra DB Neon, các bảng users/courses/lessons/user_progress đã tạo |  |

## Iteration 2: Course, Lesson, Progress

| STT | API | Method | Đầu vào | Cách test trên Postman | Kỳ vọng | Check |
|-----|-----|--------|---------|-----------------------|---------|-------|
| 2.1 | /api/courses | GET | None | Gửi GET, không cần token | 200, list course (lesson_count đúng) |  |
| 2.2 | /api/courses/:id | GET | courseId hợp lệ | Gửi GET, không cần token | 200, trả course + list lessons |  |
| 2.3 | /api/courses | POST | JSON course info, Bearer admin | Body JSON, Authorization = admin token | 201, course mới trong DB |  |
| 2.4 | /api/courses | POST | JSON, Bearer user thường | Body JSON, Authorization = user token | 403 Forbidden |  |
| 2.5 | /api/courses/:id | PUT | JSON update, Bearer admin | Body JSON, Authorization = admin | 200, update thành công |  |
| 2.6 | /api/courses/:id | DELETE | Params: id, Bearer admin | Gửi DELETE, Authorization = admin | 200, đã xóa |  |
| 2.7 | seed.js | (script) | - | Kiểm tra DB/GET API | DB có 1 course + 3 lessons mẫu |  |
| 2.8 | /api/lessons/:id | GET | lessonId, Bearer user | Gửi GET, Authorization = user | 200, lesson detail, trạng thái progress |  |
| 2.9 | /api/lessons/:id/complete | POST | lessonId, Bearer user | Gửi POST, Authorization = user | 200, progress cập nhật |  |
| 2.10 | /api/lessons/:id/complete | POST | lessonId, không token | Gửi POST, bỏ Authorization | 401 Unauthorized |  |
| 2.11 | /api/lessons | POST | JSON lesson info, Bearer admin | Body JSON, Authorization = admin | 201, lesson được tạo |  |
| 2.12 | /api/lessons/:id | PUT | JSON update, Bearer admin | Body JSON, Authorization = admin | 200, update thành công |  |
| 2.13 | /api/lessons/:id | DELETE | lessonId, Bearer admin | Gửi DELETE, Authorization = admin | 200, xóa |  |
| 2.14 | /api/courses | GET | Course trống | Test với course chưa có lesson | lesson_count = 0 |  |

## Iteration 3: AI Chat, Progress

| STT | API | Method | Đầu vào | Cách test trên Postman | Kỳ vọng | Check |
|-----|-----|--------|---------|-----------------------|---------|-------|
| 3.1 | /api/ai/chat | POST | JSON: lessonId, message, Bearer user | Body JSON, Authorization = user | 200, trả lời tiếng Việt đúng context |  |
| 3.2 | /api/ai/chat | POST | Gây lỗi AI bên backend hoặc sai API | Body JSON đúng, Authorization | 200, degraded:true, message thân thiện |  |
| 3.3 | /api/progress/:courseId | GET | courseId, Bearer user | Authorization = user | 200, số bài, số hoàn thành, % tiến độ |  |
| 3.4 | /api/progress/:courseId | GET | courseId, user mới chưa học | Authorization = user | 200, đã hoàn thành = 0 |  |
| 3.5 | /api/lessons/:id/complete | POST | Đã completed, gửi lại | Authorization = user | Progress không tăng thêm, không lỗi |  |

## Iteration 4: Admin, Error, Edge Case

| STT | API | Method | Đầu vào | Cách test trên Postman | Kỳ vọng | Check |
|-----|-----|--------|---------|-----------------------|---------|-------|
| 4.1 | Script tạo admin | (script) | - | Kiểm tra DB/user admin xuất hiện | DB có user role=admin |  |
| 4.2 | API admin | POST/PUT/DELETE course/lesson, Bearer admin | Authorization = admin | Thao tác thành công |  |
| 4.3 | API admin | POST/PUT/DELETE, Bearer user thường | Authorization = user | 403 Forbidden |  |
| 4.4 | Documentation API | - | Đọc file docs/Postman Collection | Endpoint, request, response chuẩn |  |
| 4.5 | Error handling | Gây lỗi (DB/logic/network) | Test các trường hợp lỗi (sai data, timeout, lỗi DB) | Response message thân thiện, status phù hợp |  |
| 4.6 | Loading | Simulate mạng chậm | Kiểm tra Backend trả về đúng, không timeout sớm | Frontend hiển thị loading |  |
| 4.7 | Edge case | Course/lesson trống, user chưa có progress | Gửi GET/POST với trường hợp này | 200, dữ liệu rỗng, không lỗi |  |
| 4.8 | Mobile | Test trên Postman/mobile | Gửi request trên thiết bị di động | Kết quả giống desktop |  |

---

**Ghi chú:**
- Khi test với Postman, luôn chọn phương thức đúng (GET/POST/PUT/DELETE).
- Đối với các API cần token, thêm Authorization (Bearer Token) đúng user/admin.
- Các script như migrate, seed, admin account: kiểm tra kết quả qua DB hoặc các API GET.
- Ghi nhận và check từng test vào cột Check.