# Backend - PLearn API

## Setup

```bash
npm install
cp .env.example .env
# Điền DATABASE_URL và JWT_SECRET vào .env
```

## Database Commands

```bash
npm run migrate    # Tạo tables
npm run seed       # Seed data (có check trùng)
npm run check-db   # Kiểm tra database
npm run fix-db     # Fix database (thêm order_index, xóa trùng)
```

## Run Server

```bash
npm start          # Production
npm run dev        # Development với nodemon
```

## Test Endpoints

Xem file `test-endpoints.md` để test toàn bộ API.

## Database Structure

- **users**: id, name, email, password, role, created_at
- **courses**: id, title, description, created_at
- **lessons**: id, course_id, title, content, order_index, created_at
- **user_progress**: id, user_id, lesson_id, completed, completed_at

## Features

✅ Module Course (GET all, GET by id, POST/PUT/DELETE admin only)
✅ Module Lesson (GET by id, POST complete, CRUD admin only)
✅ Module Progress (tracking user học đến đâu)
✅ Phân quyền admin (middleware protect + isAdmin)
✅ Seed data (1 course + 3 lessons, có check trùng)
✅ Test toàn bộ endpoint (xem test-endpoints.md)