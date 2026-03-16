const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const log = {
    info: (msg) => console.log(`\x1b[36mℹ️  ${msg}\x1b[0m`),
    success: (msg) => console.log(`\x1b[32m✅ ${msg}\x1b[0m`),
    warn: (msg) => console.log(`\x1b[33m⚠️  ${msg}\x1b[0m`),
    error: (msg) => console.log(`\x1b[31m❌ ${msg}\x1b[0m`),
    title: (msg) => console.log(`\x1b[1m\x1b[35m\n${'═'.repeat(50)}\n  ${msg}\n${'═'.repeat(50)}\x1b[0m`),
};

// ══════════════════════════════════════════════════════
// COURSES DATA
// ══════════════════════════════════════════════════════
const COURSES = [

    // ─────────────────────────────────────────────────────
    // COURSE 1: TỔNG QUAN CNPM
    // ─────────────────────────────────────────────────────
    {
        title: 'Tổng quan về Software Engineering',
        description: 'Giới thiệu môn học Công nghệ Phần mềm: định nghĩa, lịch sử, vai trò của kỹ sư phần mềm và tổng quan quy trình phát triển phần mềm hiện đại.',
        model_type: 'overview',
        lessons: [
            {
                order_index: 1,
                title: 'Software Engineering là gì?',
                content: `Software Engineering (Công nghệ Phần mềm) là gì?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 ĐỊNH NGHĨA

IEEE định nghĩa Software Engineering là:
"Việc áp dụng có hệ thống, kỷ luật, có thể định lượng được các phương pháp vào phát triển, vận hành và bảo trì phần mềm."

Nói đơn giản hơn: Software Engineering là cách xây dựng phần mềm một cách bài bản, có quy trình, đảm bảo chất lượng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 TẠI SAO CẦN SOFTWARE ENGINEERING?

Thực tế cho thấy:
• Hơn 60% dự án phần mềm thất bại hoặc vượt budget
• Lỗi phát hiện muộn tốn chi phí gấp 100 lần lỗi phát hiện sớm
• Phần mềm không có tài liệu khó bảo trì

Software Engineering giải quyết bằng:
✓ Quy trình rõ ràng từ đầu đến cuối
✓ Phân tích yêu cầu trước khi code
✓ Kiểm thử có hệ thống
✓ Tài liệu hóa đầy đủ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SỰ KHÁC BIỆT: LẬP TRÌNH vs SOFTWARE ENGINEERING

Lập trình (Programming):
→ Viết code để giải quyết bài toán cụ thể
→ Tập trung vào cá nhân
→ Không cần quy trình phức tạp

Software Engineering:
→ Xây dựng hệ thống phần mềm quy mô lớn
→ Làm việc nhóm, phân chia vai trò
→ Cần quy trình, tài liệu, kiểm thử
→ Đảm bảo chất lượng và khả năng bảo trì

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💻 VAI TRÒ TRONG ĐỘI PHÁT TRIỂN

• Project Manager: quản lý tiến độ, rủi ro, ngân sách
• Business Analyst: phân tích yêu cầu, viết SRS
• Software Architect: thiết kế kiến trúc hệ thống
• Developer: lập trình theo thiết kế
• QA Engineer: kiểm thử, đảm bảo chất lượng
• DevOps Engineer: triển khai, vận hành hệ thống`
            },
            {
                order_index: 2,
                title: 'Software Development Life Cycle (SDLC)',
                content: `SDLC — Vòng đời phát triển phần mềm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 SDLC LÀ GÌ?

SDLC (Software Development Life Cycle) là quy trình có cấu trúc để phát triển phần mềm chất lượng cao trong thời gian và chi phí dự kiến.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CÁC GIAI ĐOẠN CỦA SDLC

1. PLANNING (Lập kế hoạch)
   → Xác định phạm vi dự án
   → Ước tính chi phí và thời gian
   → Phân tích tính khả thi (Feasibility Study)

2. REQUIREMENTS ANALYSIS (Phân tích yêu cầu)
   → Thu thập yêu cầu từ stakeholders
   → Phân loại: Functional vs Non-Functional
   → Viết SRS (Software Requirements Specification)

3. SYSTEM DESIGN (Thiết kế hệ thống)
   → High-level Design: kiến trúc tổng thể
   → Low-level Design: chi tiết từng module
   → Database Design: ERD, schema

4. IMPLEMENTATION (Lập trình)
   → Viết code theo design đã được phê duyệt
   → Code review trong nhóm
   → Unit testing

5. TESTING (Kiểm thử)
   → Integration Testing
   → System Testing
   → User Acceptance Testing (UAT)

6. DEPLOYMENT (Triển khai)
   → Deploy lên môi trường production
   → Training người dùng
   → Bàn giao tài liệu

7. MAINTENANCE (Bảo trì)
   → Fix bugs sau khi go-live
   → Cập nhật tính năng mới
   → Nâng cấp hệ thống

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 CÁC MÔ HÌNH SDLC PHỔ BIẾN

• Waterfall Model
• Iterative Incremental Model
• Agile / Scrum
• Spiral Model

Mỗi mô hình phù hợp với loại dự án khác nhau — các khóa học tiếp theo sẽ đi sâu vào từng mô hình.`
            },
            {
                order_index: 3,
                title: 'Phân tích tính khả thi (Feasibility Study)',
                content: `Feasibility Study — Phân tích tính khả thi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TẠI SAO CẦN FEASIBILITY STUDY?

Trước khi đầu tư thời gian và tiền bạc vào một dự án, cần trả lời: "Dự án này có khả thi không?"

Feasibility Study giúp:
→ Tránh đầu tư vào dự án không thực tế
→ Xác định rủi ro sớm
→ Đưa ra quyết định go/no-go có cơ sở

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 CÁC LOẠI FEASIBILITY

1. TECHNICAL FEASIBILITY (Khả thi kỹ thuật)
   → Công nghệ hiện tại có đáp ứng yêu cầu không?
   → Nhóm có đủ kỹ năng không?
   → Ví dụ: "Chúng ta có thể xây AI chatbot với team 3 người không?"

2. ECONOMIC FEASIBILITY (Khả thi kinh tế)
   → Chi phí phát triển vs lợi ích thu về
   → ROI (Return on Investment)
   → Ví dụ: "Đầu tư 500 triệu, thu về 2 tỷ trong 2 năm"

3. OPERATIONAL FEASIBILITY (Khả thi vận hành)
   → Người dùng có chấp nhận hệ thống mới không?
   → Tổ chức có sẵn sàng thay đổi quy trình không?

4. SCHEDULE FEASIBILITY (Khả thi thời gian)
   → Deadline có thực tế không?
   → Nhóm có đủ người để hoàn thành đúng hạn không?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 BÁO CÁO FEASIBILITY STUDY

Một báo cáo feasibility cần có:
• Mô tả vấn đề và giải pháp đề xuất
• Phân tích 4 loại feasibility
• Ước tính chi phí và thời gian
• Kết luận: Go / No-Go / Cần điều chỉnh`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 2: REQUIREMENTS
    // ─────────────────────────────────────────────────────
    {
        title: 'Requirements Engineering — Phân tích yêu cầu phần mềm',
        description: 'Học cách thu thập, phân tích, đặc tả và quản lý yêu cầu phần mềm. Bao gồm viết SRS, vẽ Use Case Diagram và quản lý thay đổi yêu cầu.',
        model_type: 'requirements',
        lessons: [
            {
                order_index: 1,
                title: 'Requirements là gì? Phân loại yêu cầu',
                content: `Requirements Engineering — Nền tảng của phần mềm tốt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 REQUIREMENT LÀ GÌ?

Requirement (Yêu cầu) là mô tả về những gì hệ thống phải làm hoặc phải có. Đây là nền tảng để thiết kế, code và kiểm thử.

Câu nói nổi tiếng: "Nếu bạn không biết mình muốn gì, bạn sẽ không bao giờ đạt được nó."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 PHÂN LOẠI REQUIREMENTS

1. FUNCTIONAL REQUIREMENTS (FR)
Mô tả hệ thống làm GÌ:
• "Người dùng có thể đăng ký tài khoản bằng email"
• "Hệ thống gửi email xác nhận sau khi đăng ký"
• "Admin có thể xóa bài đăng vi phạm"

2. NON-FUNCTIONAL REQUIREMENTS (NFR)
Mô tả hệ thống hoạt động NHƯ THẾ NÀO:
• Performance: "API phản hồi trong < 2 giây"
• Security: "Password phải được mã hóa bcrypt"
• Usability: "Giao diện phải dùng được trên mobile"
• Availability: "Hệ thống uptime 99.9%"
• Scalability: "Xử lý 10,000 user đồng thời"

3. DOMAIN REQUIREMENTS
Yêu cầu từ nghiệp vụ cụ thể:
• "Hệ thống ngân hàng: số dư không được âm"
• "Hệ thống y tế: lưu lịch sử khám bệnh 10 năm"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ LỖI REQUIREMENTS PHỔ BIẾN

• Mơ hồ: "Hệ thống phải nhanh" → Nhanh là bao nhiêu?
• Mâu thuẫn: FR01 mâu thuẫn với FR05
• Không đầy đủ: Bỏ sót use case quan trọng
• Không thể kiểm thử: Không có tiêu chí đánh giá rõ ràng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TIÊU CHÍ YÊU CẦU TỐT (SMART)

S — Specific: cụ thể, không mơ hồ
M — Measurable: có thể đo lường được
A — Achievable: có thể thực hiện được
R — Relevant: liên quan đến mục tiêu
T — Testable: có thể kiểm thử được`
            },
            {
                order_index: 2,
                title: 'Thu thập yêu cầu (Requirements Elicitation)',
                content: `Requirements Elicitation — Thu thập yêu cầu từ stakeholders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CÁC KỸ THUẬT THU THẬP YÊU CẦU

1. INTERVIEW (Phỏng vấn)
Phỏng vấn trực tiếp stakeholders.
• Structured interview: câu hỏi chuẩn bị trước
• Unstructured interview: thảo luận tự do
• Ưu điểm: thu thập thông tin sâu
• Nhược điểm: tốn thời gian, phụ thuộc kỹ năng phỏng vấn

2. QUESTIONNAIRE (Bảng câu hỏi)
Gửi form câu hỏi cho nhiều người.
• Phù hợp khi stakeholder đông và phân tán
• Chi phí thấp, thu thập được nhiều ý kiến

3. OBSERVATION (Quan sát)
Quan sát người dùng làm việc thực tế.
• Thấy được workflow thực tế, không phải lý thuyết
• Phát hiện yêu cầu ẩn mà người dùng không nói ra

4. WORKSHOP / BRAINSTORMING
Họp nhóm tất cả stakeholders cùng lúc.
• Thu thập được nhiều góc nhìn
• Giải quyết mâu thuẫn ngay tại chỗ

5. PROTOTYPING (Tạo nguyên mẫu)
Tạo mockup/prototype cho user xem và phản hồi.
• User dễ phản hồi khi thấy giao diện thật
• Phát hiện yêu cầu còn thiếu sớm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 STAKEHOLDER LÀ AI?

Primary stakeholders: người dùng trực tiếp
Secondary stakeholders: admin, IT support
Tertiary stakeholders: ban giám đốc, khách hàng
External stakeholders: cơ quan quản lý, đối tác

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ KHÓ KHĂN THƯỜNG GẶP

• Stakeholder không biết mình muốn gì
• Các stakeholder có yêu cầu mâu thuẫn nhau
• Yêu cầu thay đổi liên tục trong quá trình phát triển
• Rào cản ngôn ngữ (kỹ thuật vs nghiệp vụ)`
            },
            {
                order_index: 3,
                title: 'Viết SRS (Software Requirements Specification)',
                content: `SRS — Software Requirements Specification

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 SRS LÀ GÌ?

SRS là tài liệu chính thức mô tả đầy đủ yêu cầu của hệ thống phần mềm. Đây là "hợp đồng" giữa khách hàng và đội phát triển.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 CẤU TRÚC SRS CHUẨN (IEEE 830)

1. INTRODUCTION
   1.1 Purpose: mục đích của tài liệu
   1.2 Scope: phạm vi hệ thống
   1.3 Definitions: định nghĩa thuật ngữ
   1.4 References: tài liệu tham khảo

2. OVERALL DESCRIPTION
   2.1 Product Perspective: hệ thống trong bức tranh tổng thể
   2.2 Product Functions: tóm tắt chức năng
   2.3 User Characteristics: đặc điểm người dùng
   2.4 Constraints: ràng buộc hệ thống

3. SPECIFIC REQUIREMENTS
   3.1 Functional Requirements: từng FR cụ thể
   3.2 Non-Functional Requirements: hiệu năng, bảo mật...
   3.3 External Interface Requirements: API, giao diện ngoài

4. APPENDICES: phụ lục (ERD, mockup...)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✍️ CÁCH VIẾT FUNCTIONAL REQUIREMENT

Format chuẩn:
ID: FR-001
Title: Đăng ký tài khoản
Description: Hệ thống cho phép người dùng tạo tài khoản mới bằng email và password.
Priority: High
Input: name, email, password
Output: Tài khoản được tạo, nhận JWT token
Precondition: Email chưa được đăng ký
Postcondition: User record được lưu vào DB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CHECKLIST SRS TỐT

□ Mỗi requirement có ID duy nhất
□ Không mơ hồ — mỗi requirement chỉ có 1 cách hiểu
□ Có thể kiểm thử được
□ Không mâu thuẫn
□ Có thể theo dõi (traceability) từ requirement đến test case`
            },
            {
                order_index: 4,
                title: 'Use Case Diagram và Use Case Specification',
                content: `Use Case — Mô hình hóa tương tác người dùng và hệ thống

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 USE CASE LÀ GÌ?

Use Case mô tả một tình huống cụ thể mà Actor (người dùng/hệ thống ngoài) tương tác với hệ thống để đạt được mục tiêu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 CÁC THÀNH PHẦN TRONG USE CASE DIAGRAM

1. ACTOR (Tác nhân)
   → Hình người (stick figure)
   → Người hoặc hệ thống ngoài tương tác với hệ thống
   → Ví dụ: Student, Admin, Payment Gateway

2. USE CASE (Ca sử dụng)
   → Hình oval
   → Chức năng hệ thống cung cấp
   → Ví dụ: Đăng nhập, Xem bài học, Thanh toán

3. SYSTEM BOUNDARY
   → Hình chữ nhật bao quanh use cases
   → Phân biệt trong/ngoài hệ thống

4. RELATIONSHIPS (Quan hệ)
   → Association: Actor ──── Use Case (tương tác)
   → Include: UC-A ──<<include>>──► UC-B (A bắt buộc gọi B)
   → Extend: UC-B ──<<extend>>──► UC-A (B có thể xảy ra khi A)
   → Generalization: con kế thừa cha

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 USE CASE SPECIFICATION (Đặc tả ca sử dụng)

Use Case: Đăng nhập

Actors: Student
Preconditions: User đã có tài khoản
Main Flow:
  1. User mở trang Login
  2. User nhập email và password
  3. User click Submit
  4. Hệ thống validate input
  5. Hệ thống kiểm tra credentials
  6. Hệ thống tạo JWT token
  7. Hệ thống redirect về trang Home
Postconditions: User đã đăng nhập, có JWT token
Alternative Flows:
  5a. Email không tồn tại → hiện lỗi "Tài khoản không tồn tại"
  5b. Password sai → hiện lỗi "Sai mật khẩu"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 PHÂN BIỆT INCLUDE VÀ EXTEND

Include (bắt buộc):
"Xem bài học" LUÔN LUÔN gọi "Xác thực JWT"
→ Không có xác thực → không xem được bài

Extend (có điều kiện):
"Đặt hàng" ĐÔI KHI gọi "Áp mã giảm giá"
→ Chỉ khi user có mã giảm giá`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 3: WATERFALL
    // ─────────────────────────────────────────────────────
    {
        title: 'Waterfall Model — Mô hình thác nước',
        description: 'Tìm hiểu mô hình phát triển phần mềm Waterfall cổ điển: các giai đoạn, ưu nhược điểm, khi nào nên dùng và cách áp dụng đúng trong thực tế.',
        model_type: 'waterfall',
        lessons: [
            {
                order_index: 1,
                title: 'Tổng quan Waterfall Model',
                content: `Waterfall Model — Mô hình thác nước

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 LỊCH SỬ

Waterfall được Winston W. Royce mô tả lần đầu năm 1970. Đây là mô hình SDLC đầu tiên được sử dụng rộng rãi trong công nghiệp phần mềm.

Tên "Waterfall" (thác nước) vì các giai đoạn chảy xuống một chiều, không quay lại.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CÁC GIAI ĐOẠN WATERFALL

1. REQUIREMENTS (Thu thập yêu cầu)
   → Xác định đầy đủ yêu cầu TRƯỚC KHI bắt đầu
   → Output: SRS document

2. SYSTEM DESIGN (Thiết kế hệ thống)
   → High-level: kiến trúc tổng thể
   → Low-level: thiết kế từng module
   → Output: Design document, ERD

3. IMPLEMENTATION (Lập trình)
   → Code theo thiết kế đã phê duyệt
   → Unit testing
   → Output: Source code

4. TESTING (Kiểm thử)
   → Integration testing
   → System testing
   → UAT (User Acceptance Testing)
   → Output: Test report

5. DEPLOYMENT (Triển khai)
   → Deploy lên production
   → Training người dùng
   → Output: Hệ thống live

6. MAINTENANCE (Bảo trì)
   → Fix bugs
   → Cập nhật nhỏ
   → Output: Updated system

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ƯU ĐIỂM

• Đơn giản, dễ hiểu và quản lý
• Tài liệu đầy đủ ở mỗi giai đoạn
• Dễ ước tính chi phí và thời gian
• Phù hợp với dự án có requirements cố định
• Thích hợp cho team mới làm quen quy trình

❌ NHƯỢC ĐIỂM

• Không linh hoạt — khó thay đổi requirements
• Khách hàng thấy sản phẩm rất muộn (cuối dự án)
• Rủi ro cao: lỗi phát hiện muộn tốn kém
• Không phù hợp với requirements không rõ ràng
• Testing chỉ ở cuối — bug nhiều và khó fix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 KHI NÀO DÙNG WATERFALL?

✓ Requirements rõ ràng, ổn định, ít thay đổi
✓ Dự án ngắn (< 3 tháng)
✓ Công nghệ đã quen thuộc
✓ Sản phẩm an toàn quan trọng (hàng không, y tế)
✓ Hợp đồng fixed-price với khách hàng`
            },
            {
                order_index: 2,
                title: 'Áp dụng Waterfall trong thực tế',
                content: `Waterfall trong thực tế — Ví dụ và bài học

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VÍ DỤ DỰ ÁN DÙNG WATERFALL

Dự án: Hệ thống quản lý thư viện trường đại học
Timeline: 6 tháng
Team: 5 người

Giai đoạn 1 — Requirements (Tháng 1):
• Phỏng vấn thủ thư, sinh viên, giáo viên
• Viết SRS: mượn sách, trả sách, tìm kiếm, phạt quá hạn
• Review và sign-off với ban giám đốc

Giai đoạn 2 — Design (Tháng 2):
• Thiết kế DB: books, members, borrowings, fines
• Thiết kế UI: wireframe từng màn hình
• Chọn tech stack: PHP + MySQL

Giai đoạn 3 — Implementation (Tháng 3–4):
• Code module mượn trả sách
• Code module tìm kiếm
• Code module báo cáo

Giai đoạn 4 — Testing (Tháng 5):
• Test từng chức năng
• UAT với thủ thư thực tế
• Fix bugs

Giai đoạn 5–6 — Deploy + Training (Tháng 6):
• Deploy lên server trường
• Training 3 buổi cho thủ thư

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ BÀI HỌC TỪ DỰ ÁN THẤT BẠI

Vấn đề thực tế thường gặp:
→ Tháng 5, testing phát hiện thiết kế DB sai → phải sửa lại từ đầu
→ Khách hàng thay đổi yêu cầu ở giai đoạn 3 → tốn thêm chi phí
→ Không có prototype → khách hàng không hài lòng với UI

Bài học:
• Phải sign-off requirements thật kỹ trước khi bắt đầu
• Tạo prototype sớm để khách hàng confirm UI
• Dành thời gian test nhiều hơn (ít nhất 20% tổng thời gian)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 METRICS QUẢN LÝ DỰ ÁN WATERFALL

• Earned Value Management (EVM)
• Gantt Chart để theo dõi tiến độ
• Burn-down chart số bug còn lại
• Change Request log để track thay đổi`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 4: ITERATIVE INCREMENTAL
    // ─────────────────────────────────────────────────────
    {
        title: 'Iterative Incremental Model — Mô hình lặp lại, tăng thêm',
        description: 'Học cách xây dựng phần mềm theo mô hình Iterative Incremental: chia dự án thành nhiều vòng lặp, mỗi vòng bàn giao một phần chức năng hoạt động được.',
        model_type: 'iterative_incremental',
        lessons: [
            {
                order_index: 1,
                title: 'Tổng quan Iterative Incremental Model',
                content: `Iterative Incremental — Phát triển theo vòng lặp tăng dần

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Ý TƯỞNG CỐT LÕI (theo slide môn học)

"Thay vì phải xây dựng và chuyển giao hệ thống một lần thì sẽ được chia thành nhiều vòng, tăng dần. Mỗi vòng là một phần kết quả của một chức năng được yêu cầu."

"Các yêu cầu của người sử dụng được đánh thứ tự ưu tiên. Yêu cầu nào có thứ tự ưu tiên càng cao thì càng ở trong những vòng phát triển sớm hơn."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ QUY TRÌNH THEO HÌNH 2.4

Theo sơ đồ trong bài giảng, mỗi vòng gồm:

Định nghĩa YC sơ bộ
        ↓
Gán YC cho từng vòng
        ↓
Thiết kế kiến trúc
        ↓
[Phát triển 1 vòng]
        ↓
[Đánh giá 1 vòng]
        ↓
[Tích hợp các vòng]
        ↓
[Đánh giá hệ thống]
        ↓
Hệ thống chưa hoàn thiện? → Quay lại vòng mới
        ↓
Hệ thống cuối cùng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ƯU ĐIỂM (theo slide)

• Sau mỗi lần tăng vòng thì có thể chuyển giao kết quả thực hiện được cho khách hàng nên các chức năng của hệ thống có thể nhìn thấy sớm hơn.
• Các vòng trước đóng vai trò là mẫu thử để giúp tìm hiểu thêm các yêu cầu ở những vòng tiếp theo.
• Những chức năng của hệ thống có thứ tự ưu tiên càng cao thì sẽ được kiểm thử càng kỹ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 KHI NÀO DÙNG MÔ HÌNH NÀY?

✓ Yêu cầu chưa rõ ràng hoàn toàn ngay từ đầu
✓ Cần demo sản phẩm sớm cho stakeholder
✓ Nhóm nhỏ (3–7 người), thời gian 2–4 tháng
✓ Có thể thay đổi yêu cầu giữa chừng dựa trên feedback`
            },
            {
                order_index: 2,
                title: 'Lập kế hoạch và phân chia Iterations',
                content: `Lập kế hoạch Iterations — Chia nhỏ để chinh phục

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 ITERATION LÀ GÌ?

Một iteration là một chu kỳ phát triển ngắn (thường 1–4 tuần) trong đó nhóm:
1. Lấy một tập yêu cầu từ backlog
2. Phân tích, thiết kế, code, test
3. Bàn giao phần chức năng chạy được

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CÁCH PHÂN CHIA ITERATIONS

Bước 1: Liệt kê tất cả requirements vào Product Backlog
Bước 2: Đánh mức ưu tiên (High/Medium/Low)
Bước 3: Chia requirements vào từng iteration theo ưu tiên
Bước 4: Ước tính effort cho từng iteration
Bước 5: Xác định Definition of Done cho mỗi iteration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VÍ DỤ: DỰ ÁN iLearn+

Iteration 1 — Tuần 1–2 (Foundation):
• FR01: Register (High) ✓
• FR02: Login (High) ✓
• FR03: JWT Auth (High) ✓
• Deploy CI/CD (High) ✓
→ Kết quả: App chạy được, login được

Iteration 2 — Tuần 3–4 (Core Features):
• FR06: Xem courses (High) ✓
• FR07: Xem lessons (High) ✓
• FR09: Complete lesson (High) ✓
→ Kết quả: Học được bài học thật sự

Iteration 3 — Tuần 5–6 (AI + Progress):
• FR11: AI Chat (Medium) ✓
• FR13: Progress dashboard (Medium) ✓
→ Kết quả: AI hỗ trợ học tập

Iteration 4 — Tuần 7–8 (Polish + Admin):
• FR14: Admin panel (Medium) ✓
• NFR03: Responsive (Low) ✓
→ Kết quả: Hệ thống hoàn chỉnh, sẵn sàng demo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 DEFINITION OF DONE (DoD)

Iteration chỉ "xong" khi:
□ Tất cả tasks trong iteration hoàn thành
□ Code đã review
□ Test cases pass
□ Deploy lên staging thành công
□ Demo cho stakeholder được`
            },
            {
                order_index: 3,
                title: 'Đánh giá và cải tiến sau mỗi Iteration',
                content: `Iteration Review & Retrospective

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 SAU MỖI ITERATION CẦN LÀM GÌ?

Theo quy trình Hình 2.4, sau mỗi vòng phát triển cần:
1. Đánh giá 1 vòng (test kết quả)
2. Tích hợp vào hệ thống tổng thể
3. Đánh giá hệ thống
4. Xác định: đã hoàn thiện chưa?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 ITERATION REVIEW (Đánh giá kết quả)

Câu hỏi cần trả lời:
• Những requirements nào đã hoàn thành?
• Những requirements nào chưa xong? Lý do?
• Chất lượng code như thế nào?
• Performance có đạt không?

Output: Iteration Review Report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 ITERATION RETROSPECTIVE (Nhìn lại quy trình)

Khác với Review (nhìn vào sản phẩm), Retrospective nhìn vào QUY TRÌNH:

What went well? (Điều gì tốt?)
→ "Giao tiếp nhóm tốt, không có conflict"
→ "Code review giúp bắt nhiều bug"

What went wrong? (Điều gì chưa tốt?)
→ "Estimate effort sai, làm thêm giờ nhiều"
→ "Deploy fail vì thiếu environment variable"

What to improve? (Cải thiện gì?)
→ "Sprint tiếp theo estimate thêm 20% buffer"
→ "Tạo deployment checklist"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 METRICS THEO DÕI QUA CÁC ITERATIONS

• Velocity: số story points hoàn thành mỗi iteration
• Bug rate: số bug phát hiện / iteration
• Test coverage: % code được test
• Technical debt: nợ kỹ thuật tích lũy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏭️ CHUẨN BỊ CHO ITERATION TIẾP THEO

• Cập nhật Product Backlog
• Thêm yêu cầu mới từ feedback
• Ưu tiên lại nếu cần
• Ước tính effort iteration mới`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 5: AGILE / SCRUM
    // ─────────────────────────────────────────────────────
    {
        title: 'Agile / Scrum — Phương pháp phát triển linh hoạt',
        description: 'Tìm hiểu Agile Manifesto, Scrum Framework với các vai trò, ceremonies và artifacts. Học cách áp dụng Scrum trong dự án thực tế.',
        model_type: 'agile',
        lessons: [
            {
                order_index: 1,
                title: 'Agile Manifesto và 12 nguyên tắc',
                content: `Agile — Tuyên ngôn và triết lý phát triển linh hoạt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 LỊCH SỬ AGILE

Năm 2001, 17 chuyên gia phần mềm hàng đầu họp tại Snowbird, Utah và viết ra Agile Manifesto — tuyên ngôn thay đổi ngành phần mềm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📜 AGILE MANIFESTO — 4 GIÁ TRỊ CỐT LÕI

"We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value:"

1. Individuals and interactions OVER processes and tools
   → Con người và giao tiếp quan trọng hơn quy trình và công cụ

2. Working software OVER comprehensive documentation
   → Phần mềm chạy được quan trọng hơn tài liệu đầy đủ

3. Customer collaboration OVER contract negotiation
   → Hợp tác với khách hàng quan trọng hơn đàm phán hợp đồng

4. Responding to change OVER following a plan
   → Thích nghi với thay đổi quan trọng hơn bám theo kế hoạch

"That is, while there is value in the items on the right, we value the items on the left more."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 12 NGUYÊN TẮC AGILE (tóm tắt)

1. Ưu tiên cao nhất là làm hài lòng khách hàng qua việc bàn giao sớm và liên tục phần mềm có giá trị
2. Chào đón thay đổi yêu cầu, kể cả muộn trong quá trình phát triển
3. Bàn giao phần mềm chạy được thường xuyên (vài tuần đến vài tháng)
4. Developer và business cần làm việc cùng nhau hàng ngày
5. Xây dựng dự án xung quanh những người có động lực
6. Giao tiếp mặt đối mặt là hiệu quả nhất
7. Phần mềm chạy được là thước đo tiến độ chính
8. Phát triển bền vững — pace ổn định có thể duy trì lâu dài
9. Liên tục chú ý đến kỹ thuật tốt và thiết kế tốt
10. Đơn giản — tối đa hóa lượng việc KHÔNG làm
11. Các team tự tổ chức tốt nhất
12. Thường xuyên nhìn lại và điều chỉnh để hiệu quả hơn`
            },
            {
                order_index: 2,
                title: 'Scrum Framework — Roles, Ceremonies, Artifacts',
                content: `Scrum — Framework Agile phổ biến nhất

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 SCRUM LÀ GÌ?

Scrum là một framework Agile giúp team phát triển phần mềm thông qua các Sprint ngắn (1–4 tuần), với vai trò và ceremonies rõ ràng.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 3 VAI TRÒ TRONG SCRUM

1. PRODUCT OWNER (PO)
   → Đại diện cho khách hàng/business
   → Quản lý và ưu tiên Product Backlog
   → Quyết định "làm gì" (what)
   → KHÔNG quyết định "làm như thế nào" (how)

2. SCRUM MASTER (SM)
   → Người gác cổng quy trình Scrum
   → Loại bỏ obstacles (impediments) cho team
   → Coach team về Scrum
   → KHÔNG phải quản lý — servant-leader

3. DEVELOPMENT TEAM
   → Cross-functional: dev, QA, designer...
   → Self-organizing: tự quyết định cách làm
   → Quy mô 3–9 người

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 5 CEREMONIES (Sự kiện)

1. SPRINT PLANNING (Lên kế hoạch Sprint)
   → Đầu mỗi Sprint
   → Team chọn items từ Product Backlog vào Sprint Backlog
   → Ước tính effort bằng Story Points

2. DAILY SCRUM / STAND-UP (15 phút/ngày)
   → 3 câu hỏi: Hôm qua làm gì? Hôm nay làm gì? Có obstacle không?
   → Đứng để ngắn gọn, tập trung

3. SPRINT REVIEW (Demo cuối Sprint)
   → Team demo sản phẩm cho stakeholders
   → Thu thập feedback
   → Cập nhật Product Backlog

4. SPRINT RETROSPECTIVE (Cải tiến quy trình)
   → What went well / wrong / to improve?
   → Action items cho Sprint tiếp theo

5. BACKLOG REFINEMENT (Grooming)
   → Làm rõ và ước tính items trong Backlog
   → Chuẩn bị cho Sprint Planning tiếp theo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 3 ARTIFACTS (Công cụ)

1. PRODUCT BACKLOG
   → Danh sách toàn bộ yêu cầu của sản phẩm
   → PO quản lý và ưu tiên

2. SPRINT BACKLOG
   → Subset của Product Backlog cho Sprint này
   → Team tự quản lý

3. INCREMENT
   → Tổng hợp tất cả items hoàn thành trong Sprint
   → Phải là "potentially shippable" product`
            },
            {
                order_index: 3,
                title: 'User Story và Story Points',
                content: `User Story — Cách viết yêu cầu trong Agile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 USER STORY LÀ GÌ?

User Story là cách diễn đạt yêu cầu từ góc nhìn người dùng, tập trung vào VALUE (giá trị) thay vì feature.

Format chuẩn:
"As a [role], I want [goal] so that [benefit]"

Ví dụ:
"As a student, I want to mark a lesson as completed so that I can track my learning progress."

"As an admin, I want to create new courses so that students have content to learn from."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TIÊU CHÍ INVEST

I — Independent: có thể phát triển độc lập
N — Negotiable: có thể thương lượng
V — Valuable: có giá trị với người dùng
E — Estimable: có thể ước tính effort
S — Small: đủ nhỏ để làm trong 1 Sprint
T — Testable: có thể kiểm thử được

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 STORY POINTS — ƯỚC TÍNH EFFORT

Story Points không đo thời gian mà đo ĐỘ PHỨC TẠP tương đối.

Dùng dãy Fibonacci: 1, 2, 3, 5, 8, 13, 21...

Planning Poker:
→ Mỗi người đánh giá độc lập
→ Lật bài cùng lúc
→ Thảo luận nếu có chênh lệch lớn
→ Ước tính lại cho đến khi đồng thuận

Ví dụ ước tính:
• Login API: 3 points (đơn giản, đã làm nhiều lần)
• AI Chat integration: 13 points (phức tạp, nhiều unknown)
• Profile page UI: 5 points (trung bình)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 VELOCITY

Velocity = tổng story points hoàn thành trong 1 Sprint

Dùng để:
• Dự đoán khi nào xong Product Backlog
• Lên kế hoạch release
• Đo lường cải tiến qua các Sprints

Công thức dự báo:
Số Sprint cần = Tổng points còn lại / Velocity trung bình`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 6: SPIRAL
    // ─────────────────────────────────────────────────────
    {
        title: 'Spiral Model — Mô hình xoắn ốc',
        description: 'Tìm hiểu Spiral Model của Barry Boehm: mô hình kết hợp Waterfall và Iterative với trọng tâm quản lý rủi ro. Phù hợp cho các dự án lớn, phức tạp.',
        model_type: 'spiral',
        lessons: [
            {
                order_index: 1,
                title: 'Tổng quan Spiral Model',
                content: `Spiral Model — Xoắn ốc hướng rủi ro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 LỊCH SỬ

Barry Boehm đề xuất Spiral Model năm 1986 để khắc phục điểm yếu của Waterfall: rủi ro cao, khám phá requirements chậm.

Điểm đặc biệt: RỦI RO (Risk) là trọng tâm của mô hình này.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌀 CẤU TRÚC XOẮN ỐC

Mỗi vòng xoắn gồm 4 góc phần tư (quadrants):

QUADRANT 1 — PLANNING (Lên kế hoạch)
→ Xác định mục tiêu, alternatives và constraints
→ Xác định yêu cầu cho vòng này

QUADRANT 2 — RISK ANALYSIS (Phân tích rủi ro)
→ Nhận diện và phân tích rủi ro
→ Tạo prototype để giảm rủi ro
→ Đây là điểm KHÁC BIỆT với các mô hình khác

QUADRANT 3 — ENGINEERING (Phát triển)
→ Thiết kế, code, test
→ Tương tự giai đoạn implementation trong Waterfall

QUADRANT 4 — EVALUATION (Đánh giá)
→ Khách hàng đánh giá kết quả
→ Lên kế hoạch cho vòng tiếp theo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ƯU ĐIỂM

• Quản lý rủi ro tốt — phát hiện vấn đề sớm
• Linh hoạt — yêu cầu có thể thay đổi
• Tốt cho dự án lớn, phức tạp, nhiều unknown
• Prototype sớm → feedback sớm từ khách hàng
• Phù hợp dự án có chi phí lớn (không thể sai)

❌ NHƯỢC ĐIỂM

• Phức tạp — đòi hỏi kinh nghiệm quản lý rủi ro
• Chi phí cao — nhiều vòng lặp tốn kém
• Khó ước tính tổng thời gian và chi phí
• Không phù hợp dự án nhỏ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 KHI NÀO DÙNG SPIRAL?

✓ Dự án lớn, ngân sách lớn (> 1 năm)
✓ Yêu cầu phức tạp, nhiều ẩn số
✓ Công nghệ mới, chưa ai làm trước
✓ Rủi ro cao (hệ thống quốc phòng, không gian)
✓ Khách hàng muốn tham gia sâu vào quá trình`
            },
            {
                order_index: 2,
                title: 'Risk Management trong Spiral Model',
                content: `Risk Management — Quản lý rủi ro trong Spiral

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 RISK LÀ GÌ?

Risk (Rủi ro) là khả năng xảy ra sự kiện không mong muốn ảnh hưởng đến dự án.

Risk = Probability (xác suất) × Impact (tác động)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 CÁC LOẠI RISK TRONG DỰ ÁN PHẦN MỀM

1. TECHNICAL RISKS
   → Công nghệ chưa proven
   → Performance không đạt yêu cầu
   → Integration phức tạp

2. BUSINESS RISKS
   → Yêu cầu thay đổi
   → Budget bị cắt
   → Stakeholder thay đổi

3. PEOPLE RISKS
   → Team member nghỉ việc
   → Thiếu kỹ năng cần thiết
   → Xung đột trong nhóm

4. EXTERNAL RISKS
   → Vendor/third-party thay đổi API
   → Quy định pháp luật thay đổi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RISK MATRIX

          │ Low Impact │ High Impact
──────────┼────────────┼────────────
High Prob │  Monitor   │  MITIGATE
Low Prob  │  Accept    │  Contingency

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ CHIẾN LƯỢC XỬ LÝ RISK

1. AVOID — Tránh hoàn toàn
   "Không dùng công nghệ chưa stable"

2. MITIGATE — Giảm thiểu
   "Tạo prototype trước khi commit toàn bộ"

3. TRANSFER — Chuyển giao
   "Mua bảo hiểm, outsource phần rủi ro"

4. ACCEPT — Chấp nhận
   "Rủi ro nhỏ, chi phí xử lý cao hơn thiệt hại"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RISK REGISTER (Sổ theo dõi rủi ro)

Mỗi risk cần document:
• Risk ID và mô tả
• Probability (1–5) và Impact (1–5)
• Risk Score = Prob × Impact
• Chiến lược xử lý
• Owner (ai chịu trách nhiệm)
• Status (Open/Closed/Monitoring)`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 7: THIẾT KẾ
    // ─────────────────────────────────────────────────────
    {
        title: 'Software Design — Thiết kế phần mềm',
        description: 'Học các nguyên tắc thiết kế phần mềm: kiến trúc hệ thống, design patterns, thiết kế database và các công cụ UML.',
        model_type: 'design',
        lessons: [
            {
                order_index: 1,
                title: 'Các nguyên tắc thiết kế phần mềm',
                content: `Software Design Principles — Nền tảng thiết kế tốt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TẠI SAO THIẾT KẾ QUAN TRỌNG?

Code không có thiết kế → Spaghetti code → Khó bảo trì → Technical debt
Thiết kế tốt → Code rõ ràng → Dễ test → Dễ mở rộng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏛️ SOLID PRINCIPLES

S — Single Responsibility Principle
→ Mỗi class/module chỉ có 1 lý do để thay đổi
→ Ví dụ: UserController chỉ xử lý HTTP request, không xử lý DB logic

O — Open/Closed Principle
→ Mở để mở rộng, đóng để sửa đổi
→ Thêm tính năng mới → thêm code mới, không sửa code cũ

L — Liskov Substitution Principle
→ Subclass có thể thay thế superclass
→ Duck typing trong Python

I — Interface Segregation Principle
→ Nhiều interface nhỏ tốt hơn 1 interface lớn
→ Client không nên phụ thuộc vào methods nó không dùng

D — Dependency Inversion Principle
→ Depend on abstractions, not concretions
→ High-level modules không phụ thuộc low-level modules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 NGUYÊN TẮC KHÁC

DRY — Don't Repeat Yourself
→ Mỗi logic chỉ tồn tại một nơi trong codebase

KISS — Keep It Simple, Stupid
→ Giải pháp đơn giản nhất thường là tốt nhất

YAGNI — You Aren't Gonna Need It
→ Không build tính năng "có thể cần trong tương lai"

Separation of Concerns
→ Tách frontend/backend, business logic/data access

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏗️ KIẾN TRÚC PHỔ BIẾN

Layered Architecture (3-tier):
→ Presentation → Business Logic → Data Access

MVC (Model-View-Controller):
→ Model: data & business logic
→ View: UI
→ Controller: xử lý request, kết nối M và V

Microservices:
→ Chia hệ thống thành services nhỏ, độc lập
→ Mỗi service có DB riêng
→ Giao tiếp qua API hoặc message queue`
            },
            {
                order_index: 2,
                title: 'UML Diagrams trong thiết kế phần mềm',
                content: `UML — Ngôn ngữ mô hình hóa hợp nhất

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 UML LÀ GÌ?

UML (Unified Modeling Language) là ngôn ngữ đồ họa chuẩn để mô hình hóa hệ thống phần mềm. UML giúp team giao tiếp và document thiết kế.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CÁC LOẠI UML DIAGRAM

STRUCTURAL DIAGRAMS (mô tả cấu trúc):

1. Class Diagram
   → Các lớp và quan hệ giữa chúng
   → Thừa kế, Association, Aggregation, Composition
   → Quan trọng nhất trong OOP design

2. Component Diagram
   → Các thành phần lớn của hệ thống
   → Ví dụ: Frontend, Backend, Database, AI Service

3. Deployment Diagram
   → Cách deploy hệ thống lên infrastructure
   → Servers, containers, network

BEHAVIORAL DIAGRAMS (mô tả hành vi):

4. Use Case Diagram
   → Actor tương tác với hệ thống như thế nào
   → Đã học trong phần Requirements

5. Sequence Diagram
   → Thứ tự tương tác giữa các objects theo thời gian
   → Ví dụ: Login flow: User → Frontend → Backend → DB

6. Activity Diagram
   → Luồng hoạt động, điều kiện rẽ nhánh
   → Tương tự flowchart nhưng chuẩn UML

7. State Diagram
   → Các trạng thái của object
   → Ví dụ: Order: Pending → Confirmed → Shipped → Delivered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SEQUENCE DIAGRAM — VÍ DỤ LOGIN

User → Frontend: nhập email + password
Frontend → Backend: POST /api/auth/login
Backend → Database: SELECT user WHERE email=?
Database → Backend: user record
Backend → Backend: bcrypt.compare(password, hash)
Backend → Frontend: { token, user }
Frontend → User: redirect to Home

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ TOOLS VẼ UML

• draw.io (app.diagrams.net) — free, online
• PlantUML — code-based, text to diagram
• Lucidchart — professional, có phí
• StarUML — desktop application`
            },
            {
                order_index: 3,
                title: 'Database Design — Thiết kế cơ sở dữ liệu',
                content: `Database Design — Từ ERD đến SQL Schema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 QUY TRÌNH THIẾT KẾ DATABASE

Bước 1: Conceptual Design → ERD
Bước 2: Logical Design → Relational Model
Bước 3: Physical Design → SQL Schema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ERD — ENTITY RELATIONSHIP DIAGRAM

Các thành phần:
• Entity (bảng): hình chữ nhật
• Attribute (cột): hình oval
• Relationship: đường kết nối
• Cardinality: 1:1, 1:N, N:M

Cardinality:
1:1 — Một người có một CMND
1:N — Một khách hàng có nhiều đơn hàng
N:M — Nhiều sinh viên học nhiều môn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 CHUẨN HÓA DATABASE (NORMALIZATION)

Mục tiêu: loại bỏ dư thừa dữ liệu, tránh anomalies

1NF (First Normal Form):
→ Mỗi ô chỉ chứa 1 giá trị atomic
→ Không có cột lặp lại

2NF (Second Normal Form):
→ Đạt 1NF + Không có partial dependency
→ Mọi non-key attribute phụ thuộc vào TOÀN BỘ primary key

3NF (Third Normal Form):
→ Đạt 2NF + Không có transitive dependency
→ Non-key attribute không phụ thuộc vào non-key attribute khác

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VÍ DỤ: DATABASE iLearn+

users (id, name, email, password, role, avatar_url, created_at)
courses (id, title, description, model_type, created_at)
lessons (id, course_id FK, title, content, slide_url, order_index)
user_progress (id, user_id FK, lesson_id FK, completed, completed_at)
  UNIQUE(user_id, lesson_id)

Quan hệ:
users 1:N user_progress
courses 1:N lessons
lessons 1:N user_progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 BEST PRACTICES

• Luôn có Primary Key (thường là auto-increment id)
• Foreign Key có ON DELETE CASCADE hoặc SET NULL
• Index các cột thường dùng trong WHERE
• Không lưu password plain text — dùng hash
• Timestamp created_at, updated_at cho audit trail`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 8: TESTING
    // ─────────────────────────────────────────────────────
    {
        title: 'Software Testing — Kiểm thử phần mềm',
        description: 'Học các kỹ thuật kiểm thử phần mềm: Unit Test, Integration Test, System Test, UAT. Viết test case hiệu quả và áp dụng TDD.',
        model_type: 'testing',
        lessons: [
            {
                order_index: 1,
                title: 'Tổng quan Software Testing',
                content: `Software Testing — Đảm bảo chất lượng phần mềm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TESTING LÀ GÌ?

Testing là quá trình ĐÁNH GIÁ phần mềm để phát hiện sự khác biệt giữa kết quả thực tế và kết quả mong đợi.

Mục tiêu: Tìm ra bugs trước khi người dùng thật gặp phải.

"Testing can show the presence of bugs, not their absence." — Dijkstra

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CÁC CẤP ĐỘ TESTING (Testing Pyramid)

          ┌──────────┐
          │   E2E    │  ← Ít nhất, chậm nhất, tốn nhất
          ├──────────┤
          │Integration│
          ├──────────┤
          │Unit Tests │  ← Nhiều nhất, nhanh nhất, rẻ nhất
          └──────────┘

1. UNIT TESTING
   → Test từng function, method, module nhỏ
   → Isolated — không phụ thuộc external services
   → Nhanh, chạy nhiều lần
   → Ví dụ: test hàm hashPassword()

2. INTEGRATION TESTING
   → Test khi các module kết hợp với nhau
   → Ví dụ: test API Login gọi DB thật

3. SYSTEM TESTING
   → Test toàn bộ hệ thống end-to-end
   → Ví dụ: Register → Login → Xem bài → Hoàn thành

4. UAT (User Acceptance Testing)
   → Người dùng thật test hệ thống
   → Xác nhận hệ thống đáp ứng business requirements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 BLACK BOX vs WHITE BOX TESTING

Black Box Testing:
→ Test dựa trên requirements, không biết code bên trong
→ Input/Output perspective
→ Ai cũng test được, kể cả non-developer

White Box Testing:
→ Test dựa trên code structure
→ Coverage: line, branch, path coverage
→ Chỉ developer mới test được

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ CHI PHÍ FIX BUG THEO GIAI ĐOẠN

Requirements: 1x
Design: 5x
Development: 10x
Testing: 20x
Production: 100x

→ Kết luận: Tìm bug sớm tiết kiệm 100x chi phí!`
            },
            {
                order_index: 2,
                title: 'Viết Test Case hiệu quả',
                content: `Test Case — Kịch bản kiểm thử có hệ thống

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TEST CASE LÀ GÌ?

Test Case là tập hợp các điều kiện hoặc biến số để xác định xem hệ thống có hoạt động đúng không.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CẤU TRÚC TEST CASE CHUẨN

Test Case ID: TC-001
Test Case Name: Đăng nhập thành công
Module: Authentication
Priority: High

Preconditions:
• Tài khoản student1@gmail.com đã tồn tại
• Server đang chạy

Test Steps:
1. Mở trang /login
2. Nhập email: student1@gmail.com
3. Nhập password: student123
4. Click nút "Đăng nhập"

Test Data:
• Email: student1@gmail.com
• Password: student123

Expected Result:
• Nhận được JWT token
• Redirect về trang Home
• Navbar hiển thị tên "Nguyễn Văn An"

Actual Result: [điền sau khi test]
Status: Pass ✓ / Fail ✗

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 KỸ THUẬT THIẾT KẾ TEST CASE

1. EQUIVALENCE PARTITIONING
   → Chia input thành các nhóm tương đương
   → Chỉ cần test 1 case đại diện cho mỗi nhóm
   → Ví dụ: Password < 6 ký tự (invalid), 6–20 (valid), > 20 (invalid)

2. BOUNDARY VALUE ANALYSIS
   → Test các giá trị biên
   → Ví dụ: password = 5, 6, 20, 21 ký tự

3. DECISION TABLE
   → Test tổ hợp các điều kiện
   → Ví dụ: email valid/invalid × password valid/invalid

4. NEGATIVE TESTING
   → Test với input sai, thiếu, ngoài range
   → Hệ thống phải xử lý gracefully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TEST REPORT

Sau khi test xong cần có báo cáo:
• Tổng số test cases: X
• Pass: Y (Y%)
• Fail: Z
• Blocked: W (chưa test được do dependency)
• Bug list: danh sách bugs với priority`
            },
            {
                order_index: 3,
                title: 'TDD và Automation Testing',
                content: `TDD và Automation — Kiểm thử hiện đại

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TDD — TEST DRIVEN DEVELOPMENT

TDD là phương pháp viết TEST TRƯỚC, CODE SAU.

Chu kỳ Red-Green-Refactor:
1. RED: Viết test (chạy → fail vì chưa có code)
2. GREEN: Viết code tối thiểu để test pass
3. REFACTOR: Cải thiện code mà không làm test fail

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 LỢI ÍCH CỦA TDD

✓ Code có test coverage cao ngay từ đầu
✓ Thiết kế tốt hơn — buộc phải nghĩ về interface trước
✓ Tự tin refactor — test báo ngay nếu có regression
✓ Tài liệu sống — test case là documentation
✓ Ít debug hơn — bug bị bắt ngay lập tức

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AUTOMATION TESTING

Manual Testing:
→ Người test thủ công
→ Tốt cho exploratory testing
→ Chậm, tốn người, không lặp lại được chính xác

Automation Testing:
→ Viết code để test code
→ Chạy nhanh, lặp lại nhiều lần
→ Tốt cho regression testing

Tools phổ biến:
• Jest — Unit/Integration test (JavaScript)
• Selenium — Web UI automation
• Cypress — Modern E2E testing
• Postman/Newman — API testing
• JMeter — Performance testing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CI/CD VÀ AUTOMATED TESTING

Pipeline lý tưởng:
Push code
  → Run unit tests (< 1 phút)
  → Run integration tests (< 5 phút)
  → Run E2E tests (< 15 phút)
  → Deploy to staging
  → Run smoke tests
  → Deploy to production

Fail bất kỳ bước nào → DỪNG, không deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TEST COVERAGE

Line Coverage: % số dòng code được chạy qua
Branch Coverage: % các nhánh if/else được test
Function Coverage: % functions được gọi

Mục tiêu thực tế: 70–80% coverage là tốt
100% coverage không đảm bảo không có bug!`
            }
        ]
    },

    // ─────────────────────────────────────────────────────
    // COURSE 9: SO SÁNH CÁC MÔ HÌNH
    // ─────────────────────────────────────────────────────
    {
        title: 'So sánh các mô hình phát triển phần mềm',
        description: 'Phân tích và so sánh toàn diện các mô hình: Waterfall, Iterative Incremental, Agile/Scrum, Spiral. Học cách chọn đúng mô hình cho đúng dự án.',
        model_type: 'comparison',
        lessons: [
            {
                order_index: 1,
                title: 'Bảng so sánh tổng quan các mô hình',
                content: `So sánh tổng quan — Waterfall vs Iterative vs Agile vs Spiral

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 BẢNG SO SÁNH CHI TIẾT

Tiêu chí           | Waterfall  | Iterative  | Agile/Scrum | Spiral
───────────────────|────────────|────────────|─────────────|────────
Requirements       | Cố định    | Có thể đổi | Linh hoạt   | Thay đổi được
Delivery           | Cuối dự án | Sau mỗi vòng| Mỗi Sprint | Cuối vòng
Customer Involvement| Ít        | Trung bình | Nhiều       | Vừa phải
Team Size          | Lớn       | Vừa        | Nhỏ (3–9)   | Lớn
Documentation      | Nhiều      | Vừa phải   | Ít          | Nhiều
Flexibility        | Thấp       | Trung bình | Cao         | Trung bình
Risk Management    | Kém        | Trung bình | Tốt         | Rất tốt
Cost Estimation    | Dễ         | Trung bình | Khó         | Khó
Time to Market     | Chậm       | Nhanh hơn  | Nhanh nhất  | Chậm
Suitable For       | Rõ YC      | YC chưa rõ | Startup     | Phức tạp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CÁCH CHỌN MÔ HÌNH

CÂU HỎI 1: Requirements đã rõ ràng chưa?
→ Rõ, ít thay đổi → Waterfall
→ Chưa rõ, có thể thay đổi → Iterative/Agile

CÂU HỎI 2: Cần demo sản phẩm sớm không?
→ Có → Iterative Incremental hoặc Agile
→ Không → Waterfall

CÂU HỎI 3: Team có kinh nghiệm Agile không?
→ Có → Agile/Scrum
→ Không → Iterative Incremental (đơn giản hơn)

CÂU HỎI 4: Dự án có nhiều rủi ro kỹ thuật không?
→ Có → Spiral
→ Không → Waterfall hoặc Iterative

CÂU HỎI 5: Dự án bao lớn?
→ Nhỏ (< 3 tháng) → Waterfall hoặc Agile
→ Vừa (3–6 tháng) → Iterative Incremental hoặc Agile
→ Lớn (> 1 năm) → Spiral

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 THỰC TẾ: HYBRID APPROACH

Trong thực tế, nhiều công ty dùng kết hợp:
• Waterfall cho planning và architecture
• Agile/Scrum cho development iterations
• Spiral principles cho risk management`
            },
            {
                order_index: 2,
                title: 'Case Study: Chọn mô hình cho từng loại dự án',
                content: `Case Study — Áp dụng thực tế

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASE STUDY 1: HỆ THỐNG NGÂN HÀNG

Dự án: Core Banking System cho ngân hàng
Đặc điểm:
• Budget: 50 tỷ đồng
• Timeline: 2 năm
• Requirements: rõ ràng, được quy định bởi pháp luật
• Risk: Cực cao (tiền của khách hàng)
• Team: 50 người

→ Mô hình phù hợp: SPIRAL
• Vì: rủi ro cao, cần prototype sớm để verify
• Vì: requirements phức tạp nhưng rõ ràng
• Vì: không thể để lỗi xảy ra trên production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASE STUDY 2: STARTUP APP

Dự án: App giao đồ ăn startup
Đặc điểm:
• Budget: hạn chế
• Timeline: ra market trong 3 tháng
• Requirements: chưa rõ, thay đổi liên tục theo feedback
• Risk: Trung bình
• Team: 4 người (2 dev, 1 designer, 1 PM)

→ Mô hình phù hợp: AGILE / SCRUM
• Sprint 2 tuần
• MVP sau Sprint 1–2
• Iterate dựa trên user feedback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASE STUDY 3: PHẦN MỀM NỘI BỘ

Dự án: Hệ thống quản lý nhân sự công ty
Đặc điểm:
• Budget: vừa phải
• Timeline: 6 tháng
• Requirements: rõ ràng, được HR department cung cấp
• Risk: Thấp
• Team: 5 người

→ Mô hình phù hợp: WATERFALL
• Requirements đã rõ, ít thay đổi
• Team quen thuộc với domain
• Dễ track progress và estimate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASE STUDY 4: DỰ ÁN MÔN HỌC (iLearn+)

Dự án: iLearn+ — Learning Management System
Đặc điểm:
• Timeline: 2 tháng (1 học kỳ)
• Requirements: chưa rõ hoàn toàn khi bắt đầu
• Team: 3–5 sinh viên
• Cần demo sau mỗi 2 tuần cho thầy cô

→ Mô hình phù hợp: ITERATIVE INCREMENTAL
• Iter 1: Auth + Deploy → demo tuần 2
• Iter 2: Courses + Lessons → demo tuần 4
• Iter 3: AI + Progress → demo tuần 6
• Iter 4: Admin + Polish → demo cuối kỳ

Lý do không dùng Waterfall:
→ Requirements chưa rõ hoàn toàn
→ Cần demo liên tục

Lý do không dùng Agile/Scrum:
→ Team nhỏ, không cần full Scrum ceremonies
→ Iterative Incremental đơn giản hơn, phù hợp học thuật`
            },
            {
                order_index: 3,
                title: 'Xu hướng hiện đại: DevOps và CI/CD',
                content: `DevOps và CI/CD — Phát triển phần mềm hiện đại

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 DEVOPS LÀ GÌ?

DevOps = Development + Operations

Triết lý DevOps phá bỏ rào cản giữa team dev và team ops:
• Dev: viết code, muốn deploy nhanh
• Ops: vận hành hệ thống, muốn ổn định
→ DevOps: cả hai cùng chịu trách nhiệm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 CI/CD PIPELINE

CI — Continuous Integration:
→ Developer push code thường xuyên (ít nhất 1 lần/ngày)
→ Automated build + test chạy ngay lập tức
→ Phát hiện conflict và bug sớm

CD — Continuous Delivery:
→ Code luôn ở trạng thái có thể deploy
→ Deploy lên staging tự động

CD — Continuous Deployment:
→ Deploy lên production tự động khi pass tất cả tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ GITHUB ACTIONS — CI/CD ĐƠN GIẢN

Ví dụ pipeline cho iLearn+:

name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - checkout code
      - setup Node.js
      - npm install
      - run tests
      - deploy to Render

→ Push lên main → tự động test → tự động deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐳 CONTAINERIZATION — DOCKER

Docker giải quyết vấn đề "Works on my machine":
→ Package app + dependencies vào container
→ Chạy như nhau trên mọi môi trường
→ Dev, Staging, Production đều giống nhau

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 KHẢ NĂNG PHỤC HỒI (FAULT TOLERANCE)

Rollback:
→ Khi deploy lỗi → tự động quay lại version trước
→ Database: transaction rollback

Recovery:
→ Backup database định kỳ (hourly incremental, daily full)
→ Health check endpoint
→ Auto-restart khi service crash

Monitoring:
→ Log aggregation (xem lỗi centrally)
→ Alerting khi có vấn đề
→ Dashboard theo dõi metrics`
            }
        ]
    }
];

// ══════════════════════════════════════════════════════
// SEED FUNCTIONS
// ══════════════════════════════════════════════════════

async function clearCourses() {
    log.info('Xóa courses và lessons cũ...');
    await pool.query('DELETE FROM user_progress');
    await pool.query('DELETE FROM lessons');
    await pool.query('DELETE FROM courses');
    log.success('Đã xóa sạch courses và lessons');
}

async function seedCourses() {
    log.title('SEED SE COURSES');
    const results = [];

    for (const c of COURSES) {
        const courseResult = await pool.query(
            `INSERT INTO courses (title, description, model_type)
       VALUES ($1, $2, $3) RETURNING id, title`,
            [c.title, c.description, c.model_type]
        );
        const course = courseResult.rows[0];
        log.success(`Course [${course.id}]: ${course.title}`);

        for (const l of c.lessons) {
            await pool.query(
                `INSERT INTO lessons (course_id, title, content, slide_url, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
                [course.id, l.title, l.content, l.slide_url || '', l.order_index]
            );
            log.info(`  └─ Lesson ${l.order_index}: ${l.title}`);
        }

        results.push({ ...course, lessonCount: c.lessons.length });
    }

    return results;
}

async function printSummary(courses) {
    log.title('SEED HOÀN THÀNH');

    const totalLessons = COURSES.reduce((s, c) => s + c.lessons.length, 0);
    console.log(`\n📦 KẾT QUẢ:`);
    console.log(`   📚 Courses:  ${courses.length}`);
    console.log(`   📝 Lessons:  ${totalLessons}`);

    console.log('\n📚 DANH SÁCH COURSES:');
    console.log('┌────┬──────────────────────────────────────────────────────┬────────┐');
    console.log('│ ID │ Tên course                                           │ Lessons│');
    console.log('├────┼──────────────────────────────────────────────────────┼────────┤');
    for (const c of courses) {
        const title = c.title.substring(0, 52).padEnd(52);
        console.log(`│ ${String(c.id).padEnd(2)} │ ${title} │   ${String(c.lessonCount).padEnd(4)} │`);
    }
    console.log('└────┴──────────────────────────────────────────────────────┴────────┘');

    console.log('\n✅ Tất cả nội dung CNPM đã sẵn sàng trên iLearn+!\n');
}

async function seed() {
    try {
        log.title('iLearn+ — SEED SE COURSES');
        await pool.query('SELECT NOW()');
        log.success('Database connected');

        await clearCourses();
        const courses = await seedCourses();
        await printSummary(courses);

    } catch (err) {
        log.error(`Seed thất bại: ${err.message}`);
        console.error(err);
    } finally {
        await pool.end();
    }
}

seed();