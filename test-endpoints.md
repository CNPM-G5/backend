# Test All Endpoints

## 1. Auth Endpoints

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"admin123"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

### Get Profile (cần token)
```bash
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2. Course Endpoints

### GET All Courses (public)
```bash
curl http://localhost:3001/api/courses
```

### GET Course by ID (public)
```bash
curl http://localhost:3001/api/courses/1
```

### POST Create Course (admin only)
```bash
curl -X POST http://localhost:3001/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"title":"New Course","description":"Test course"}'
```

### PUT Update Course (admin only)
```bash
curl -X PUT http://localhost:3001/api/courses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"title":"Updated Course","description":"Updated description"}'
```

### DELETE Course (admin only)
```bash
curl -X DELETE http://localhost:3001/api/courses/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 3. Lesson Endpoints

### GET Lesson by ID (public, có progress nếu có token)
```bash
# Không có token
curl http://localhost:3001/api/lessons/1

# Có token
curl http://localhost:3001/api/lessons/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### POST Complete Lesson (user)
```bash
curl -X POST http://localhost:3001/api/lessons/1/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### POST Create Lesson (admin only)
```bash
curl -X POST http://localhost:3001/api/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"course_id":1,"title":"New Lesson","content":"Lesson content","order_index":4}'
```

### PUT Update Lesson (admin only)
```bash
curl -X PUT http://localhost:3001/api/lessons/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"title":"Updated Lesson","content":"Updated content","order_index":1}'
```

### DELETE Lesson (admin only)
```bash
curl -X DELETE http://localhost:3001/api/lessons/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Test Flow

1. **Chạy migration**: `node src/config/migrate.js`
2. **Chạy seed**: `node src/config/seed.js`
3. **Start server**: `npm start`
4. **Tạo admin user**: Đăng ký user, sau đó vào database set role = 'admin'
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
   ```
5. **Test từng endpoint** theo thứ tự trên
