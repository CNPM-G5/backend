# 📋 Hướng Dẫn Test Đầy Đủ - AI Chat & Progress API

## ✅ Checklist Requirements

### 1. Dependencies ✅
- [x] `@anthropic-ai/sdk` - Installed
- [x] `openai` - Installed  
- [x] `groq-sdk` - Installed (đang dùng)

### 2. File Structure ✅
```
backend/src/
├── controllers/
│   ├── ai.controller.js          ✅ Có
│   ├── progress.controller.js    ✅ Có
│   ├── auth.controller.js        ✅ Có
│   ├── course.controller.js      ✅ Có
│   └── lesson.controller.js      ✅ Có
├── routes/
│   ├── ai.routes.js              ✅ Có
│   ├── progress.routes.js        ✅ Có
│   ├── auth.routes.js            ✅ Có
│   ├── course.routes.js          ✅ Có
│   └── lesson.routes.js          ✅ Có
├── middlewares/
│   ├── auth.middleware.js        ✅ Có
│   └── role.middleware.js        ✅ Có
└── index.js                      ✅ Có (routes registered)
```

### 3. Environment Variables ✅
```env
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=supersecretkey
GROQ_API_KEY=gsk_demo_free_key
```

---

## 🧪 Test Script

### Chạy Test Tự Động
```bash
node test-all-features.js
```

### Kết Quả Mong Đợi
```
✅ Passed: 9/9
❌ Failed: 0/9
📈 Success Rate: 100%
🎉 ALL REQUIREMENTS MET!
```

---

## 📝 Test Manual

### Setup
1. Start server: `npm start`
2. Login để lấy token:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"postman@test.com","password":"postman123"}'
```

3. Copy token từ response

---

## TEST 1: AI Chat - Context Bài Học ✅

### Requirement
- Lấy context bài học từ database
- Gọi LLM (Groq)
- Trả lời dựa trên context

### Test Command
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Iterative Model có ưu điểm gì?",
    "lessonId": 1
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "message": "Iterative Model có các ưu điểm sau:\n- Linh hoạt\n- Dễ thay đổi yêu cầu\n- Giảm rủi ro\n- Feedback sớm từ khách hàng",
    "lessonId": 1,
    "courseId": null,
    "hasContext": true,
    "degraded": false
  }
}
```

### Verify ✅
- [x] Response có `message`
- [x] Response có `hasContext: true`
- [x] Response có `degraded: false`
- [x] Message dựa trên nội dung bài học
- [x] Message bằng tiếng Việt
- [x] Message ngắn gọn (< 250 từ)

---

## TEST 2: AI Chat - System Prompt ✅

### Requirement
- Trợ lý SE
- Trả lời tiếng Việt
- Ngắn gọn

### Test Command
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Phase 1 làm những gì?",
    "lessonId": 2
  }'
```

### Verify ✅
- [x] Trả lời bằng tiếng Việt
- [x] Ngắn gọn (< 250 từ)
- [x] Giọng điệu thân thiện
- [x] Dựa trên context bài học

---

## TEST 3: AI Chat - Fail-safe ✅

### Requirement
- AI lỗi → `degraded: true`
- Message thân thiện

### Test
Đã test với API key sai → Trả về:
```json
{
  "success": true,
  "data": {
    "message": "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ giảng viên để được hỗ trợ tốt hơn.",
    "degraded": true
  }
}
```

### Verify ✅
- [x] `degraded: true` khi lỗi
- [x] Message thân thiện
- [x] Không crash server
- [x] Status 200 (không phải 500)

---

## TEST 4: AI Routes - Protected ✅

### Requirement
- POST /api/ai/chat
- Có protect middleware

### Test Without Token
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Test"}'
```

### Expected Response
```json
{
  "message": "Không có token"
}
```

### Verify ✅
- [x] Status: 401
- [x] Không cho phép access without token

---

## TEST 5: Progress API - GET ✅

### Requirement
- GET /api/progress/:courseId
- Tổng bài / đã hoàn thành / % progress

### Test Command
```bash
curl http://localhost:3001/api/progress/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "course": {
      "id": 2,
      "title": "Updated by Test Script"
    },
    "progress": {
      "totalLessons": 3,
      "completedLessons": 2,
      "progressPercentage": 67
    },
    "lessons": [
      {
        "id": 1,
        "title": "Intro",
        "orderIndex": 1,
        "completed": true,
        "completedAt": "2026-03-11T09:09:22.183Z"
      },
      {
        "id": 2,
        "title": "Phase 1",
        "orderIndex": 2,
        "completed": true,
        "completedAt": "2026-03-11T09:09:22.453Z"
      },
      {
        "id": 3,
        "title": "Phase 2",
        "orderIndex": 3,
        "completed": false,
        "completedAt": null
      }
    ]
  }
}
```

### Verify ✅
- [x] `totalLessons`: 3
- [x] `completedLessons`: 2
- [x] `progressPercentage`: 67
- [x] Có danh sách lessons
- [x] Có trạng thái completed
- [x] Có completedAt timestamp

---

## TEST 6: Progress API - JOIN Query ✅

### Requirement
- Query JOIN user_progress + lessons
- Test với user đã complete một số bài

### SQL Query Used
```sql
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.order_index,
  COALESCE(up.completed, false) as completed,
  up.completed_at
FROM lessons l
LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
WHERE l.course_id = $2
ORDER BY l.order_index
```

### Verify ✅
- [x] LEFT JOIN working
- [x] COALESCE handling null values
- [x] Có bài đã complete (completed: true)
- [x] Có bài chưa complete (completed: false)
- [x] completedAt có timestamp cho bài đã complete
- [x] completedAt null cho bài chưa complete

---

## TEST 7: AI Chat - Tiến Độ Questions ✅

### Requirement
- AI có thể trả lời về tiến độ học tập
- Gọi Progress API để lấy data

### Test Command
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tiến độ học tập của tôi thế nào?",
    "courseId": 2
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "message": "Chào bạn! Tiến độ học tập của bạn hiện tại là 67%. Bạn đã hoàn thành 2 bài học...",
    "hasContext": true,
    "degraded": false
  }
}
```

### Verify ✅
- [x] AI trả lời về tiến độ
- [x] Có số liệu chính xác (67%, 2/3 bài)
- [x] `hasContext: true`
- [x] Dựa trên dữ liệu thực từ database

---

## TEST 8: AI Chat - Course List Questions ✅

### Test Command
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Có những khóa học nào?"
  }'
```

### Verify ✅
- [x] AI liệt kê danh sách courses
- [x] Có số lượng bài học
- [x] `hasContext: true`

---

## TEST 9: Environment Variables ✅

### Render Setup
```
GROQ_API_KEY=your-groq-api-key
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
```

### Verify ✅
- [x] GROQ_API_KEY configured
- [x] DATABASE_URL configured
- [x] JWT_SECRET configured
- [x] Server starts successfully

---

## 📊 Final Checklist

### AI Chat API
- [x] ✅ Dependencies installed (@anthropic-ai/sdk, openai, groq-sdk)
- [x] ✅ aiController.js created
- [x] ✅ Lấy context bài học từ database
- [x] ✅ Gọi LLM (Groq Llama 3.3 70B)
- [x] ✅ System prompt: trợ lý SE, tiếng Việt, ngắn gọn
- [x] ✅ Fail-safe: degraded mode
- [x] ✅ aiRoutes.js created
- [x] ✅ POST /api/ai/chat
- [x] ✅ Protected middleware
- [x] ✅ Environment variables configured
- [x] ✅ Test: trả lời đúng context bài học

### Progress API
- [x] ✅ progress.controller.js created
- [x] ✅ GET /api/progress/:courseId
- [x] ✅ Tổng bài / đã hoàn thành / % progress
- [x] ✅ Query JOIN user_progress + lessons
- [x] ✅ Test với user đã complete một số bài
- [x] ✅ Protected middleware

### Bonus Features
- [x] ✅ AI trả lời về tiến độ học tập
- [x] ✅ AI trả lời về danh sách khóa học
- [x] ✅ Context detection (progress/course/lesson)
- [x] ✅ Tiếng Việt tự nhiên

---

## 🚀 Quick Test

```bash
# 1. Start server
npm start

# 2. Run automated test
node test-all-features.js

# Expected output:
# ✅ Passed: 9/9
# 🎉 ALL REQUIREMENTS MET!
```

---

## 📝 Notes

- Model: Groq Llama 3.3 70B (FREE)
- Language: Vietnamese
- Max tokens: 300
- Temperature: 0.7
- Fail-safe: Always returns 200 with degraded flag
- Protected: All routes require JWT token

---

## ✅ Kết Luận

TẤT CẢ REQUIREMENTS ĐÃ HOÀN THÀNH 100%!