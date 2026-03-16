const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const log = {
    info: (msg) => console.log(`\x1b[36mℹ️  ${msg}\x1b[0m`),
    success: (msg) => console.log(`\x1b[32m✅ ${msg}\x1b[0m`),
    error: (msg) => console.log(`\x1b[31m❌ ${msg}\x1b[0m`),
    title: (msg) => console.log(`\x1b[1m\x1b[35m\n${'═'.repeat(55)}\n  ${msg}\n${'═'.repeat(55)}\x1b[0m`),
};

const COURSES = [
    {
        title: `Tổng quan về Software Engineering`,
        description: `Giới thiệu môn học: định nghĩa Software Engineering, SDLC, vai trò kỹ sư phần mềm và phân tích tính khả thi.`,
        model_type: `overview`,
        lessons: [
            {
                order_index: 1, title: `Software Engineering là gì? — 1. Giới thiệu`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
1. Giới thiệu

Trong thời đại công nghệ thông tin, phần mềm đóng vai trò vô cùng quan
trọng trong mọi lĩnh vực như kinh doanh, giáo dục, y tế, tài chính và
giải trí. Tuy nhiên việc phát triển các hệ thống phần mềm lớn không thể
thực hiện một cách tùy tiện mà cần có phương pháp, quy trình và kỹ thuật
rõ ràng.

Chính vì vậy Software Engineering (Kỹ nghệ phần mềm) ra đời nhằm
cung cấp các nguyên tắc và phương pháp để xây dựng phần mềm một cách
khoa học và hiệu quả.`, slide_url: ''
            },
            {
                order_index: 2, title: `Software Engineering là gì? — 2. Khái niệm Software Engineering`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
2. Khái niệm Software Engineering

Software Engineering là ngành nghiên cứu các phương pháp, công cụ và
quy trình nhằm phát triển, vận hành và bảo trì phần mềm một cách có hệ
thống.

IEEE định nghĩa Software Engineering là:

Việc áp dụng có hệ thống, kỷ luật, có thể định lượng được các phương
pháp vào phát triển, vận hành và bảo trì phần mềm.

Nói đơn giản: Software Engineering = áp dụng nguyên tắc kỹ thuật vào
việc phát triển phần mềm.

Mục tiêu của Software Engineering là tạo ra phần mềm:

-   Đúng chức năng

-   Đúng thời hạn

-   Trong phạm vi ngân sách

-   Dễ bảo trì và mở rộng`, slide_url: ''
            },
            {
                order_index: 3, title: `Software Engineering là gì? — 3. SỰ KHÁC BIỆT: LẬP TRÌNH vs SOFTWARE ENGINEERING`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
3. SỰ KHÁC BIỆT: LẬP TRÌNH vs SOFTWARE ENGINEERING

Lập trình (Programming):

→ Viết code để giải quyết bài toán cụ thể

→ Tập trung vào cá nhân

→ Không cần quy trình phức tạp

Software Engineering:

→ Xây dựng hệ thống phần mềm quy mô lớn

→ Làm việc nhóm, phân chia vai trò

→ Cần quy trình, tài liệu, kiểm thử

→ Đảm bảo chất lượng và khả năng bảo trì`, slide_url: ''
            },
            {
                order_index: 4, title: `Software Engineering là gì? — 4. VAI TRÒ TRONG ĐỘI PHÁT TRIỂN`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
4. VAI TRÒ TRONG ĐỘI PHÁT TRIỂN

• Project Manager: quản lý tiến độ, rủi ro, ngân sách

• Business Analyst: phân tích yêu cầu, viết SRS

• Software Architect: thiết kế kiến trúc hệ thống

• Developer: lập trình theo thiết kế

• QA Engineer: kiểm thử, đảm bảo chất lượng

• DevOps Engineer: triển khai, vận hành hệ thống`, slide_url: ''
            },
            {
                order_index: 5, title: `Software Engineering là gì? — 5. Nguyên tắc xây dựng phần mềm`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
5. Nguyên tắc xây dựng phần mềm

Khi xây dựng phần mềm cần tuân theo một số nguyên tắc:

### Tính đúng đắn

Phần mềm phải hoạt động đúng theo yêu cầu đã xác định.

### Tính khoa học

Quy trình phát triển phải có phương pháp rõ ràng.

### Tính đầy đủ

Phần mềm phải đáp ứng đầy đủ các chức năng cần thiết.

### Tính độc lập

Hệ thống không phụ thuộc quá nhiều vào một cá nhân.

### Tính mở rộng

Phần mềm phải dễ dàng nâng cấp hoặc mở rộng.`, slide_url: ''
            },
            {
                order_index: 6, title: `Software Engineering là gì? — 6. Thế nào là một phần mềm tốt?`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
6. Thế nào là một phần mềm tốt?

Một phần mềm được xem là tốt khi:

-   Đáp ứng đầy đủ chức năng yêu cầu

-   Có hiệu năng tốt

-   Đáng tin cậy

-   Dễ bảo trì

-   Dễ sử dụng`, slide_url: ''
            },
            {
                order_index: 7, title: `Software Engineering là gì? — 7. Thách thức của Software Engineering`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
7. Thách thức của Software Engineering

Một số thách thức lớn hiện nay gồm:

### Tính không đồng nhất

Phần mềm phải chạy trên nhiều nền tảng khác nhau.

### Tốc độ phát triển

Khách hàng yêu cầu phần mềm phải được xây dựng nhanh.

### Độ tin cậy

Phần mềm phải đảm bảo an toàn và chính xác.`, slide_url: ''
            },
            {
                order_index: 8, title: `Software Engineering là gì? — 8. Yêu cầu đối với kỹ sư phần mềm`, content: `━━━ BÀI 1: Software Engineering là gì? ━━━
8. Yêu cầu đối với kỹ sư phần mềm

Một kỹ sư phần mềm cần:

-   Có kiến thức chuyên môn

-   Làm việc có trách nhiệm

-   Tuân thủ đạo đức nghề nghiệp

-   Hợp tác tốt với đồng nghiệp`, slide_url: ''
            },
            {
                order_index: 9, title: `Software Development Life Cycle (SDLC) — 1. Khái niệm`, content: `━━━ BÀI 2: Software Development Life Cycle (SDLC) ━━━
1. Khái niệm

Software Development Life Cycle (SDLC) là vòng đời phát triển phần
mềm, bao gồm các giai đoạn từ khi hình thành ý tưởng cho đến khi phần
mềm được bảo trì.

Mục đích của SDLC:

-   Quản lý quá trình phát triển phần mềm

-   Giảm rủi ro dự án

-   Nâng cao chất lượng sản phẩm`, slide_url: ''
            },
            {
                order_index: 10, title: `Software Development Life Cycle (SDLC) — 2. Các giai đoạn của SDLC`, content: `━━━ BÀI 2: Software Development Life Cycle (SDLC) ━━━
2. Các giai đoạn của SDLC

Một vòng đời phát triển phần mềm thường gồm các giai đoạn sau:

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

→ Nâng cấp hệ thống`, slide_url: ''
            },
            {
                order_index: 11, title: `Software Development Life Cycle (SDLC) — 3. Các mô hình SDLC phổ biến`, content: `━━━ BÀI 2: Software Development Life Cycle (SDLC) ━━━
3. Các mô hình SDLC phổ biến

### 1. Waterfall Model

Mô hình thác nước gồm các giai đoạn thực hiện tuần tự:

1.  Phân tích yêu cầu

2.  Thiết kế

3.  Lập trình

4.  Kiểm thử

5.  Bảo trì

Ưu điểm:

-   Dễ quản lý

-   Quy trình rõ ràng

Nhược điểm:

-   Khó thay đổi yêu cầu

### 2. Iterative Model

Hệ thống được xây dựng qua nhiều vòng lặp.

Mỗi vòng lặp sẽ bổ sung thêm chức năng mới.

Ưu điểm:

-   Khách hàng thấy sản phẩm sớm

-   Dễ điều chỉnh yêu cầu

### 3. Spiral Model

Kết hợp giữa:

-   Waterfall

-   Prototyping

-   Quản lý rủi ro

Mỗi vòng của mô hình gồm:

1.  Xác định mục tiêu

2.  Phân tích rủi ro

3.  Phát triển

4.  Lập kế hoạch

Mỗi mô hình phù hợp với loại dự án khác nhau --- các khóa học tiếp theo
sẽ đi sâu vào từng mô hình`, slide_url: ''
            },
            {
                order_index: 12, title: `Phân tích tính khả thi (Feasibility Study) — 1. Khái niệm`, content: `━━━ BÀI 3: Phân tích tính khả thi (Feasibility Study) ━━━
1. Khái niệm

Feasibility Study là quá trình phân tích và đánh giá các yếu tố
liên quan đến dự án phần mềm nhằm xác định liệu dự án đó có thể thực
hiện thành công hay không.

Nói cách khác, đây là bước trả lời cho các câu hỏi quan trọng
như:

-   Dự án có thể thực hiện được với công nghệ hiện tại không?\\
    

-   Chi phí thực hiện có hợp lý không?\\
    

-   Hệ thống có đáp ứng nhu cầu của tổ chức hay không?\\
    

-   Thời gian thực hiện có phù hợp không?\\
    

Nếu kết quả phân tích cho thấy dự án không khả thi, tổ chức có thể
dừng dự án hoặc thay đổi kế hoạch trước khi tốn nhiều chi phí phát
triển.`, slide_url: ''
            },
            {
                order_index: 13, title: `Phân tích tính khả thi (Feasibility Study) — 2. Mục tiêu của phân tích khả thi`, content: `━━━ BÀI 3: Phân tích tính khả thi (Feasibility Study) ━━━
2. Mục tiêu của phân tích khả thi

Việc thực hiện Feasibility Study nhằm đạt được các mục tiêu
sau:

### 2.1. Đánh giá khả năng thực hiện dự án

Xác định xem dự án có thể triển khai với nguồn lực hiện có hay
không.

### 2.2. Giảm rủi ro dự án

Thông qua việc phân tích trước các yếu tố rủi ro, nhóm phát triển có
thể tránh được những thất bại trong quá trình xây dựng hệ thống.

### 2.3. Tối ưu chi phí đầu tư

Feasibility Study giúp doanh nghiệp biết được chi phí dự án và
lợi ích mang lại, từ đó quyết định có nên đầu tư hay không.

### 2.4. Hỗ trợ ra quyết định

Kết quả của quá trình phân tích khả thi thường được trình bày trong
báo cáo khả thi (Feasibility Report), giúp ban quản lý đưa ra quyết
định cuối cùng.`, slide_url: ''
            },
            {
                order_index: 14, title: `Phân tích tính khả thi (Feasibility Study) — 3. Các loại tính khả thi`, content: `━━━ BÀI 3: Phân tích tính khả thi (Feasibility Study) ━━━
3. Các loại tính khả thi

### 3.1. Technical Feasibility (Khả thi kỹ thuật)

Khả thi kỹ thuật đánh giá xem **công nghệ hiện có có đủ để phát triển
hệ thống hay không**.

Các yếu tố cần xem xét gồm:

-   Công nghệ sử dụng (ngôn ngữ lập trình, framework)\\
    

-   Cơ sở hạ tầng hệ thống\\
    

-   Phần cứng và phần mềm cần thiết\\
    

-   Kỹ năng của đội ngũ phát triển

### Ví dụ

Một công ty muốn xây dựng hệ thống AI nhận diện khuôn mặt.

Nhưng đội ngũ phát triển không có kinh nghiệm về Machine Learning
và cũng không có GPU server để xử lý dữ liệu.

Trong trường hợp này, dự án có thể **không khả thi về mặt kỹ
thuật**.

### 3.2. Economic Feasibility (Khả thi kinh tế)

Khả thi kinh tế đánh giá xem **lợi ích của dự án có lớn hơn chi phí đầu
tư hay không**.

Các chi phí cần tính toán gồm:

-   Chi phí phát triển phần mềm\\
    

-   Chi phí mua thiết bị\\
    

-   Chi phí nhân sự\\
    

-   Chi phí bảo trì

Các lợi ích có thể gồm:

-   Tăng doanh thu\\
    

-   Giảm chi phí vận hành\\
    

-   Tăng hiệu suất làm việc

### Ví dụ

Một công ty muốn xây dựng hệ thống quản lý kho.

Chi phí phát triển:\\
200 triệu đồng

Lợi ích dự kiến:\\
Giảm chi phí nhân sự và sai sót trong quản lý kho khoảng 100 triệu mỗi
năm.

Như vậy chỉ sau 2 năm, hệ thống có thể thu hồi vốn đầu tư, nên
dự án được xem là khả thi về kinh tế.

### 3.3. Operational Feasibility (Khả thi vận hành)

Khả thi vận hành đánh giá xem hệ thống mới **có phù hợp với hoạt động
của tổ chức hay không**.

Các câu hỏi cần xem xét:

-   Người dùng có sẵn sàng sử dụng hệ thống mới không?\\
    

-   Hệ thống có phù hợp với quy trình làm việc hiện tại không?\\
    

-   Nhân viên có cần đào tạo thêm không?

### Ví dụ

Một công ty triển khai hệ thống quản lý công việc hoàn toàn tự
động.

Tuy nhiên, nhân viên đã quen với cách làm việc cũ và **không muốn thay
đổi**.

Nếu không có kế hoạch đào tạo và chuyển đổi phù hợp thì hệ thống có thể
không khả thi về mặt vận hành.

### 3.4. Schedule Feasibility (Khả thi thời gian)

Khả thi thời gian đánh giá xem dự án có thể **hoàn thành trong khoảng
thời gian yêu cầu hay không**.

Các yếu tố cần xem xét:

-   Thời gian phát triển hệ thống\\
    

-   Thời gian kiểm thử\\
    

-   Thời gian triển khai\\
    

-   Thời hạn dự án

### Ví dụ

Một công ty yêu cầu xây dựng hệ thống thương mại điện tử trong **1
tháng**.

Tuy nhiên hệ thống cần:

-   Backend\\
    

-   Frontend\\
    

-   Payment gateway\\
    

-   Hệ thống quản lý sản phẩm

Thời gian thực tế cần ít nhất 3--4 tháng.

Do đó dự án không khả thi về mặt thời gian.`, slide_url: ''
            },
            {
                order_index: 15, title: `Phân tích tính khả thi (Feasibility Study) — 4. Các câu hỏi thường dùng trong Feasibility Study`, content: `━━━ BÀI 3: Phân tích tính khả thi (Feasibility Study) ━━━
4. Các câu hỏi thường dùng trong Feasibility Study

Một số câu hỏi thường được đặt ra:

-   Nếu hệ thống không được xây dựng thì sao?\\
    

-   Hệ thống mới mang lại lợi ích gì?\\
    

-   Có vấn đề tích hợp với hệ thống cũ không?\\
    

-   Công nghệ cần sử dụng là gì?\\
    

-   Chi phí và lợi ích như thế nào?\\
    

REQUIREMENTS ENGINEERING -- PHÂN TÍCH YÊU CẦU PHẦN MỀM`, slide_url: ''
            },
        ]
    },
    {
        title: `Requirements Engineering — Phân tích yêu cầu`,
        description: `Thu thập, phân tích và đặc tả yêu cầu phần mềm. Viết SRS, Use Case Diagram theo chuẩn IEEE 830.`,
        model_type: `requirements`,
        lessons: [
            {
                order_index: 1, title: `Requirements là gì? Phân loại yêu cầu — 1. Khái niệm Requirements`, content: `━━━ BÀI 1: Requirements là gì? Phân loại yêu cầu ━━━
1. Khái niệm Requirements

Requirement (yêu cầu) là mô tả về một chức năng, dịch vụ hoặc ràng
buộc mà hệ thống phần mềm phải đáp ứng. Nói cách khác, yêu cầu xác định
những gì hệ thống cần thực hiện để phục vụ nhu cầu của người dùng.

Yêu cầu phần mềm đóng vai trò như một **cầu nối giữa khách hàng và nhóm
phát triển phần mềm**. Khách hàng sẽ mô tả nhu cầu của họ thông qua các
yêu cầu, còn nhóm phát triển sẽ dựa trên những yêu cầu này để thiết kế
và xây dựng hệ thống.

Ví dụ trong một hệ thống bán hàng trực tuyến:

-   Người dùng có thể đăng ký tài khoản

-   Người dùng có thể đăng nhập hệ thống

-   Người dùng có thể tìm kiếm sản phẩm

-   Người dùng có thể đặt hàng

Những mô tả trên chính là các yêu cầu của hệ thống.`, slide_url: ''
            },
            {
                order_index: 2, title: `Requirements là gì? Phân loại yêu cầu — 2. Vai trò của yêu cầu phần mềm`, content: `━━━ BÀI 1: Requirements là gì? Phân loại yêu cầu ━━━
2. Vai trò của yêu cầu phần mềm

Việc xác định yêu cầu chính xác giúp mang lại nhiều lợi ích cho dự án
phần mềm:

-   Giúp nhóm phát triển hiểu rõ nhu cầu của khách hàng

-   Là cơ sở cho việc thiết kế hệ thống và lập trình

-   Giúp quá trình kiểm thử dễ dàng hơn

-   Giảm thiểu sai sót trong quá trình phát triển

Trong thực tế, nhiều dự án phần mềm thất bại vì **yêu cầu không được xác
định rõ ràng hoặc thay đổi liên tục trong quá trình phát triển**.`, slide_url: ''
            },
            {
                order_index: 3, title: `Requirements là gì? Phân loại yêu cầu — 3. Phân loại yêu cầu phần mềm`, content: `━━━ BÀI 1: Requirements là gì? Phân loại yêu cầu ━━━
3. Phân loại yêu cầu phần mềm

Trong kỹ nghệ phần mềm, yêu cầu thường được chia thành hai nhóm chính:

### 3.1 Functional Requirements (Yêu cầu chức năng)

Functional requirements mô tả các chức năng mà hệ thống phải thực hiện.
Những yêu cầu này trả lời câu hỏi:

Hệ thống phải làm gì?

Ví dụ trong hệ thống quản lý sinh viên:

-   Sinh viên có thể đăng ký môn học

-   Giảng viên có thể nhập điểm cho sinh viên

-   Hệ thống hiển thị bảng điểm

Những chức năng này là các yêu cầu chức năng vì chúng mô tả các hoạt
động cụ thể của hệ thống.

### 3.2 Non-Functional Requirements (Yêu cầu phi chức năng)

Non-functional requirements mô tả các thuộc tính hoặc ràng buộc của hệ
thống, tức là cách hệ thống hoạt động.

Một số loại yêu cầu phi chức năng phổ biến gồm:

**Hiệu năng (Performance)\\
** Hệ thống phải xử lý dữ liệu nhanh và đáp ứng nhiều người dùng cùng
lúc.

Ví dụ:\\
Hệ thống phải hỗ trợ tối đa 1000 người dùng truy cập đồng thời.

**Bảo mật (Security)\\
** Dữ liệu và thông tin người dùng phải được bảo vệ.

Ví dụ:\\
Người dùng phải đăng nhập trước khi truy cập hệ thống.

**Khả năng sử dụng (Usability)\\
** Hệ thống phải dễ sử dụng và thân thiện với người dùng.

**Độ tin cậy (Reliability)\\
** Hệ thống phải hoạt động ổn định và ít xảy ra lỗi.

### 3.3. DOMAIN REQUIREMENTS

Yêu cầu từ nghiệp vụ cụ thể:

• Hệ thống ngân hàng: số dư không được âm

• Hệ thống y tế: lưu lịch sử khám bệnh 10 năm

⚠️ LỖI REQUIREMENTS PHỔ BIẾN

• Mơ hồ: Hệ thống phải nhanh → Nhanh là bao nhiêu?

• Mâu thuẫn: FR01 mâu thuẫn với FR05

• Không đầy đủ: Bỏ sót use case quan trọng

• Không thể kiểm thử: Không có tiêu chí đánh giá rõ ràng

✅ TIÊU CHÍ YÊU CẦU TỐT (SMART)

S --- Specific: cụ thể, không mơ hồ

M --- Measurable: có thể đo lường được

A --- Achievable: có thể thực hiện được

R --- Relevant: liên quan đến mục tiêu

T --- Testable: có thể kiểm thử được`, slide_url: ''
            },
            {
                order_index: 4, title: `Requirements Elicitation -- Thu thập yêu cầu — 1. Khái niệm`, content: `━━━ BÀI 2: Requirements Elicitation -- Thu thập yêu cầu ━━━
1. Khái niệm

Requirements Elicitation là quá trình thu thập thông tin về yêu cầu
của hệ thống từ các bên liên quan (stakeholders).

Các stakeholders có thể bao gồm:

-   Khách hàng\\
    

-   Người sử dụng hệ thống\\
    

-   Quản lý dự án\\
    

-   Lập trình viên\\
    

-   Tester\\
    

Mục tiêu của quá trình này là hiểu rõ nhu cầu của người dùng và xác
định các chức năng mà hệ thống cần cung cấp.`, slide_url: ''
            },
            {
                order_index: 5, title: `Requirements Elicitation -- Thu thập yêu cầu — 2. Các phương pháp thu thập yêu cầu`, content: `━━━ BÀI 2: Requirements Elicitation -- Thu thập yêu cầu ━━━
2. Các phương pháp thu thập yêu cầu

Có nhiều phương pháp khác nhau để thu thập yêu cầu từ người
dùng.

### 2.1 Phỏng vấn (Interview)

Phỏng vấn là phương pháp phổ biến nhất trong việc thu thập yêu cầu. Nhà
phân tích hệ thống sẽ trao đổi trực tiếp với khách hàng hoặc người dùng
để tìm hiểu nhu cầu của họ.

Ví dụ câu hỏi phỏng vấn:

-   Hệ thống hiện tại có những vấn đề gì?\\
    

-   Bạn mong muốn hệ thống mới có những chức năng nào?\\
    

-   Quy trình làm việc hiện tại của bạn như thế nào?\\
    

Ưu điểm của phương pháp này là thu thập được nhiều thông tin chi tiết.
Tuy nhiên, nó cũng khá tốn thời gian.

### 2.2 Khảo sát (Questionnaire)

Khảo sát sử dụng bảng câu hỏi để thu thập ý kiến của nhiều người dùng
cùng lúc. Phương pháp này thường được sử dụng khi số lượng người dùng
lớn.

Ưu điểm là tiết kiệm thời gian và có thể thu thập dữ liệu từ nhiều
người. Tuy nhiên thông tin thu được có thể không chi tiết như phỏng
vấn.

### 2.3 Quan sát (Observation)

Trong phương pháp này, nhà phân tích sẽ quan sát cách người dùng thực
hiện công việc trong hệ thống hiện tại.

Ví dụ:

Quan sát nhân viên nhập dữ liệu trong hệ thống quản lý kho để hiểu quy
trình làm việc của họ.

Phương pháp này giúp phát hiện những vấn đề mà người dùng có thể không
đề cập trong quá trình phỏng vấn.

### 2.4 Prototyping

Prototyping là phương pháp xây dựng một phiên bản mẫu của hệ thống
để người dùng thử nghiệm.

Sau khi người dùng sử dụng bản mẫu, nhóm phát triển sẽ thu thập phản
hồi để điều chỉnh yêu cầu cho phù hợp hơn.`, slide_url: ''
            },
            {
                order_index: 6, title: `Requirements Elicitation -- Thu thập yêu cầu — 3. Stakeholder trong quá trình thu thập yêu cầu`, content: `━━━ BÀI 2: Requirements Elicitation -- Thu thập yêu cầu ━━━
3. Stakeholder trong quá trình thu thập yêu cầu

Stakeholder là những cá nhân, nhóm hoặc tổ chức có liên quan đến hệ
thống hoặc bị ảnh hưởng bởi hệ thống khi nó được phát triển và sử dụng.
Việc xác định đúng các stakeholder giúp nhóm phát triển hiểu rõ nhu cầu
của các bên liên quan và thu thập yêu cầu một cách đầy đủ, chính xác
hơn.

Stakeholder thường được chia thành các nhóm sau:

-   Primary stakeholders: là những người sử dụng hệ thống trực tiếp
trong quá trình làm việc hằng ngày, ví dụ như nhân viên, sinh viên
hoặc khách hàng sử dụng hệ thống.\\
    

-   Secondary stakeholders: là những người tham gia vào việc quản
lý, vận hành hoặc hỗ trợ hệ thống, chẳng hạn như quản trị hệ thống
(admin) hoặc bộ phận IT support.\\
    

-   Tertiary stakeholders: là những người có lợi ích gián tiếp từ
hệ thống hoặc tham gia vào việc ra quyết định, ví dụ như ban giám
đốc hoặc nhà quản lý.\\
    

-   External stakeholders: là các tổ chức hoặc cá nhân bên ngoài
nhưng vẫn có liên quan đến hệ thống, chẳng hạn như cơ quan quản
lý, đối tác hoặc nhà cung cấp dịch vụ.`, slide_url: ''
            },
            {
                order_index: 7, title: `Requirements Elicitation -- Thu thập yêu cầu — 4. Khó khăn khi thu thập yêu cầu`, content: `━━━ BÀI 2: Requirements Elicitation -- Thu thập yêu cầu ━━━
4. Khó khăn khi thu thập yêu cầu

Trong thực tế, việc thu thập yêu cầu từ các stakeholder không phải lúc
nào cũng dễ dàng. Nhóm phát triển thường gặp một số khó khăn phổ biến
sau:

-   Stakeholder không biết rõ mình cần gì: nhiều người dùng chỉ
nhận ra vấn đề của hệ thống hiện tại nhưng không thể mô tả rõ ràng
hệ thống mới cần có những chức năng nào.\\
    

-   Yêu cầu giữa các stakeholder có thể mâu thuẫn nhau: mỗi nhóm
stakeholder có mục tiêu và lợi ích khác nhau, dẫn đến những yêu
cầu không thống nhất.\\
    

-   Yêu cầu thay đổi trong quá trình phát triển: khi dự án đang
thực hiện, nhu cầu của người dùng hoặc doanh nghiệp có thể thay
đổi, làm ảnh hưởng đến yêu cầu ban đầu.\\
    

-   Rào cản giao tiếp: sự khác biệt giữa ngôn ngữ kỹ thuật của lập
trình viên và ngôn ngữ nghiệp vụ của người dùng có thể gây khó
khăn trong việc hiểu đúng yêu cầu.`, slide_url: ''
            },
            {
                order_index: 8, title: `Viết SRS (Software Requirements Specification) — 1. SRS là gì?`, content: `━━━ BÀI 3: Viết SRS (Software Requirements Specification) ━━━
1. SRS là gì?

SRS (Software Requirements Specification) là tài liệu mô tả chi
tiết và đầy đủ các yêu cầu của hệ thống phần mềm. Tài liệu này ghi lại
tất cả các chức năng mà hệ thống phải thực hiện cũng như các yêu cầu phi
chức năng liên quan.

SRS đóng vai trò như một **tài liệu chính thức giữa khách hàng và đội
phát triển**, giúp đảm bảo rằng cả hai bên đều hiểu rõ hệ thống sẽ được
xây dựng như thế nào. Trong quá trình phát triển phần mềm, SRS thường
được xem như một "hợp đồng kỹ thuật" làm cơ sở cho các giai đoạn tiếp
theo như thiết kế, lập trình và kiểm thử.

Một tài liệu SRS tốt giúp:

-   Xác định rõ phạm vi của hệ thống\\
    

-   Tránh hiểu nhầm giữa khách hàng và nhóm phát triển\\
    

-   Làm cơ sở để thiết kế và kiểm thử phần mềm`, slide_url: ''
            },
            {
                order_index: 9, title: `Viết SRS (Software Requirements Specification) — 2. Cấu trúc SRS chuẩn (IEEE 830)`, content: `━━━ BÀI 3: Viết SRS (Software Requirements Specification) ━━━
2. Cấu trúc SRS chuẩn (IEEE 830)

Theo chuẩn IEEE 830, một tài liệu SRS thường bao gồm các phần chính
sau:

### 2.1. Introduction

Phần này giới thiệu tổng quan về tài liệu và hệ thống.

-   Purpose: mô tả mục đích của tài liệu SRS và đối tượng đọc tài
liệu.\\
    

-   Scope: mô tả phạm vi của hệ thống, hệ thống sẽ thực hiện những
chức năng gì.\\
    

-   Definitions: giải thích các thuật ngữ, từ viết tắt được sử dụng
trong tài liệu.\\
    

-   References: liệt kê các tài liệu tham khảo liên quan.

### 2.2. Overall Description

Phần này mô tả tổng quan về hệ thống trước khi đi vào chi tiết các yêu
cầu.

-   Product Perspective: mô tả vị trí của hệ thống trong bức tranh
tổng thể, ví dụ hệ thống có liên kết với hệ thống khác hay không.\\
    

-   Product Functions: tóm tắt các chức năng chính của hệ thống.\\
    

-   User Characteristics: mô tả đặc điểm của người dùng hệ thống
như trình độ kỹ thuật, vai trò hoặc kinh nghiệm sử dụng.\\
    

-   Constraints: các ràng buộc của hệ thống, ví dụ như ràng buộc về
công nghệ, pháp lý hoặc phần cứng.

### 2.3. Specific Requirements

Đây là phần quan trọng nhất của tài liệu SRS, mô tả chi tiết các yêu
cầu của hệ thống.

-   Functional Requirements: mô tả các chức năng cụ thể mà hệ thống
phải thực hiện.\\
    

-   Non-Functional Requirements: mô tả các yêu cầu về hiệu năng,
bảo mật, khả năng mở rộng, tính ổn định của hệ thống.\\
    

-   External Interface Requirements: mô tả các giao diện bên ngoài
như API, giao diện người dùng hoặc kết nối với hệ thống
khác.

### 2.4. Appendices

Phần phụ lục chứa các tài liệu bổ sung để hỗ trợ cho việc hiểu hệ
thống, ví dụ như:

-   ERD (Entity Relationship Diagram)\\
    

-   Mockup giao diện\\
    

-   Biểu đồ dữ liệu`, slide_url: ''
            },
            {
                order_index: 10, title: `Viết SRS (Software Requirements Specification) — 3. Cách viết Functional Requirement`, content: `━━━ BÀI 3: Viết SRS (Software Requirements Specification) ━━━
3. Cách viết Functional Requirement

Khi viết yêu cầu chức năng trong tài liệu SRS, mỗi yêu cầu cần được mô
tả rõ ràng và có cấu trúc cụ thể để dễ quản lý và kiểm thử.

Một format thường được sử dụng gồm:

-   ID: mã định danh duy nhất của yêu cầu\\
    

-   Title: tên của chức năng\\
    

-   Description: mô tả chức năng của hệ thống\\
    

-   Priority: mức độ ưu tiên của yêu cầu\\
    

-   Input: dữ liệu đầu vào\\
    

-   Output: kết quả đầu ra\\
    

-   Precondition: điều kiện cần có trước khi thực hiện chức năng\\
    

-   Postcondition: trạng thái hệ thống sau khi chức năng hoàn
thành\\
    

Ví dụ:

ID: **FR-001\\
 Title: Đăng ký tài khoản**

Description: Hệ thống cho phép người dùng tạo tài khoản mới bằng email
và mật khẩu.

Priority: High

Input: name, email, password

Output: Tài khoản được tạo và hệ thống trả về JWT token

Precondition: Email chưa được đăng ký trong hệ thống

Postcondition: Thông tin người dùng được lưu vào cơ sở dữ liệu.`, slide_url: ''
            },
            {
                order_index: 11, title: `Viết SRS (Software Requirements Specification) — 4. Checklist cho một SRS tốt`, content: `━━━ BÀI 3: Viết SRS (Software Requirements Specification) ━━━
4. Checklist cho một SRS tốt

Để đảm bảo chất lượng của tài liệu SRS, cần kiểm tra một số tiêu chí
sau:

-   Mỗi yêu cầu phải có ID duy nhất để dễ quản lý.\\
    

-   Yêu cầu phải rõ ràng và không mơ hồ, tránh nhiều cách hiểu khác
nhau.\\
    

-   Yêu cầu cần có khả năng kiểm thử, nghĩa là có thể xác nhận được
hệ thống đã đáp ứng hay chưa.\\
    

-   Các yêu cầu không được mâu thuẫn với nhau.\\
    

-   Mỗi yêu cầu cần có khả năng truy vết (traceability) từ yêu cầu
đến thiết kế và test case.`, slide_url: ''
            },
            {
                order_index: 12, title: `Use Case Diagram và Use Case Specification — 1. Use Case là gì?`, content: `━━━ BÀI 4: Use Case Diagram và Use Case Specification ━━━
1. Use Case là gì?

Use Case là mô tả một tình huống cụ thể trong đó Actor (người
dùng hoặc hệ thống bên ngoài) tương tác với hệ thống để đạt được một mục
tiêu nào đó.

Use Case giúp mô tả các chức năng của hệ thống từ góc nhìn của người
dùng. Thông qua Use Case, nhóm phát triển có thể hiểu rõ cách người dùng
sử dụng hệ thống và các chức năng mà hệ thống cần cung cấp.

Use Case thường được biểu diễn bằng Use Case Diagram, một loại sơ
đồ trong UML giúp minh họa mối quan hệ giữa người dùng và các chức năng
của hệ thống.`, slide_url: ''
            },
            {
                order_index: 13, title: `Use Case Diagram và Use Case Specification — 2. Các thành phần trong Use Case Diagram`, content: `━━━ BÀI 4: Use Case Diagram và Use Case Specification ━━━
2. Các thành phần trong Use Case Diagram

Một Use Case Diagram thường bao gồm các thành phần chính sau:

### 2.1. Actor (Tác nhân)

Actor là thực thể bên ngoài hệ thống có tương tác với hệ thống. Actor
có thể là người dùng hoặc một hệ thống khác.

Trong sơ đồ Use Case, actor thường được biểu diễn bằng **hình người
(stick figure)**.

Ví dụ:

-   Student\\
    

-   Admin\\
    

-   Payment Gateway

### 2.2. Use Case (Ca sử dụng)

Use Case biểu diễn các chức năng mà hệ thống cung cấp cho người dùng.
Mỗi use case mô tả một hành động hoặc một mục tiêu mà người dùng muốn
thực hiện.

Trong sơ đồ Use Case, use case được biểu diễn bằng **hình
oval**.

Ví dụ:

-   Đăng nhập\\
    

-   Xem bài học\\
    

-   Thanh toán

### 2.3. System Boundary

System Boundary là khung hình chữ nhật bao quanh các Use Case trong hệ
thống. Nó giúp phân biệt rõ ràng những chức năng thuộc hệ thống và
những tác nhân bên ngoài hệ thống.

Nhờ System Boundary, người đọc sơ đồ có thể dễ dàng hiểu được phạm vi
của hệ thống.`, slide_url: ''
            },
            {
                order_index: 14, title: `Use Case Diagram và Use Case Specification — 3. Relationships trong Use Case Diagram`, content: `━━━ BÀI 4: Use Case Diagram và Use Case Specification ━━━
3. Relationships trong Use Case Diagram

Trong Use Case Diagram, các thành phần có thể liên kết với nhau thông
qua một số loại quan hệ.

### 3.1. Association

Association thể hiện sự tương tác giữa Actor và Use Case. Quan hệ này
cho biết actor có thể sử dụng hoặc thực hiện chức năng đó trong hệ
thống.

Ví dụ:\\
Student ──── Đăng nhập

### 3.2. Include

Quan hệ Include thể hiện việc một Use Case **bắt buộc phải gọi đến
một Use Case khác** trong quá trình thực hiện.

Ví dụ:

Use Case "Xem bài học" luôn phải thực hiện "Xác thực JWT" trước
khi hiển thị nội dung bài học.\\
Nếu không có bước xác thực thì người dùng sẽ không thể truy cập bài
học.

### 3.3. Extend

Quan hệ Extend thể hiện một Use Case **có thể xảy ra thêm trong một
số điều kiện nhất định**, nhưng không bắt buộc.

Ví dụ:

Trong quá trình "Đặt hàng", người dùng có thể thực hiện thêm bước
"Áp mã giảm giá" nếu họ có mã khuyến mãi.

### 3.4. Generalization

Generalization thể hiện quan hệ kế thừa giữa các actor hoặc use
case. Actor con sẽ kế thừa các đặc điểm và hành vi của actor
cha.

Ví dụ:\\
Admin có thể kế thừa các chức năng cơ bản của User.`, slide_url: ''
            },
            {
                order_index: 15, title: `Use Case Diagram và Use Case Specification — 4. Use Case Specification`, content: `━━━ BÀI 4: Use Case Diagram và Use Case Specification ━━━
4. Use Case Specification

Use Case Specification là tài liệu mô tả chi tiết cách một Use Case
hoạt động. Nó giúp nhóm phát triển hiểu rõ luồng xử lý của chức năng
trong hệ thống.

Một Use Case Specification thường bao gồm:

-   Tên Use Case\\
    

-   Actors\\
    

-   Preconditions (điều kiện trước)\\
    

-   Main Flow (luồng chính)\\
    

-   Alternative Flows (luồng thay thế)\\
    

-   Postconditions (điều kiện sau)

### Ví dụ: Use Case Đăng nhập

Use Case: Đăng nhập

Actors: Student

Preconditions: Người dùng đã có tài khoản trong hệ thống.

Main Flow:

1.  Người dùng mở trang đăng nhập.\\
    

2.  Người dùng nhập email và mật khẩu.\\
    

3.  Người dùng nhấn nút Submit.\\
    

4.  Hệ thống kiểm tra dữ liệu nhập vào.\\
    

5.  Hệ thống kiểm tra thông tin đăng nhập.\\
    

6.  Hệ thống tạo JWT token.\\
    

7.  Hệ thống chuyển người dùng đến trang Home.\\
    

Postconditions: Người dùng đăng nhập thành công và nhận JWT
token.

Alternative Flows:

-   Email không tồn tại: hệ thống hiển thị thông báo "Tài khoản
không tồn tại".\\
    

-   Sai mật khẩu: hệ thống hiển thị thông báo "Sai mật khẩu".\\
\\
    

Waterfall Model --- Mô hình thác nước`, slide_url: ''
            },
        ]
    },
    {
        title: `Waterfall Model — Mô hình thác nước`,
        description: `Mô hình phát triển tuyến tính cổ điển. Các giai đoạn, ưu nhược điểm và bài học từ thực tế.`,
        model_type: `waterfall`,
        lessons: [
            {
                order_index: 1, title: `Tổng quan Waterfall Model — 1. Waterfall Model là gì?`, content: `━━━ BÀI 1: Tổng quan Waterfall Model ━━━
1. Waterfall Model là gì?

Waterfall Model (mô hình thác nước) là một mô hình phát triển phần
mềm truyền thống trong Software Engineering. Trong mô hình này, quá
trình phát triển được chia thành các giai đoạn riêng biệt và thực hiện
tuần tự từ trên xuống, giống như dòng nước chảy qua các tầng của
thác nước.

Mỗi giai đoạn phải hoàn thành trước khi chuyển sang giai đoạn tiếp
theo. Kết quả của giai đoạn trước sẽ trở thành đầu vào cho giai đoạn
sau.

Mô hình Waterfall giúp quy trình phát triển phần mềm trở nên **có cấu
trúc, dễ quản lý và dễ theo dõi tiến độ**.`, slide_url: ''
            },
            {
                order_index: 2, title: `Tổng quan Waterfall Model — 2. Các giai đoạn của Waterfall Model`, content: `━━━ BÀI 1: Tổng quan Waterfall Model ━━━
2. Các giai đoạn của Waterfall Model

Một dự án theo Waterfall thường trải qua các giai đoạn sau:

### 2.1. Requirements Analysis

Đây là giai đoạn thu thập và phân tích yêu cầu của hệ thống. Nhóm phát
triển sẽ làm việc với khách hàng để xác định các chức năng và yêu cầu
cần thiết.

Kết quả của giai đoạn này thường là tài liệu **SRS (Software
Requirements Specification)**.

### 2.2. System Design

Sau khi yêu cầu đã được xác định, nhóm phát triển sẽ thiết kế hệ
thống.

Giai đoạn này bao gồm:

-   Thiết kế kiến trúc hệ thống\\
    

-   Thiết kế cơ sở dữ liệu\\
    

-   Thiết kế giao diện người dùng

Các công cụ như UML Diagram thường được sử dụng trong bước
này.

### 2.3. Implementation

Ở giai đoạn này, các lập trình viên bắt đầu viết mã nguồn dựa trên bản
thiết kế đã được tạo ra trước đó.

Hệ thống thường được chia thành nhiều module để lập trình và sau đó
tích hợp lại thành một hệ thống hoàn chỉnh.

### 2.4. Testing

Sau khi lập trình xong, hệ thống cần được kiểm thử để đảm bảo phần mềm
hoạt động đúng theo yêu cầu.

Các loại kiểm thử thường bao gồm:

-   Unit Testing\\
    

-   Integration Testing\\
    

-   System Testing

### 2.5. Deployment và Maintenance

Sau khi phần mềm hoàn thành và kiểm thử thành công, hệ thống sẽ được
triển khai cho người dùng sử dụng.

Trong quá trình sử dụng, hệ thống có thể cần được:

-   sửa lỗi\\
    

-   nâng cấp chức năng\\
    

-   bảo trì hệ thống`, slide_url: ''
            },
            {
                order_index: 3, title: `Tổng quan Waterfall Model — 3. Ưu điểm của Waterfall Model`, content: `━━━ BÀI 1: Tổng quan Waterfall Model ━━━
3. Ưu điểm của Waterfall Model

Waterfall Model có một số ưu điểm như:

-   Quy trình phát triển rõ ràng và dễ hiểu\\
    

-   Dễ quản lý tiến độ dự án\\
    

-   Mỗi giai đoạn có tài liệu đầy đủ\\
    

-   Phù hợp với các dự án có yêu cầu ổn định\\
    

Nhờ cấu trúc tuần tự, Waterfall giúp việc quản lý dự án trở nên dễ dàng
hơn.`, slide_url: ''
            },
            {
                order_index: 4, title: `Tổng quan Waterfall Model — 4. Nhược điểm của Waterfall Model`, content: `━━━ BÀI 1: Tổng quan Waterfall Model ━━━
4. Nhược điểm của Waterfall Model

Bên cạnh những ưu điểm, Waterfall cũng có một số hạn chế:

-   Khó thay đổi yêu cầu sau khi dự án đã bắt đầu\\
    

-   Khách hàng chỉ thấy sản phẩm khi dự án gần hoàn thành\\
    

-   Nếu phát hiện lỗi ở giai đoạn sau thì việc sửa chữa rất tốn chi
phí\\
    

-   Không phù hợp với các dự án có yêu cầu thay đổi thường
xuyên`, slide_url: ''
            },
            {
                order_index: 5, title: `Tổng quan Waterfall Model — 5. Khi nào nên sử dụng Waterfall Model`, content: `━━━ BÀI 1: Tổng quan Waterfall Model ━━━
5. Khi nào nên sử dụng Waterfall Model

Waterfall Model phù hợp với những dự án có các đặc điểm sau:

-   Yêu cầu hệ thống **đã được xác định rõ ràng từ đầu\\
**

-   Phạm vi dự án **ít thay đổi\\
**

-   Công nghệ sử dụng đã quen thuộc\\
    

-   Dự án có quy mô vừa và nhỏ

Mô hình này thường được sử dụng trong các hệ thống như **hệ thống quản
lý nội bộ, hệ thống doanh nghiệp hoặc dự án có yêu cầu rõ ràng ngay từ
đầu**.`, slide_url: ''
            },
            {
                order_index: 6, title: `Áp dụng Waterfall trong thực tế — 1. Ví dụ dự án sử dụng Waterfall`, content: `━━━ BÀI 2: Áp dụng Waterfall trong thực tế ━━━
1. Ví dụ dự án sử dụng Waterfall

Dự án: Hệ thống quản lý thư viện trường đại học\\
Thời gian: 6 tháng\\
Nhóm phát triển: 5 người

### Giai đoạn 1 --- Requirements (Tháng 1)

Ở giai đoạn này, nhóm phát triển tiến hành thu thập và phân tích yêu
cầu từ các stakeholder.

Các hoạt động chính:

-   Phỏng vấn thủ thư, sinh viên và giảng viên\\
    

-   Xác định các chức năng cần thiết như: mượn sách, trả sách, tìm kiếm
sách, quản lý phạt quá hạn\\
    

-   Viết tài liệu SRS mô tả chi tiết yêu cầu hệ thống\\
    

-   Review và ký xác nhận (sign-off) với ban giám đốc

### Giai đoạn 2 --- Design (Tháng 2)

Sau khi yêu cầu được xác nhận, nhóm phát triển tiến hành thiết kế hệ
thống.

Các công việc thực hiện:

-   Thiết kế cơ sở dữ liệu gồm các bảng: **books, members, borrowings,
fines\\
**

-   Thiết kế giao diện người dùng thông qua **wireframe cho từng màn
hình\\
**

-   Lựa chọn công nghệ phát triển như PHP và MySQL

### Giai đoạn 3 --- Implementation (Tháng 3--4)

Trong giai đoạn này, nhóm lập trình bắt đầu xây dựng hệ thống.

Các module được phát triển bao gồm:

-   Module mượn và trả sách\\
    

-   Module tìm kiếm sách\\
    

-   Module báo cáo và thống kê

### Giai đoạn 4 --- Testing (Tháng 5)

Sau khi hệ thống được lập trình xong, nhóm tiến hành kiểm thử.

Các hoạt động kiểm thử:

-   Kiểm tra từng chức năng của hệ thống\\
    

-   Thực hiện User Acceptance Testing (UAT) với thủ thư\\
    

-   Phát hiện và sửa lỗi trong hệ thống

### Giai đoạn 5--6 --- Deploy và Training (Tháng 6)

Sau khi hệ thống hoàn thiện, phần mềm được triển khai vào môi trường
thực tế.

Các công việc bao gồm:

-   Triển khai hệ thống lên server của trường\\
    

-   Tổ chức 3 buổi training để hướng dẫn thủ thư sử dụng hệ
thống`, slide_url: ''
            },
            {
                order_index: 7, title: `Áp dụng Waterfall trong thực tế — 2. Bài học từ dự án thất bại`, content: `━━━ BÀI 2: Áp dụng Waterfall trong thực tế ━━━
2. Bài học từ dự án thất bại

Trong thực tế, nhiều dự án Waterfall gặp khó khăn do một số vấn đề
sau:

-   Trong giai đoạn testing phát hiện thiết kế cơ sở dữ liệu sai,
dẫn đến phải sửa lại từ đầu.\\
    

-   Khách hàng thay đổi yêu cầu khi dự án đang phát triển, làm tăng
chi phí và thời gian.\\
    

-   Không có prototype sớm, khiến khách hàng không hài lòng với
giao diện khi sản phẩm hoàn thành.

Từ những vấn đề này, có thể rút ra một số bài học:

-   Cần xác nhận yêu cầu (sign-off) thật kỹ trước khi bắt đầu phát
triển.\\
    

-   Nên xây dựng prototype sớm để khách hàng kiểm tra giao diện.\\
    

-   Dành nhiều thời gian hơn cho giai đoạn kiểm thử.`, slide_url: ''
            },
            {
                order_index: 8, title: `Áp dụng Waterfall trong thực tế — 3. Metrics quản lý dự án Waterfall`, content: `━━━ BÀI 2: Áp dụng Waterfall trong thực tế ━━━
3. Metrics quản lý dự án Waterfall

Trong các dự án Waterfall, một số công cụ và chỉ số thường được sử dụng
để theo dõi tiến độ và chất lượng dự án:

-   Earned Value Management (EVM): dùng để đánh giá tiến độ và chi
phí dự án.\\
    

-   Gantt Chart: biểu đồ theo dõi tiến độ của các giai đoạn trong
dự án.\\
    

-   Burn-down chart: theo dõi số lượng lỗi còn lại cần sửa.\\
    

-   Change Request Log: ghi lại các yêu cầu thay đổi trong quá
trình phát triển.

Những công cụ này giúp nhóm quản lý dự án kiểm soát tốt hơn tiến độ và
chất lượng của dự án phần mềm.

ITERATIVE INCREMENTAL MODEL --- MÔ HÌNH LẶP LẠI, TĂNG THÊM`, slide_url: ''
            },
        ]
    },
    {
        title: `Iterative Incremental Model — Mô hình lặp lại, tăng thêm`,
        description: `Phát triển phần mềm qua nhiều vòng lặp, mỗi vòng bàn giao thêm chức năng theo thứ tự ưu tiên.`,
        model_type: `iterative_incremental`,
        lessons: [
            {
                order_index: 1, title: `Tổng quan Iterative Incremental Model — 1. Iterative Incremental Model là gì?`, content: `━━━ BÀI 1: Tổng quan Iterative Incremental Model ━━━
1. Iterative Incremental Model là gì?

Iterative Incremental Model là mô hình phát triển phần mềm trong đó
hệ thống được xây dựng thông qua nhiều vòng lặp (iterations) và mỗi
vòng lặp sẽ bổ sung thêm chức năng mới (increments) cho hệ thống.

Thay vì phát triển toàn bộ hệ thống trong một lần như Waterfall, mô hình
này chia dự án thành nhiều phần nhỏ. Sau mỗi iteration, một phiên bản
hoạt động của phần mềm sẽ được tạo ra và có thể được đánh giá hoặc sử
dụng thử.

Cách tiếp cận này giúp nhóm phát triển nhận phản hồi sớm từ người dùng
và cải thiện hệ thống qua từng vòng lặp.`, slide_url: ''
            },
            {
                order_index: 2, title: `Tổng quan Iterative Incremental Model — 2. Đặc điểm của Iterative Incremental Model`, content: `━━━ BÀI 1: Tổng quan Iterative Incremental Model ━━━
2. Đặc điểm của Iterative Incremental Model

Mô hình này có một số đặc điểm quan trọng:

-   Phần mềm được phát triển **từng phần nhỏ (increment)\\
**

-   Mỗi iteration bao gồm các bước: **phân tích -- thiết kế -- lập trình
-- kiểm thử\\
**

-   Sau mỗi iteration sẽ có một **phiên bản phần mềm có thể hoạt động\\
**

-   Dễ dàng cải tiến hệ thống dựa trên phản hồi của người dùng

Nhờ đặc điểm này, Iterative Incremental Model linh hoạt hơn so với
Waterfall.`, slide_url: ''
            },
            {
                order_index: 3, title: `Tổng quan Iterative Incremental Model — 3. Quy trình của Iterative Incremental Model`, content: `━━━ BÀI 1: Tổng quan Iterative Incremental Model ━━━
3. Quy trình của Iterative Incremental Model

Quy trình của mô hình Iterative Incremental thường lặp lại qua các bước
sau:

**1. Requirements Analysis\\
** Xác định các yêu cầu cần thực hiện trong iteration hiện tại. Không
cần xác định toàn bộ yêu cầu ngay từ đầu như Waterfall.

**2. System Design\\
** Thiết kế kiến trúc và các thành phần cần thiết để thực hiện các chức
năng trong iteration.

**3. Implementation\\
** Lập trình các chức năng đã được xác định trong iteration.

**4. Testing\\
** Kiểm thử các chức năng mới để đảm bảo hệ thống hoạt động đúng.

**5. Integration\\
** Tích hợp phần chức năng vừa phát triển vào hệ thống tổng thể.

Sau khi hoàn thành một iteration, hệ thống sẽ có thêm chức năng mới và
quá trình phát triển tiếp tục với iteration tiếp theo.`, slide_url: ''
            },
            {
                order_index: 4, title: `Tổng quan Iterative Incremental Model — 4. Ưu điểm của Iterative Incremental Model`, content: `━━━ BÀI 1: Tổng quan Iterative Incremental Model ━━━
4. Ưu điểm của Iterative Incremental Model

Một số ưu điểm của mô hình này bao gồm:

-   Có thể cung cấp **phiên bản phần mềm sớm cho người dùng\\
**

-   Dễ dàng thay đổi yêu cầu trong các iteration sau

-   Phát hiện lỗi sớm trong quá trình phát triển

-   Giảm rủi ro cho dự án`, slide_url: ''
            },
            {
                order_index: 5, title: `Tổng quan Iterative Incremental Model — 5. Nhược điểm của Iterative Incremental Model`, content: `━━━ BÀI 1: Tổng quan Iterative Incremental Model ━━━
5. Nhược điểm của Iterative Incremental Model

Bên cạnh đó, mô hình này cũng có một số hạn chế:

-   Quản lý dự án có thể phức tạp hơn

-   Cần có kế hoạch rõ ràng cho từng iteration

-   Nếu thiết kế kiến trúc ban đầu không tốt thì việc mở rộng hệ thống
sẽ khó khăn`, slide_url: ''
            },
            {
                order_index: 6, title: `Tổng quan Iterative Incremental Model — 6. Khi nào nên sử dụng Iterative Incremental Model`, content: `━━━ BÀI 1: Tổng quan Iterative Incremental Model ━━━
6. Khi nào nên sử dụng Iterative Incremental Model

Mô hình này phù hợp với các dự án:

-   Có yêu cầu **có thể thay đổi theo thời gian\\
**

-   Dự án có **quy mô trung bình hoặc lớn\\
**

-   Khách hàng muốn **thấy sản phẩm sớm để đánh giá\\
**

-   Hệ thống có thể được xây dựng theo từng module

Nhiều dự án phần mềm hiện đại thường sử dụng phương pháp này vì tính
linh hoạt của nó.`, slide_url: ''
            },
            {
                order_index: 7, title: `Lập kế hoạch và phân chia Iterations — 1. Khái niệm Iteration`, content: `━━━ BÀI 2: Lập kế hoạch và phân chia Iterations ━━━
1. Khái niệm Iteration

Iteration là một vòng lặp phát triển phần mềm trong mô hình
Iterative Incremental. Trong mỗi iteration, nhóm phát triển sẽ xây dựng
một phần chức năng của hệ thống và tạo ra một phiên bản có thể chạy
được.

Một iteration thường bao gồm các hoạt động:

-   Phân tích yêu cầu

-   Thiết kế

-   Lập trình

-   Kiểm thử

Mỗi iteration thường kéo dài từ 2 đến 4 tuần tùy vào quy mô dự án.`, slide_url: ''
            },
            {
                order_index: 8, title: `Lập kế hoạch và phân chia Iterations — 2. Phân chia hệ thống thành các Increment`, content: `━━━ BÀI 2: Lập kế hoạch và phân chia Iterations ━━━
2. Phân chia hệ thống thành các Increment

Để áp dụng mô hình Iterative Incremental hiệu quả, hệ thống cần được
chia thành nhiều phần nhỏ gọi là increments. Mỗi increment sẽ bổ
sung thêm chức năng mới cho hệ thống.

Ví dụ trong hệ thống quản lý khóa học online:

Iteration 1:

-   Đăng ký tài khoản

-   Đăng nhập

-   Quản lý thông tin người dùng

Iteration 2:

-   Xem danh sách khóa học

-   Xem chi tiết khóa học

-   Đăng ký khóa học

Iteration 3:

-   Thanh toán khóa học

-   Xem tiến độ học tập

-   Quản lý bài học

Sau mỗi iteration, hệ thống sẽ có thêm chức năng mới và ngày càng hoàn
thiện hơn.`, slide_url: ''
            },
            {
                order_index: 9, title: `Lập kế hoạch và phân chia Iterations — 3. Lập kế hoạch cho từng Iteration`, content: `━━━ BÀI 2: Lập kế hoạch và phân chia Iterations ━━━
3. Lập kế hoạch cho từng Iteration

Khi lập kế hoạch cho mỗi iteration, nhóm phát triển cần xác định:

-   Các chức năng sẽ được phát triển trong iteration

-   Thời gian thực hiện

-   Nhiệm vụ của từng thành viên trong nhóm

-   Các tiêu chí hoàn thành (Definition of Done)

Việc lập kế hoạch rõ ràng giúp đảm bảo mỗi iteration hoàn thành đúng
tiến độ và đạt chất lượng mong muốn.`, slide_url: ''
            },
            {
                order_index: 10, title: `Đánh giá và cải tiến sau mỗi Iteration — 1. Sau mỗi Iteration cần làm gì?`, content: `━━━ BÀI 3: Đánh giá và cải tiến sau mỗi Iteration ━━━
1. Sau mỗi Iteration cần làm gì?

Theo quy trình của mô hình Iterative Incremental, sau khi hoàn thành một
vòng phát triển cần thực hiện các bước sau:

1.  Đánh giá kết quả của iteration thông qua việc kiểm thử hệ thống.

2.  Tích hợp phần chức năng mới vào hệ thống tổng thể.

3.  Đánh giá lại toàn bộ hệ thống sau khi tích hợp.

4.  Xác định xem hệ thống đã hoàn thiện hay cần tiếp tục iteration tiếp
theo.

Quy trình này giúp đảm bảo hệ thống luôn được kiểm tra và cải tiến sau
mỗi vòng phát triển.`, slide_url: ''
            },
            {
                order_index: 11, title: `Đánh giá và cải tiến sau mỗi Iteration — 2. Iteration Review (Đánh giá kết quả)`, content: `━━━ BÀI 3: Đánh giá và cải tiến sau mỗi Iteration ━━━
2. Iteration Review (Đánh giá kết quả)

Iteration Review là hoạt động đánh giá kết quả sản phẩm sau khi kết
thúc một iteration.

Một số câu hỏi cần được trả lời trong quá trình review:

-   Những yêu cầu nào đã được hoàn thành?

-   Những yêu cầu nào chưa hoàn thành và lý do là gì?

-   Chất lượng mã nguồn có đảm bảo hay không?

-   Hiệu năng của hệ thống có đạt yêu cầu hay không?

Kết quả của bước này thường được ghi lại trong **Iteration Review
Report**.`, slide_url: ''
            },
            {
                order_index: 12, title: `Đánh giá và cải tiến sau mỗi Iteration — 3. Iteration Retrospective (Nhìn lại quy trình)`, content: `━━━ BÀI 3: Đánh giá và cải tiến sau mỗi Iteration ━━━
3. Iteration Retrospective (Nhìn lại quy trình)

Khác với Review (đánh giá sản phẩm), Retrospective tập trung vào
việc đánh giá quy trình làm việc của nhóm.

Một số câu hỏi thường được đặt ra:

What went well? (Điều gì đã làm tốt?)

Ví dụ:

-   Giao tiếp giữa các thành viên trong nhóm tốt

-   Code review giúp phát hiện nhiều lỗi

What went wrong? (Điều gì chưa tốt?)

Ví dụ:

-   Ước tính thời gian thực hiện chưa chính xác

-   Quá trình deploy gặp lỗi do thiếu cấu hình

What to improve? (Cần cải thiện điều gì?)

Ví dụ:

-   Tăng thêm 20% thời gian dự phòng cho iteration tiếp theo

-   Tạo checklist cho quá trình deployment`, slide_url: ''
            },
            {
                order_index: 13, title: `Đánh giá và cải tiến sau mỗi Iteration — 4. Metrics theo dõi qua các Iterations`, content: `━━━ BÀI 3: Đánh giá và cải tiến sau mỗi Iteration ━━━
4. Metrics theo dõi qua các Iterations

Để đánh giá hiệu quả phát triển qua các iteration, một số chỉ số thường
được sử dụng:

-   Velocity: số lượng công việc (story points) hoàn thành trong mỗi
iteration

-   Bug rate: số lượng lỗi được phát hiện trong mỗi iteration

-   Test coverage: tỷ lệ mã nguồn được kiểm thử

-   Technical debt: lượng nợ kỹ thuật tích lũy trong hệ thống

Những chỉ số này giúp nhóm phát triển theo dõi tiến độ và chất lượng của
dự án.`, slide_url: ''
            },
            {
                order_index: 14, title: `Đánh giá và cải tiến sau mỗi Iteration — 5. Chuẩn bị cho Iteration tiếp theo`, content: `━━━ BÀI 3: Đánh giá và cải tiến sau mỗi Iteration ━━━
5. Chuẩn bị cho Iteration tiếp theo

Sau khi hoàn thành review và retrospective, nhóm phát triển cần chuẩn bị
cho iteration tiếp theo bằng cách:

-   Cập nhật **Product Backlog\\
**

-   Thêm các yêu cầu mới dựa trên phản hồi của người dùng

-   Sắp xếp lại mức độ ưu tiên của các chức năng

-   Ước tính thời gian thực hiện cho iteration mới

Quá trình này giúp dự án tiếp tục phát triển theo hướng phù hợp với nhu
cầu của người dùng.

Agile / Scrum --- Phương pháp phát triển linh hoạt`, slide_url: ''
            },
        ]
    },
    {
        title: `Agile / Scrum — Phương pháp phát triển linh hoạt`,
        description: `Agile Manifesto, Scrum Framework với Roles, Ceremonies, Artifacts. User Story và Story Points.`,
        model_type: `agile`,
        lessons: [
            {
                order_index: 1, title: `Agile Manifesto và 12 nguyên tắc — 1. Lịch sử ra đời của Agile`, content: `━━━ BÀI 1: Agile Manifesto và 12 nguyên tắc ━━━
1. Lịch sử ra đời của Agile

Năm 2001, 17 chuyên gia phần mềm đã gặp nhau tại **Snowbird, Utah
(Mỹ)** để thảo luận về những vấn đề của các phương pháp phát triển phần
mềm truyền thống như Waterfall.

Kết quả của cuộc họp này là Agile Manifesto --- một tuyên ngôn đưa
ra các giá trị và nguyên tắc mới nhằm cải thiện cách phát triển phần
mềm.

Agile tập trung vào việc **phát triển nhanh, thích nghi với thay đổi và
tăng cường hợp tác giữa các bên liên quan**.`, slide_url: ''
            },
            {
                order_index: 2, title: `Agile Manifesto và 12 nguyên tắc — 2. Agile Manifesto --- 4 giá trị cốt lõi`, content: `━━━ BÀI 1: Agile Manifesto và 12 nguyên tắc ━━━
2. Agile Manifesto --- 4 giá trị cốt lõi

Agile Manifesto đưa ra 4 giá trị cốt lõi trong phát triển phần mềm:

**1. Individuals and interactions OVER processes and tools\\
** → Con người và sự giao tiếp quan trọng hơn quy trình và công cụ.

**2. Working software OVER comprehensive documentation\\
** → Phần mềm chạy được quan trọng hơn tài liệu quá chi tiết.

**3. Customer collaboration OVER contract negotiation\\
** → Hợp tác với khách hàng quan trọng hơn việc đàm phán hợp đồng.

**4. Responding to change OVER following a plan\\
** → Thích nghi với thay đổi quan trọng hơn việc bám chặt vào kế hoạch.

Điều này không có nghĩa là các yếu tố bên phải không quan trọng, nhưng
Agile ưu tiên các yếu tố bên trái hơn.`, slide_url: ''
            },
            {
                order_index: 3, title: `Agile Manifesto và 12 nguyên tắc — 3. 12 nguyên tắc của Agile (tóm tắt)`, content: `━━━ BÀI 1: Agile Manifesto và 12 nguyên tắc ━━━
3. 12 nguyên tắc của Agile (tóm tắt)

Agile Manifesto còn đưa ra **12 nguyên tắc phát triển phần mềm linh
hoạt**. Một số nguyên tắc quan trọng gồm:

1.  Ưu tiên làm hài lòng khách hàng thông qua việc bàn giao sớm phần mềm
có giá trị.

2.  Chấp nhận thay đổi yêu cầu, kể cả khi dự án đã phát triển khá lâu.

3.  Bàn giao phần mềm chạy được thường xuyên.

4.  Developer và business phải làm việc cùng nhau thường xuyên.

5.  Xây dựng dự án xung quanh những người có động lực.

6.  Giao tiếp trực tiếp là cách hiệu quả nhất.

7.  Phần mềm hoạt động tốt là thước đo tiến độ chính.

8.  Duy trì nhịp độ phát triển ổn định và bền vững.

9.  Chú trọng thiết kế và kỹ thuật tốt.

10. Đơn giản hóa công việc để giảm lãng phí.

11. Nhóm phát triển nên tự tổ chức.

12. Thường xuyên đánh giá và cải tiến cách làm việc.

Những nguyên tắc này giúp Agile trở thành một phương pháp phát triển
linh hoạt và thích nghi tốt với sự thay đổi của dự án.`, slide_url: ''
            },
            {
                order_index: 4, title: `Scrum Framework --- Roles, Ceremonies, Artifacts — 1. Scrum là gì?`, content: `━━━ BÀI 2: Scrum Framework --- Roles, Ceremonies, Artifacts ━━━
1. Scrum là gì?

Scrum là một framework thuộc Agile giúp nhóm phát triển phần mềm làm
việc hiệu quả thông qua các vòng phát triển ngắn gọi là Sprint.

Một Sprint thường kéo dài 1--4 tuần, và sau mỗi Sprint nhóm sẽ tạo
ra một phiên bản phần mềm có thể sử dụng được.

Scrum xác định rõ vai trò, sự kiện và các công cụ để quản lý quá
trình phát triển.`, slide_url: ''
            },
            {
                order_index: 5, title: `Scrum Framework --- Roles, Ceremonies, Artifacts — 2. Các vai trò trong Scrum (Roles)`, content: `━━━ BÀI 2: Scrum Framework --- Roles, Ceremonies, Artifacts ━━━
2. Các vai trò trong Scrum (Roles)

Scrum có 3 vai trò chính:

### Product Owner (PO)

Product Owner là người đại diện cho khách hàng hoặc business.

Nhiệm vụ chính:

-   Quản lý **Product Backlog\\
**

-   Sắp xếp mức độ ưu tiên các yêu cầu

-   Quyết định **sản phẩm cần làm gì (What)\\
**

Product Owner không quyết định cách team thực hiện (How).

### Scrum Master (SM)

Scrum Master là người đảm bảo team tuân theo quy trình Scrum.

Nhiệm vụ:

-   Hỗ trợ team làm việc hiệu quả

-   Loại bỏ các trở ngại (impediments)

-   Hướng dẫn team áp dụng Scrum đúng cách

Scrum Master không phải là quản lý, mà đóng vai trò **servant
leader**.

### Development Team

Development Team là nhóm trực tiếp phát triển sản phẩm.

Đặc điểm:

-   Cross-functional: gồm nhiều kỹ năng khác nhau (dev, QA,
designer\\...)

-   Self-organizing: tự quyết định cách thực hiện công việc

-   Quy mô thường từ 3--9 người`, slide_url: ''
            },
            {
                order_index: 6, title: `Scrum Framework --- Roles, Ceremonies, Artifacts — 3. Các sự kiện trong Scrum (Ceremonies)`, content: `━━━ BÀI 2: Scrum Framework --- Roles, Ceremonies, Artifacts ━━━
3. Các sự kiện trong Scrum (Ceremonies)

Scrum có 5 sự kiện chính trong mỗi Sprint.

Sprint Planning

-   Diễn ra đầu Sprint

-   Team chọn các công việc từ Product Backlog vào Sprint Backlog

-   Ước tính effort bằng Story Points

Daily Scrum (Stand-up)

-   Họp nhanh mỗi ngày (15 phút)

-   Mỗi thành viên trả lời 3 câu hỏi:

    -   Hôm qua làm gì?

    -   Hôm nay làm gì?

    -   Có gặp khó khăn gì không?

Sprint Review

-   Diễn ra cuối Sprint

-   Team demo sản phẩm cho stakeholders

-   Thu thập phản hồi để cải tiến sản phẩm

Sprint Retrospective

-   Nhìn lại quy trình làm việc của team

-   Xác định điều gì làm tốt và cần cải thiện

Backlog Refinement

-   Làm rõ và chia nhỏ các yêu cầu trong Product Backlog

-   Chuẩn bị cho Sprint Planning tiếp theo.`, slide_url: ''
            },
            {
                order_index: 7, title: `Scrum Framework --- Roles, Ceremonies, Artifacts — 4. Các Artifacts trong Scrum`, content: `━━━ BÀI 2: Scrum Framework --- Roles, Ceremonies, Artifacts ━━━
4. Các Artifacts trong Scrum

Scrum có 3 artifacts chính:

Product Backlog

-   Danh sách toàn bộ yêu cầu của sản phẩm

-   Do Product Owner quản lý.

Sprint Backlog

-   Các công việc được chọn cho Sprint hiện tại

-   Do Development Team quản lý.

Increment

-   Tổng hợp tất cả chức năng hoàn thành trong Sprint

-   Phải là phiên bản sản phẩm có thể phát hành được.`, slide_url: ''
            },
            {
                order_index: 8, title: `User Story và Story Points — 1. User Story là gì?`, content: `━━━ BÀI 3: User Story và Story Points ━━━
1. User Story là gì?

User Story là cách mô tả yêu cầu phần mềm từ góc nhìn của người
dùng, tập trung vào giá trị mà hệ thống mang lại.

User Story thường có dạng:

As a \\role\\, I want \\goal\\ so that \\benefit\\

Ví dụ:

-   *As a student, I want to mark a lesson as completed so that I can
track my learning progress.*

-   *As an admin, I want to create new courses so that students have
content to learn.*

Cách viết này giúp team hiểu rõ **ai sử dụng chức năng và mục đích của
nó**.`, slide_url: ''
            },
            {
                order_index: 9, title: `User Story và Story Points — 2. Tiêu chí INVEST`, content: `━━━ BÀI 3: User Story và Story Points ━━━
2. Tiêu chí INVEST

Một User Story tốt thường tuân theo nguyên tắc INVEST:

-   Independent: có thể phát triển độc lập

-   Negotiable: có thể điều chỉnh trong quá trình phát triển

-   Valuable: mang lại giá trị cho người dùng

-   Estimable: có thể ước tính được

-   Small: đủ nhỏ để hoàn thành trong một Sprint

-   Testable: có thể kiểm thử được

Những tiêu chí này giúp User Story rõ ràng và dễ triển khai.`, slide_url: ''
            },
            {
                order_index: 10, title: `User Story và Story Points — 3. Story Points`, content: `━━━ BÀI 3: User Story và Story Points ━━━
3. Story Points

Story Points là đơn vị dùng để ước tính **độ phức tạp của công
việc**, thay vì đo thời gian thực hiện.

Các Story Points thường sử dụng dãy Fibonacci:

1, 2, 3, 5, 8, 13, 21\\...

Ví dụ:

-   Login API → **3 points\\
**

-   Profile page UI → **5 points\\
**

-   AI Chat integration → 13 points

Việc ước tính thường được thực hiện bằng phương pháp Planning Poker,
trong đó các thành viên trong team đánh giá độc lập và sau đó thảo luận
để đạt được sự đồng thuận.`, slide_url: ''
            },
            {
                order_index: 11, title: `User Story và Story Points — 4. Velocity`, content: `━━━ BÀI 3: User Story và Story Points ━━━
4. Velocity

Velocity là tổng số Story Points mà team hoàn thành trong một
Sprint.

Velocity được dùng để:

-   Dự đoán tiến độ dự án

-   Lập kế hoạch cho các Sprint tiếp theo

-   Đánh giá hiệu suất làm việc của team

Công thức dự báo đơn giản:

Số Sprint cần = Tổng Story Points còn lại / Velocity trung bình

Chỉ số này giúp team lập kế hoạch phát triển sản phẩm một cách hiệu quả
hơn.

SPIRAL MODEL --- MÔ HÌNH XOẮN ỐC`, slide_url: ''
            },
        ]
    },
    {
        title: `Spiral Model — Mô hình xoắn ốc`,
        description: `Mô hình kết hợp Waterfall và Iterative với trọng tâm quản lý rủi ro (Risk Management).`,
        model_type: `spiral`,
        lessons: [
            {
                order_index: 1, title: `Tổng quan Spiral Model — 1. Spiral Model là gì?`, content: `━━━ BÀI 1: Tổng quan Spiral Model ━━━
1. Spiral Model là gì?

Spiral Model là một mô hình phát triển phần mềm kết hợp giữa
Waterfall và Iterative Model, trong đó hệ thống được phát triển qua
nhiều vòng lặp gọi là vòng xoắn (spiral).

Mỗi vòng xoắn đại diện cho một giai đoạn phát triển của dự án. Sau mỗi
vòng, hệ thống được cải tiến dần cho đến khi hoàn thiện.

Điểm đặc biệt của Spiral Model là **tập trung mạnh vào quản lý rủi ro
(Risk Management)** trong suốt quá trình phát triển.`, slide_url: ''
            },
            {
                order_index: 2, title: `Tổng quan Spiral Model — 2. Lịch sử ra đời`, content: `━━━ BÀI 1: Tổng quan Spiral Model ━━━
2. Lịch sử ra đời

Spiral Model được đề xuất bởi Barry Boehm vào năm 1986.

Mục tiêu của mô hình này là khắc phục những hạn chế của **Waterfall
Model**, đặc biệt là:

-   Khó xử lý các **rủi ro trong dự án\\
**

-   Khó thay đổi yêu cầu khi dự án đã bắt đầu

-   Phát hiện vấn đề quá muộn

Do đó, Spiral Model đưa phân tích rủi ro trở thành một bước quan
trọng trong mỗi vòng phát triển.`, slide_url: ''
            },
            {
                order_index: 3, title: `Tổng quan Spiral Model — 3. Cấu trúc của Spiral Model`, content: `━━━ BÀI 1: Tổng quan Spiral Model ━━━
3. Cấu trúc của Spiral Model

Spiral Model được biểu diễn dưới dạng hình xoắn ốc, trong đó mỗi
vòng xoắn gồm 4 giai đoạn (quadrants).

### Quadrant 1 --- Planning (Lên kế hoạch)

Trong giai đoạn này nhóm phát triển sẽ:

-   Xác định **mục tiêu của vòng phát triển\\
**

-   Xác định các **yêu cầu cần thực hiện\\
**

-   Xác định các **giải pháp có thể áp dụng (alternatives)\\
**

-   Xác định các ràng buộc của dự án (constraints)

Kết quả của bước này là kế hoạch cho vòng phát triển tiếp theo.

### Quadrant 2 --- Risk Analysis (Phân tích rủi ro)

Đây là đặc điểm quan trọng nhất của Spiral Model.

Trong bước này nhóm phát triển sẽ:

-   Nhận diện các **rủi ro có thể xảy ra\\
**

-   Phân tích mức độ ảnh hưởng của rủi ro

-   Tìm giải pháp giảm thiểu rủi ro

Một phương pháp thường dùng là xây dựng prototype để kiểm tra ý
tưởng trước khi phát triển toàn bộ hệ thống.

### Quadrant 3 --- Engineering (Phát triển)

Sau khi rủi ro đã được phân tích và xử lý, nhóm phát triển bắt đầu xây
dựng hệ thống.

Các hoạt động chính gồm:

-   Thiết kế hệ thống

-   Lập trình

-   Kiểm thử

Giai đoạn này tương tự với Implementation trong Waterfall Model.

### Quadrant 4 --- Evaluation (Đánh giá)

Ở bước này:

-   Khách hàng sẽ **đánh giá kết quả của vòng phát triển\\
**

-   Nhóm phát triển thu thập **phản hồi từ khách hàng\\
**

-   Quyết định có tiếp tục vòng xoắn tiếp theo hay không

Sau khi hoàn thành bước này, dự án sẽ tiếp tục bước sang vòng xoắn tiếp
theo.`, slide_url: ''
            },
            {
                order_index: 4, title: `Tổng quan Spiral Model — 4. Ưu điểm của Spiral Model`, content: `━━━ BÀI 1: Tổng quan Spiral Model ━━━
4. Ưu điểm của Spiral Model

Một số ưu điểm của mô hình Spiral gồm:

-   Quản lý rủi ro tốt, phát hiện vấn đề sớm

-   Linh hoạt với các yêu cầu thay đổi

-   Cho phép tạo prototype sớm để nhận phản hồi từ khách hàng

-   Phù hợp với các dự án lớn và phức tạp`, slide_url: ''
            },
            {
                order_index: 5, title: `Tổng quan Spiral Model — 5. Nhược điểm của Spiral Model`, content: `━━━ BÀI 1: Tổng quan Spiral Model ━━━
5. Nhược điểm của Spiral Model

Bên cạnh các ưu điểm, Spiral Model cũng có một số hạn chế:

-   Quy trình khá **phức tạp\\
**

-   Chi phí phát triển cao do nhiều vòng lặp

-   Khó ước tính chính xác **thời gian và chi phí dự án\\
**

-   Không phù hợp với các dự án nhỏ`, slide_url: ''
            },
            {
                order_index: 6, title: `Tổng quan Spiral Model — 6. Khi nào nên sử dụng Spiral Model`, content: `━━━ BÀI 1: Tổng quan Spiral Model ━━━
6. Khi nào nên sử dụng Spiral Model

Spiral Model thường được sử dụng trong các dự án:

-   Có **quy mô lớn và ngân sách lớn\\
**

-   Yêu cầu **phức tạp và chưa rõ ràng từ đầu\\
**

-   Sử dụng **công nghệ mới hoặc chưa được kiểm chứng\\
**

-   Có **rủi ro cao\\
**

Ví dụ:

-   Hệ thống quốc phòng

-   Hệ thống hàng không vũ trụ

-   Hệ thống ngân hàng hoặc tài chính lớn`, slide_url: ''
            },
            {
                order_index: 7, title: `Risk Management trong Spiral Model — 1. Risk là gì?`, content: `━━━ BÀI 2: Risk Management trong Spiral Model ━━━
1. Risk là gì?

Trong quản lý dự án phần mềm, Risk (rủi ro) là khả năng xảy ra một
sự kiện không mong muốn có thể ảnh hưởng đến tiến độ, chi phí hoặc chất
lượng của dự án.

Rủi ro thường được đánh giá dựa trên hai yếu tố:

Risk = Probability × Impact

Trong đó:

-   Probability: xác suất rủi ro xảy ra

-   Impact: mức độ ảnh hưởng nếu rủi ro xảy ra

Nếu cả hai yếu tố đều cao thì rủi ro sẽ rất nghiêm trọng.`, slide_url: ''
            },
            {
                order_index: 8, title: `Risk Management trong Spiral Model — 2. Các loại rủi ro trong dự án phần mềm`, content: `━━━ BÀI 2: Risk Management trong Spiral Model ━━━
2. Các loại rủi ro trong dự án phần mềm

Trong quá trình phát triển phần mềm có nhiều loại rủi ro khác nhau.

### Technical Risks

Đây là các rủi ro liên quan đến công nghệ.

Ví dụ:

-   Công nghệ mới chưa được kiểm chứng

-   Hệ thống không đạt yêu cầu về performance

-   Việc tích hợp nhiều hệ thống phức tạp

### Business Risks

Các rủi ro liên quan đến business hoặc khách hàng.

Ví dụ:

-   Yêu cầu của khách hàng thay đổi

-   Ngân sách dự án bị cắt giảm

-   Stakeholder thay đổi quyết định

### People Risks

Các rủi ro liên quan đến con người trong dự án.

Ví dụ:

-   Thành viên quan trọng nghỉ việc

-   Nhóm thiếu kỹ năng cần thiết

-   Xung đột trong nhóm phát triển

### External Risks

Các rủi ro đến từ các yếu tố bên ngoài.

Ví dụ:

-   API của bên thứ ba thay đổi

-   Quy định pháp luật thay đổi

-   Nhà cung cấp dịch vụ gặp sự cố`, slide_url: ''
            },
            {
                order_index: 9, title: `Risk Management trong Spiral Model — 3. Risk Matrix`, content: `━━━ BÀI 2: Risk Management trong Spiral Model ━━━
3. Risk Matrix

Một công cụ phổ biến để đánh giá rủi ro là Risk Matrix.

Risk Matrix dựa trên hai yếu tố:

-   Probability (xác suất)

-   Impact (mức độ ảnh hưởng)

  ---
  Probability / Impact       Low Impact      High Impact
  --- --- ---
  High Probability               Monitor             Mitigate

  Low Probability                Accept              Contingency
  ---

Ý nghĩa:

-   Monitor: theo dõi rủi ro

-   Mitigate: tìm cách giảm thiểu rủi ro

-   Accept: chấp nhận rủi ro

-   Contingency: chuẩn bị kế hoạch dự phòng`, slide_url: ''
            },
            {
                order_index: 10, title: `Risk Management trong Spiral Model — 4. Chiến lược xử lý rủi ro`, content: `━━━ BÀI 2: Risk Management trong Spiral Model ━━━
4. Chiến lược xử lý rủi ro

Trong quản lý rủi ro, có 4 chiến lược phổ biến.

### Avoid (Tránh rủi ro)

Thay đổi kế hoạch để loại bỏ hoàn toàn rủi ro.

Ví dụ:

-   Không sử dụng công nghệ chưa ổn định.

### Mitigate (Giảm thiểu rủi ro)

Giảm xác suất hoặc giảm tác động của rủi ro.

Ví dụ:

-   Tạo prototype trước khi triển khai hệ thống lớn.

### Transfer (Chuyển giao rủi ro)

Chuyển rủi ro cho bên khác.

Ví dụ:

-   Thuê bên thứ ba xử lý một phần hệ thống

-   Mua bảo hiểm cho dự án

### Accept (Chấp nhận rủi ro)

Chấp nhận rủi ro nếu chi phí xử lý quá cao so với thiệt hại.

Ví dụ:

-   Một lỗi nhỏ có thể chấp nhận được trong phiên bản đầu.`, slide_url: ''
            },
            {
                order_index: 11, title: `Risk Management trong Spiral Model — 5. Risk Register`, content: `━━━ BÀI 2: Risk Management trong Spiral Model ━━━
5. Risk Register

Trong các dự án lớn, rủi ro thường được quản lý bằng Risk Register
(sổ theo dõi rủi ro).

Mỗi rủi ro cần được ghi lại các thông tin sau:

-   **Risk ID và mô tả rủi ro\\
**

-   **Probability (1--5)\\
**

-   **Impact (1--5)\\
**

-   **Risk Score = Probability × Impact\\
**

-   **Chiến lược xử lý rủi ro\\
**

-   **Risk Owner (người chịu trách nhiệm)\\
**

-   **Trạng thái rủi ro (Open / Closed / Monitoring)\\
**

Việc sử dụng Risk Register giúp nhóm phát triển theo dõi và quản lý rủi
ro hiệu quả trong suốt vòng đời dự án.

SOFTWARE DESIGN --- THIẾT KẾ PHẦN MỀM`, slide_url: ''
            },
        ]
    },
    {
        title: `Software Design — Thiết kế phần mềm`,
        description: `Nguyên tắc SOLID, kiến trúc hệ thống, UML diagrams và thiết kế cơ sở dữ liệu.`,
        model_type: `design`,
        lessons: [
            {
                order_index: 1, title: `Các nguyên tắc thiết kế phần mềm — 1. Tại sao thiết kế phần mềm quan trọng?`, content: `━━━ BÀI 1: Các nguyên tắc thiết kế phần mềm ━━━
1. Tại sao thiết kế phần mềm quan trọng?

Trong quá trình phát triển phần mềm, thiết kế đóng vai trò quan trọng vì
nó giúp hệ thống có cấu trúc rõ ràng và dễ bảo trì.

Nếu phần mềm được viết mà không có thiết kế rõ ràng, code dễ trở
thành spaghetti code --- các đoạn code rối rắm, khó hiểu và khó sửa
đổi. Điều này dẫn đến:

-   Khó bảo trì hệ thống

-   Khó kiểm thử phần mềm

-   Phát sinh technical debt (nợ kỹ thuật)

Ngược lại, khi hệ thống được thiết kế tốt:

-   Code dễ đọc và dễ hiểu

-   Dễ kiểm thử và sửa lỗi

-   Dễ mở rộng khi cần thêm chức năng mới

Do đó, việc áp dụng các nguyên tắc thiết kế phần mềm là rất quan
trọng.`, slide_url: ''
            },
            {
                order_index: 2, title: `Các nguyên tắc thiết kế phần mềm — 2. SOLID Principles`, content: `━━━ BÀI 1: Các nguyên tắc thiết kế phần mềm ━━━
2. SOLID Principles

SOLID là tập hợp 5 nguyên tắc thiết kế giúp code **dễ bảo trì và dễ
mở rộng** trong lập trình hướng đối tượng.

### S --- Single Responsibility Principle

Mỗi class hoặc module chỉ nên có một trách nhiệm duy nhất và chỉ có
một lý do để thay đổi.

Ví dụ:

-   UserController chỉ xử lý **HTTP request\\
**

-   UserRepository xử lý **truy cập database\\
**

Việc tách trách nhiệm giúp code dễ quản lý và giảm lỗi.

### O --- Open/Closed Principle

Phần mềm nên mở để mở rộng nhưng đóng để sửa đổi.

Điều này có nghĩa là khi cần thêm chức năng mới, ta thêm code mới
thay vì sửa code cũ.

Ví dụ:

-   Thêm loại thanh toán mới bằng cách tạo class mới thay vì sửa class
Payment cũ.

### L --- Liskov Substitution Principle

Các class con (subclass) phải có thể thay thế **class cha
(superclass)** mà không làm thay đổi hành vi của chương trình.

Ví dụ:

Nếu Bird có method fly(), thì subclass của nó cũng phải hoạt động đúng
với method này.

Nguyên tắc này giúp đảm bảo tính kế thừa hợp lý trong OOP.

### I --- Interface Segregation Principle

Không nên tạo một interface quá lớn. Thay vào đó nên chia thành **nhiều
interface nhỏ**.

Điều này giúp client chỉ phụ thuộc vào **những method mà nó thực sự sử
dụng**.

Ví dụ:

Thay vì:

interface Machine {

print()

scan()

fax()

}

Ta có thể tách thành:

Printable

Scannable

Faxable

### D --- Dependency Inversion Principle

Các module cấp cao không nên phụ thuộc vào module cấp thấp. Cả hai nên
phụ thuộc vào abstraction (interface hoặc abstract class).

Nguyên tắc này giúp hệ thống **linh hoạt và dễ thay đổi
implementation**.

Ví dụ:

Service nên phụ thuộc vào UserRepository interface thay vì
MySQLUserRepository.`, slide_url: ''
            },
            {
                order_index: 3, title: `Các nguyên tắc thiết kế phần mềm — 3. Các nguyên tắc thiết kế phổ biến khác`, content: `━━━ BÀI 1: Các nguyên tắc thiết kế phần mềm ━━━
3. Các nguyên tắc thiết kế phổ biến khác

Ngoài SOLID, còn một số nguyên tắc thiết kế quan trọng khác.

### DRY --- Don\\'t Repeat Yourself

Không nên lặp lại cùng một logic nhiều lần trong code.

Mỗi logic chỉ nên tồn tại một nơi trong codebase.

Ví dụ:

Thay vì viết cùng một hàm validate ở nhiều file, ta nên tạo một
utility function.

### KISS --- Keep It Simple, Stupid

Giải pháp đơn giản nhất thường là giải pháp tốt nhất.

Thiết kế phức tạp không cần thiết sẽ làm hệ thống khó bảo trì.

### YAGNI --- You Aren\\'t Gonna Need It

Không nên xây dựng những tính năng chưa cần thiết.

Việc thêm quá nhiều chức năng "có thể dùng trong tương lai" sẽ làm hệ
thống phức tạp.

### Separation of Concerns

Hệ thống nên được chia thành nhiều phần độc lập, mỗi phần xử lý một
nhiệm vụ riêng.

Ví dụ:

-   Frontend xử lý giao diện

-   Backend xử lý business logic

-   Database xử lý lưu trữ dữ liệu`, slide_url: ''
            },
            {
                order_index: 4, title: `Các nguyên tắc thiết kế phần mềm — 4. Các kiến trúc phần mềm phổ biến`, content: `━━━ BÀI 1: Các nguyên tắc thiết kế phần mềm ━━━
4. Các kiến trúc phần mềm phổ biến

### Layered Architecture (3-tier)

Hệ thống được chia thành 3 tầng chính:

-   Presentation Layer → giao diện người dùng

-   Business Logic Layer → xử lý nghiệp vụ

-   Data Access Layer → truy cập dữ liệu

Mô hình này giúp hệ thống dễ bảo trì và dễ mở rộng.

### MVC (Model -- View -- Controller)

MVC là mô hình phổ biến trong phát triển web.

-   Model: dữ liệu và business logic

-   View: giao diện người dùng

-   Controller: xử lý request và kết nối Model với View

Ví dụ:

User → Controller → Model → Database → View.

### Microservices Architecture

Microservices chia hệ thống lớn thành nhiều service nhỏ độc lập.

Mỗi service:

-   Có database riêng

-   Có thể deploy độc lập

-   Giao tiếp với nhau qua API hoặc message queue

Kiến trúc này phù hợp với hệ thống lớn và scalable.`, slide_url: ''
            },
            {
                order_index: 5, title: `UML Diagrams trong thiết kế phần mềm — 1. UML là gì?`, content: `━━━ BÀI 2: UML Diagrams trong thiết kế phần mềm ━━━
1. UML là gì?

UML (Unified Modeling Language) là ngôn ngữ mô hình hóa chuẩn dùng
để mô tả thiết kế của hệ thống phần mềm bằng các sơ đồ trực quan.

UML giúp:

-   Các thành viên trong nhóm **dễ dàng giao tiếp với nhau\\
**

-   Mô tả cấu trúc và hành vi của hệ thống

-   Tài liệu hóa thiết kế phần mềm`, slide_url: ''
            },
            {
                order_index: 6, title: `UML Diagrams trong thiết kế phần mềm — 2. Các loại UML Diagram`, content: `━━━ BÀI 2: UML Diagrams trong thiết kế phần mềm ━━━
2. Các loại UML Diagram

UML được chia thành hai nhóm chính:

### Structural Diagrams (Sơ đồ cấu trúc)

Các sơ đồ này mô tả cấu trúc tĩnh của hệ thống.

#### Class Diagram

Mô tả:

-   Các lớp trong hệ thống

-   Thuộc tính và phương thức của lớp

-   Quan hệ giữa các lớp

Các quan hệ phổ biến:

-   Inheritance (kế thừa)

-   Association (liên kết)

-   Aggregation (tập hợp)

-   Composition (thành phần)

Class Diagram là sơ đồ quan trọng nhất trong thiết kế OOP.

#### Component Diagram

Mô tả các thành phần lớn của hệ thống.

Ví dụ:

-   Frontend

-   Backend

-   Database

-   AI Service

Sơ đồ này giúp hiểu cách các module kết nối với nhau.

#### Deployment Diagram

Mô tả cách hệ thống được triển khai trên hạ tầng (infrastructure).

Ví dụ:

-   Server

-   Container

-   Network

-   Cloud services

### Behavioral Diagrams (Sơ đồ hành vi)

Các sơ đồ này mô tả cách hệ thống hoạt động theo thời gian.

#### Use Case Diagram

Mô tả cách người dùng (actor) tương tác với hệ thống.

Ví dụ:

-   User đăng nhập

-   Admin quản lý khóa học

Sơ đồ này thường được sử dụng trong phân tích yêu cầu.

#### Sequence Diagram

Mô tả thứ tự tương tác giữa các object theo thời gian.

Ví dụ login flow:

User → Frontend → Backend → Database → Backend → Frontend → User.

#### Activity Diagram

Mô tả luồng hoạt động của hệ thống.

Sơ đồ này tương tự flowchart nhưng theo chuẩn UML.

Ví dụ:

-   Luồng xử lý đặt hàng

-   Quy trình thanh toán

#### State Diagram

Mô tả các trạng thái của một object trong hệ thống.

Ví dụ trạng thái đơn hàng:

Pending → Confirmed → Shipped → Delivered.`, slide_url: ''
            },
            {
                order_index: 7, title: `UML Diagrams trong thiết kế phần mềm — 3. Công cụ vẽ UML`, content: `━━━ BÀI 2: UML Diagrams trong thiết kế phần mềm ━━━
3. Công cụ vẽ UML

Một số công cụ phổ biến để vẽ UML:

-   draw.io (diagrams.net) --- miễn phí, online

-   PlantUML --- viết code để tạo diagram

-   Lucidchart --- công cụ chuyên nghiệp

-   StarUML --- phần mềm desktop`, slide_url: ''
            },
            {
                order_index: 8, title: `Database Design --- Thiết kế cơ sở dữ liệu — 1. Quy trình thiết kế database`, content: `━━━ BÀI 3: Database Design --- Thiết kế cơ sở dữ liệu ━━━
1. Quy trình thiết kế database

Thiết kế cơ sở dữ liệu thường gồm 3 bước chính.

### Conceptual Design

Thiết kế ở mức khái niệm bằng ERD (Entity Relationship Diagram).

Bước này xác định:

-   Các entity

-   Thuộc tính

-   Quan hệ giữa các entity

### Logical Design

Chuyển ERD thành mô hình quan hệ (Relational Model).

Các entity sẽ được chuyển thành tables, và các relationship được thể
hiện bằng foreign key.

### Physical Design

Thiết kế cấu trúc database cụ thể trong hệ quản trị CSDL như:

-   MySQL

-   PostgreSQL

-   SQL Server

Ở bước này ta tạo SQL schema và tối ưu hiệu năng.`, slide_url: ''
            },
            {
                order_index: 9, title: `Database Design --- Thiết kế cơ sở dữ liệu — 2. ERD --- Entity Relationship Diagram`, content: `━━━ BÀI 3: Database Design --- Thiết kế cơ sở dữ liệu ━━━
2. ERD --- Entity Relationship Diagram

ERD dùng để mô tả cấu trúc dữ liệu của hệ thống.

Các thành phần chính:

-   Entity: bảng dữ liệu

-   Attribute: cột của bảng

-   Relationship: quan hệ giữa các bảng

-   Cardinality: số lượng quan hệ

### Cardinality

Một số loại quan hệ phổ biến:

1:1

Một người có một CMND.

1:N

Một khách hàng có nhiều đơn hàng.

N:M

Nhiều sinh viên học nhiều môn.

Trong thực tế quan hệ N:M thường được chuyển thành bảng trung gian.`, slide_url: ''
            },
            {
                order_index: 10, title: `Database Design --- Thiết kế cơ sở dữ liệu — 3. Chuẩn hóa dữ liệu (Normalization)`, content: `━━━ BÀI 3: Database Design --- Thiết kế cơ sở dữ liệu ━━━
3. Chuẩn hóa dữ liệu (Normalization)

Chuẩn hóa giúp giảm dư thừa dữ liệu và tránh lỗi dữ liệu.

### 1NF (First Normal Form)

Mỗi ô trong bảng chỉ chứa một giá trị duy nhất.

Không có các cột lặp lại.

### 2NF (Second Normal Form)

Bảng phải đạt 1NF và mọi thuộc tính không phải khóa phải phụ thuộc
toàn bộ vào khóa chính.

### 3NF (Third Normal Form)

Bảng phải đạt 2NF và không có **phụ thuộc bắc cầu (transitive
dependency)**.

Điều này giúp tránh việc dữ liệu bị lặp lại không cần thiết.`, slide_url: ''
            },
            {
                order_index: 11, title: `Database Design --- Thiết kế cơ sở dữ liệu — 4. Ví dụ thiết kế database cho hệ thống học online`, content: `━━━ BÀI 3: Database Design --- Thiết kế cơ sở dữ liệu ━━━
4. Ví dụ thiết kế database cho hệ thống học online

Ví dụ database cho hệ thống iLearn+.

users

id, name, email, password, role, avatar_url, created_at

courses

id, title, description, model_type, created_at

lessons

id, course_id, title, content, slide_url, order_index

user_progress

id, user_id, lesson_id, completed, completed_at

Quan hệ:

-   users 1:N user_progress

-   courses 1:N lessons

-   lessons 1:N user_progress`, slide_url: ''
            },
            {
                order_index: 12, title: `Database Design --- Thiết kế cơ sở dữ liệu — 5. Best Practices trong thiết kế database`, content: `━━━ BÀI 3: Database Design --- Thiết kế cơ sở dữ liệu ━━━
5. Best Practices trong thiết kế database

Một số nguyên tắc quan trọng khi thiết kế database:

-   Luôn có Primary Key cho mỗi bảng

-   Sử dụng Foreign Key để đảm bảo tính toàn vẹn dữ liệu

-   Tạo index cho các cột thường dùng trong truy vấn

-   Không lưu password dạng plain text, phải dùng hash

-   Sử dụng created_at và updated_at để theo dõi dữ liệu

Những nguyên tắc này giúp database **an toàn, dễ quản lý và có hiệu năng
tốt**.

Software Testing --- Kiểm thử phần mềm`, slide_url: ''
            },
        ]
    },
    {
        title: `Software Testing — Kiểm thử phần mềm`,
        description: `Các cấp độ kiểm thử, viết Test Case chuẩn Pass/Fail, TDD và Automation Testing.`,
        model_type: `testing`,
        lessons: [
            {
                order_index: 1, title: `Tổng quan Software Testing`, content: `━━━ Bài 1: Tổng quan Software Testing ━━━

### 1. Testing là gì?

Software Testing là quá trình kiểm tra và đánh giá phần mềm để phát
hiện lỗi (bugs) và đảm bảo hệ thống hoạt động đúng theo yêu cầu đã đặt
ra.

Mục tiêu của kiểm thử:

• Phát hiện lỗi trước khi phần mềm được đưa vào sử dụng\\
• Đảm bảo hệ thống hoạt động đúng chức năng\\
• Nâng cao chất lượng và độ tin cậy của phần mềm

Một nguyên lý nổi tiếng:
"Testing can show the presence of bugs, not their absence."

Điều này nghĩa là testing chỉ chứng minh có lỗi, chứ không thể chứng
minh phần mềm hoàn toàn không có lỗi.

### 2. Các cấp độ kiểm thử

Trong phát triển phần mềm, testing thường được chia thành nhiều cấp độ.

2.1. Unit Testing

Kiểm thử các thành phần nhỏ nhất của chương trình như function, method
hoặc class.

Đặc điểm:

• Chạy nhanh\\
• Không phụ thuộc hệ thống bên ngoài\\
• Thường do developer thực hiện

2.2. Integration Testing

Kiểm thử sự kết hợp giữa các module trong hệ thống.

Ví dụ:

Frontend → Backend → Database

Mục tiêu là đảm bảo các thành phần tương tác chính xác với nhau.

2.3. System Testing

Kiểm thử toàn bộ hệ thống hoàn chỉnh.

Ví dụ trong hệ thống học online:

Register → Login → Xem bài học → Hoàn thành bài học

2.4. User Acceptance Testing (UAT)

Đây là bước kiểm thử do người dùng hoặc khách hàng thực hiện để xác
nhận rằng hệ thống đáp ứng đúng yêu cầu nghiệp vụ.

### 3. Black Box vs White Box Testing

#### 3.1. Black Box Testing

• Kiểm thử dựa trên **yêu cầu hệ thống\\
** • Không cần biết code bên trong\\
• Chỉ quan tâm input và output

#### 3.2. White Box Testing

• Kiểm thử dựa trên **cấu trúc code bên trong\\
** • Thường do developer thực hiện\\
• Bao gồm các chỉ số như:

-   Line Coverage

-   Branch Coverage

-   Path Coverage

### 4. Chi phí sửa lỗi theo giai đoạn

Bug được phát hiện càng muộn thì chi phí sửa càng cao.

  ---
  Giai đoạn                               Chi phí
  --- ---
  Requirements                                1x

  Design                                      5x

  Development                                 10x

  Testing                                     20x

  Production                                  100x
  ---

→ Vì vậy việc phát hiện lỗi sớm là rất quan trọng.`, slide_url: ''
            },
            {
                order_index: 2, title: `Viết Test Case hiệu quả`, content: `━━━ Bài 2: Viết Test Case hiệu quả ━━━

### 1. Test Case là gì?

Test Case là một kịch bản kiểm thử bao gồm các bước cụ thể nhằm xác
định xem một chức năng của hệ thống có hoạt động đúng hay không.

Test case giúp:

• Chuẩn hóa quá trình kiểm thử\\
• Dễ lặp lại khi kiểm thử nhiều lần\\
• Dễ theo dõi lỗi trong hệ thống

### 2. Cấu trúc Test Case

Một test case thường bao gồm các thành phần sau:

Test Case ID: TC-001\\
Test Case Name: Đăng nhập thành công\\
Module: Authentication\\
Priority: High

Preconditions

• Tài khoản đã tồn tại\\
• Server đang hoạt động

Test Steps

1.  Mở trang login

2.  Nhập email

3.  Nhập password

4.  Click nút đăng nhập

Expected Result

• Hệ thống đăng nhập thành công\\
• Chuyển đến trang Home

Status

Pass ✓ / Fail ✗

### 3. Các kỹ thuật thiết kế Test Case

3.1. Equivalence Partitioning

Chia dữ liệu đầu vào thành các nhóm tương đương.

Ví dụ password:

• \\< 6 ký tự → invalid\\
• 6--20 ký tự → valid\\
• \\> 20 ký tự → invalid

3.2. Boundary Value Analysis

Kiểm thử các giá trị biên.

Ví dụ:

password = 5, 6, 20, 21 ký tự

3.3. Decision Table

Kiểm thử các tổ hợp điều kiện.

Ví dụ login:

Email đúng/sai × Password đúng/sai

3.4. Negative Testing

Kiểm thử với input sai hoặc thiếu.

Ví dụ:

• Email rỗng\\
• Password sai\\
• Dữ liệu vượt quá giới hạn

### 4. Test Report

Sau khi kiểm thử cần tạo báo cáo gồm:

• Tổng số test cases\\
• Số test pass\\
• Số test fail\\
• Danh sách bugs

Báo cáo giúp đánh giá mức độ ổn định của phần mềm trước khi phát
hành.`, slide_url: ''
            },
            {
                order_index: 3, title: `TDD và Automation Testing`, content: `━━━ Bài 3: TDD và Automation Testing ━━━

### 1. TDD là gì?

TDD (Test Driven Development) là phương pháp phát triển phần mềm trong
đó viết test trước, viết code sau.

Chu trình TDD gồm ba bước:

RED

Viết test trước → test fail vì chưa có code.

GREEN

Viết code tối thiểu để test pass.

REFACTOR

Cải thiện code nhưng vẫn đảm bảo test không bị fail.

Chu trình này được lặp lại liên tục trong quá trình phát triển.

### 2. Lợi ích của TDD

• Tăng test coverage\\
• Thiết kế hệ thống tốt hơn\\
• Dễ refactor code\\
• Giảm bug trong production

### 3. Automation Testing

Automation Testing là việc **sử dụng chương trình để tự động kiểm thử
phần mềm**.

So với manual testing:

Manual Testing\\
→ Test thủ công\\
→ Chậm và tốn nhiều thời gian

Automation Testing\\
→ Test bằng code\\
→ Chạy nhanh và có thể lặp lại nhiều lần

Automation thường được dùng cho Regression Testing.

### 4. Các công cụ Testing phổ biến

• Jest --- Unit testing cho JavaScript\\
• Selenium --- Web automation testing\\
• Cypress --- End-to-End testing\\
• Postman --- API testing\\
• JMeter --- Performance testing

### 5. Testing trong CI/CD

Trong hệ thống CI/CD, testing thường được chạy tự động:

Push code\\
↓\\
Run Unit Tests\\
↓\\
Run Integration Tests\\
↓\\
Run E2E Tests\\
↓\\
Deploy

Nếu bất kỳ bước nào thất bại → dừng deploy.

So sánh các mô hình phát triển phần mềm`, slide_url: ''
            },
        ]
    },
    {
        title: `So sánh các mô hình phát triển phần mềm`,
        description: `Phân tích toàn diện các mô hình, decision framework và xu hướng DevOps/CI/CD hiện đại.`,
        model_type: `comparison`,
        lessons: [
            {
                order_index: 1, title: `Bảng so sánh tổng quan các mô hình — 1. TẠI SAO CẦN SO SÁNH CÁC MÔ HÌNH?`, content: `━━━ Bài 1: Bảng so sánh tổng quan các mô hình ━━━
1. TẠI SAO CẦN SO SÁNH CÁC MÔ HÌNH?

Trong phát triển phần mềm, có nhiều mô hình quản lý dự án khác nhau.\\
Mỗi mô hình phù hợp với **loại dự án, quy mô team và mức độ rủi ro khác
nhau**.

Việc lựa chọn đúng mô hình giúp:

• Quản lý tiến độ tốt hơn\\
• Giảm rủi ro dự án\\
• Tối ưu chi phí phát triển\\
• Tăng khả năng thành công của sản phẩm

Các mô hình phổ biến gồm:

• **Waterfall Model\\
 • Iterative Incremental Model\\
 • Agile / Scrum\\
 • Spiral Model**`, slide_url: ''
            },
            {
                order_index: 2, title: `Bảng so sánh tổng quan các mô hình — 2. BẢNG SO SÁNH CHI TIẾT`, content: `━━━ Bài 1: Bảng so sánh tổng quan các mô hình ━━━
2. BẢNG SO SÁNH CHI TIẾT

---
  Tiêu chí        Waterfall   Iterative   Agile /     Spiral**
                                                      Scrum**       
  --- --- --- --- ---
  Requirements        Cố định         Có thể thay đổi Linh hoạt     Có thể thay đổi

  Delivery            Cuối dự án      Sau mỗi vòng    Sau mỗi       Cuối mỗi vòng
                                                      Sprint        

  Customer            Ít              Trung bình      Nhiều         Vừa phải
  Involvement                                                       

  Team Size           Lớn             Vừa             Nhỏ (3--9)    Lớn

  Documentation       Nhiều           Vừa phải        Ít            Nhiều

  Flexibility         Thấp            Trung bình      Cao           Trung bình

  Risk Management     Kém             Trung bình      Tốt           Rất tốt

  Cost Estimation     Dễ              Trung bình      Khó           Khó

  Time to Market      Chậm            Nhanh hơn       Nhanh nhất    Chậm

  Suitable For        YC rõ           YC chưa rõ      Startup       Hệ thống phức
                                                                    tạp
  ---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, slide_url: ''
            },
            {
                order_index: 3, title: `Bảng so sánh tổng quan các mô hình — 3. PHÂN TÍCH NHANH TỪ BẢNG SO SÁNH`, content: `━━━ Bài 1: Bảng so sánh tổng quan các mô hình ━━━
3. PHÂN TÍCH NHANH TỪ BẢNG SO SÁNH

Waterfall

• Phù hợp dự án có yêu cầu rõ ràng\\
• Quy trình tuyến tính, dễ quản lý\\
• Khó thay đổi khi dự án đang chạy

Iterative Incremental

• Phát triển theo từng vòng lặp\\
• Có thể cải tiến sau mỗi iteration\\
• Phù hợp dự án chưa rõ hoàn toàn requirements

Agile / Scrum

• Phát triển theo sprint ngắn (1--4 tuần)\\
• Liên tục nhận feedback từ khách hàng\\
• Phù hợp startup hoặc sản phẩm thay đổi nhanh

Spiral

• Tập trung vào **quản lý rủi ro\\
** • Phù hợp dự án lớn, phức tạp\\
• Chi phí và quản lý khá phức tạp`, slide_url: ''
            },
            {
                order_index: 4, title: `Bảng so sánh tổng quan các mô hình — 4. CÁCH CHỌN MÔ HÌNH`, content: `━━━ Bài 1: Bảng so sánh tổng quan các mô hình ━━━
4. CÁCH CHỌN MÔ HÌNH

Một số câu hỏi giúp chọn mô hình phù hợp:

Câu hỏi 1: Requirements đã rõ ràng chưa?

→ Rõ ràng → Waterfall\\
→ Chưa rõ → Iterative hoặc Agile

Câu hỏi 2: Có cần demo sản phẩm sớm không?

→ Có → Iterative / Agile\\
→ Không → Waterfall

Câu hỏi 3: Team có kinh nghiệm Agile không?

→ Có → Agile / Scrum\\
→ Không → Iterative Incremental

Câu hỏi 4: Dự án có rủi ro kỹ thuật cao không?

→ Có → Spiral\\
→ Không → Waterfall hoặc Iterative

Câu hỏi 5: Quy mô dự án?

Nhỏ (\\< 3 tháng)\\
→ Agile hoặc Waterfall

Trung bình (3--6 tháng)\\
→ Iterative Incremental

Lớn (\\> 1 năm)\\
→ Spiral`, slide_url: ''
            },
            {
                order_index: 5, title: `Bảng so sánh tổng quan các mô hình — 5. THỰC TẾ: HYBRID APPROACH`, content: `━━━ Bài 1: Bảng so sánh tổng quan các mô hình ━━━
5. THỰC TẾ: HYBRID APPROACH

Trong thực tế, nhiều công ty không dùng một mô hình duy nhất.

Họ thường kết hợp:

• Waterfall cho planning và architecture\\
• Agile cho development iterations\\
• Spiral principles cho risk management

Cách tiếp cận này gọi là Hybrid Development Model.`, slide_url: ''
            },
            {
                order_index: 6, title: `Case Study --- Chọn mô hình cho từng loại dự án — CASE STUDY 1: HỆ THỐNG NGÂN HÀNG`, content: `━━━ Bài 2: Case Study --- Chọn mô hình cho từng loại dự án ━━━
CASE STUDY 1: HỆ THỐNG NGÂN HÀNG

Dự án: Core Banking System

Đặc điểm:

• Budget: 50 tỷ đồng\\
• Timeline: 2 năm\\
• Requirements: rõ ràng do pháp luật quy định\\
• Risk: cực cao (liên quan tiền khách hàng)\\
• Team: \\~50 người

→ Mô hình phù hợp: Spiral Model

Lý do:

• Spiral quản lý rủi ro tốt\\
• Có prototype để kiểm chứng trước\\
• Phù hợp dự án lớn và critical`, slide_url: ''
            },
            {
                order_index: 7, title: `Case Study --- Chọn mô hình cho từng loại dự án — CASE STUDY 2: STARTUP APP`, content: `━━━ Bài 2: Case Study --- Chọn mô hình cho từng loại dự án ━━━
CASE STUDY 2: STARTUP APP

Dự án: App giao đồ ăn

Đặc điểm:

• Budget: hạn chế\\
• Timeline: ra market trong 3 tháng\\
• Requirements: thay đổi liên tục\\
• Team: 4 người

→ Mô hình phù hợp: Agile / Scrum

Cách triển khai:

• Sprint 2 tuần\\
• MVP sau 1--2 sprint\\
• Phát triển dựa trên feedback người dùng`, slide_url: ''
            },
            {
                order_index: 8, title: `Case Study --- Chọn mô hình cho từng loại dự án — CASE STUDY 3: PHẦN MỀM NỘI BỘ`, content: `━━━ Bài 2: Case Study --- Chọn mô hình cho từng loại dự án ━━━
CASE STUDY 3: PHẦN MỀM NỘI BỘ

Dự án: Hệ thống quản lý nhân sự

Đặc điểm:

• Budget: trung bình\\
• Timeline: 6 tháng\\
• Requirements: khá rõ ràng\\
• Risk: thấp\\
• Team: 5 người

→ Mô hình phù hợp: Waterfall

Lý do:

• Requirements rõ ràng\\
• Ít thay đổi\\
• Dễ estimate thời gian và chi phí`, slide_url: ''
            },
            {
                order_index: 9, title: `Case Study --- Chọn mô hình cho từng loại dự án — CASE STUDY 4: DỰ ÁN MÔN HỌC (iLearn+)`, content: `━━━ Bài 2: Case Study --- Chọn mô hình cho từng loại dự án ━━━
CASE STUDY 4: DỰ ÁN MÔN HỌC (iLearn+)

Dự án: iLearn+ --- Learning Management System

Đặc điểm:

• Timeline: 2 tháng\\
• Team: 3--5 sinh viên\\
• Requirements chưa rõ hoàn toàn\\
• Cần demo thường xuyên

→ Mô hình phù hợp: Iterative Incremental

Ví dụ các iteration:

Iteration 1\\
→ Authentication + Deploy

Iteration 2\\
→ Courses + Lessons

Iteration 3\\
→ AI + Progress Tracking

Iteration 4\\
→ Admin Panel + UI Improvement

TẠI SAO KHÔNG DÙNG WATERFALL?

• Requirements chưa rõ hoàn toàn\\
• Cần demo thường xuyên

TẠI SAO KHÔNG DÙNG FULL SCRUM?

• Team nhỏ\\
• Không cần quá nhiều ceremonies\\
• Iterative Incremental đơn giản hơn`, slide_url: ''
            },
            {
                order_index: 10, title: `Xu hướng hiện đại --- DevOps và CI/CD — 1. DEVOPS LÀ GÌ?`, content: `━━━ Bài 3: Xu hướng hiện đại --- DevOps và CI/CD ━━━
1. DEVOPS LÀ GÌ?

DevOps = Development + Operations

DevOps là triết lý phát triển phần mềm nhằm **kết hợp team development
và team vận hành**.

Trước đây:

Dev → viết code\\
Ops → vận hành hệ thống

Hai team thường làm việc tách biệt.

DevOps giúp:

• tăng tốc deploy\\
• giảm lỗi khi release\\
• cải thiện collaboration giữa teams`, slide_url: ''
            },
            {
                order_index: 11, title: `Xu hướng hiện đại --- DevOps và CI/CD — 2. CI/CD PIPELINE`, content: `━━━ Bài 3: Xu hướng hiện đại --- DevOps và CI/CD ━━━
2. CI/CD PIPELINE

CI --- Continuous Integration

• Developer push code thường xuyên\\
• Automated build và test chạy ngay\\
• Phát hiện bug sớm

CD --- Continuous Delivery

• Code luôn ở trạng thái có thể deploy\\
• Deploy tự động lên staging

CD --- Continuous Deployment

• Sau khi test pass → deploy production tự động

VÍ DỤ CI/CD PIPELINE

Ví dụ pipeline đơn giản:

Push code

↓

Run unit tests

↓

Run integration tests

↓

Build application

↓

Deploy to staging

↓

Deploy to production

Nếu bất kỳ bước nào fail → pipeline dừng lại.

CONTAINERIZATION --- DOCKER

Docker giúp giải quyết vấn đề:
Works on my machine

Docker:

• đóng gói application + dependencies\\
• chạy giống nhau trên mọi môi trường\\
• dễ deploy lên cloud

Môi trường:

Dev → Staging → Production

đều có thể dùng cùng container.

KHẢ NĂNG PHỤC HỒI HỆ THỐNG

Hệ thống hiện đại cần khả năng fault tolerance.

Một số cơ chế phổ biến:

Rollback

→ Khi deploy lỗi → quay lại version trước.

Backup & Recovery

→ Backup database định kỳ\\
→ Khôi phục khi có sự cố.

Monitoring

→ Theo dõi logs và metrics\\
→ Cảnh báo khi hệ thống gặp vấn đề.`, slide_url: ''
            },
        ]
    },
];

async function clearCourses() {
    log.info('Xóa courses và lessons cũ...');
    await pool.query('DELETE FROM user_progress');
    await pool.query('DELETE FROM lessons');
    await pool.query('DELETE FROM courses');
    log.success('Đã xóa dữ liệu cũ');
}

async function seedCourses() {
    log.title('SEED 9 COURSES — 100 LESSONS');
    const results = [];
    for (const c of COURSES) {
        const courseResult = await pool.query(
            `INSERT INTO courses (title, description, model_type) VALUES ($1, $2, $3) RETURNING id, title`,
            [c.title, c.description, c.model_type]
        );
        const course = courseResult.rows[0];
        log.success(`[${course.id}] ${course.title} (${c.lessons.length} lessons)`);
        for (const l of c.lessons) {
            await pool.query(
                `INSERT INTO lessons (course_id, title, content, slide_url, order_index) VALUES ($1, $2, $3, $4, $5)`,
                [course.id, l.title, l.content, l.slide_url, l.order_index]
            );
            log.info(`     ${l.order_index.toString().padStart(2, '0')}. ${l.title.substring(0, 60)}`);
        }
        results.push({ id: course.id, title: course.title, count: c.lessons.length });
    }
    return results;
}

async function printSummary(courses) {
    log.title('SEED HOÀN THÀNH');
    const total = courses.reduce((s, c) => s + c.count, 0);
    console.log(`\n📦 ${courses.length} courses | ${total} lessons\n`);
    console.log('┌────┬──────────────────────────────────────────────────────┬─────────┐');
    console.log('│ ID │ Course                                               │ Lessons │');
    console.log('├────┼──────────────────────────────────────────────────────┼─────────┤');
    for (const c of courses) {
        const title = c.title.substring(0, 52).padEnd(52);
        console.log(`│ ${String(c.id).padEnd(2)} │ ${title} │    ${String(c.count).padEnd(4)} │`);
    }
    console.log('└────┴──────────────────────────────────────────────────────┴─────────┘');
    console.log('\n✅ Tất cả nội dung từ file CNPM.docx đã được seed!\n');
}

async function seed() {
    try {
        log.title('iLearn+ — SEED TỪ TÀI LIỆU CNPM.DOCX');
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