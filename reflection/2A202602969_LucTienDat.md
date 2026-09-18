# BÀI HỌC SUY NGẪM CÁ NHÂN (REFLECTION LOG)

- **Họ và tên:** Lục Tiến Đạt
- **Mã học viên:** 2A202602969
- **Lớp:** 3B · **Phòng:** E403 · **Cụm:** 4 · **Track:** B2 (Trợ lý Discord - Cảnh báo Ticket bị Miss)
- **Vai trò trong nhóm:** Đội trưởng (Team Leader) — Phụ trách Quản lý tiến độ, AI Spec, System Prompt Engineering & Codebase

---

## 1. Phần việc cụ thể em đã trực tiếp đảm nhiệm trong dự án
Với vai trò Đội trưởng, em chịu trách nhiệm điều phối tiến độ chung của nhóm và trực tiếp phụ trách các phần việc kỹ thuật cốt lõi:
- **Chủ trì quản lý tiến độ & hoàn thiện tài liệu [spec.md](file:///d:/AIVin/K4-3B-E403-Planet/spec.md):** 
  - Khảo sát bài toán, xác lập lát cắt 1 câu chuẩn JTBD và lựa chọn mức tự động hóa `conditional` dựa trên phân tích chi phí sai lầm (cost-of-error).
  - Điều phối và tổng hợp đóng góp của các thành viên (kết hợp bằng chứng mining của bạn Thái và luồng UX của bạn Tâm), đồng thời đóng băng tiêu chuẩn chất lượng Quality Bar (≥ 85% pass rate, 0% vi phạm điều kiện cứng) tại mốc CP4.
- **Phát triển Backend API & Tích hợp AI thật ([codebase/api.py](file:///d:/AIVin/K4-3B-E403-Planet/codebase/api.py)):**
  - Xây dựng server FastAPI cung cấp endpoint `/api/tickets` (lấy dữ liệu từ tập thực nghiệm) và `/api/classify` (gọi trực tiếp mô hình `openai/gpt-4o-mini` qua OpenRouter).
- **Thiết kế & Tinh chỉnh System Prompt ([codebase/prompts/system_prompt.md](file:///d:/AIVin/K4-3B-E403-Planet/codebase/prompts/system_prompt.md)):**
  - Trực tiếp thực hiện vòng lặp Prompt Engineering (từ baseline v1 đạt 50% đến bản chuẩn hóa Tiếng Anh v8 đạt 95.83% - 100%).
  - Thiết kế các trigger luật cứng chống Prompt Injection (`SYSTEM_OVERRIDE`), nhận diện ticket quá hạn > 2h (`MISS_GAP`), và phân định ranh giới thẩm quyền Admin.
- **Nâng cấp Frontend Dashboard ([codebase/frontend/](file:///d:/AIVin/K4-3B-E403-Planet/codebase/frontend/)):**
  - Kết nối giao diện React với AI thật, hiển thị huy hiệu viễn trắc đo độ trễ (latency telemetry), bổ sung modal "Thử nghiệm Thẻ Giám khảo" phục vụ demo live tại chỗ.

---

## 2. AI đã hỗ trợ em như thế nào trong quá trình làm việc?
Trong suốt 39 giờ hackathon, em sử dụng AI như một người cộng sự (Pair-programmer & Sparring Partner):
- **Phân tích lỗi (Failure Analysis) siêu tốc:** Khi chạy benchmark 24 ca của `golden_set.json`, script tự động xuất ra log JSON/Markdown. Em dùng AI để tổng hợp các điểm tương đồng giữa các ca thất bại (ví dụ: phát hiện toàn bộ các ca giấy tờ và hồ sơ năng lực đều bị trả về `requires_admin: false`), giúp em định vị đúng nguyên nhân gốc chỉ trong vài phút thay vì đọc log thủ công.
- **Sinh khung mã nguồn & Tiêu chuẩn hóa Prompt:** AI hỗ trợ em viết boilerplate code FastAPI, cấu hình proxy Vite và dịch chuyển ngữ hệ thống Prompt sang chuẩn English-first chuyên nghiệp với cấu trúc Markdown mạch lạc.
- **Nhận thức về giới hạn của AI (Giám sát con người):** 
  - Em nhận thấy AI ban đầu rất dễ bị "thiên kiến ví dụ" (few-shot bias) — do một ví dụ trong schema để `requires_admin: false`, mô hình đã mặc định bắt chước gán `false` cho tất cả các ca sau. 
  - AI không thể tự quyết định ranh giới đạo đức hay thẩm quyền nếu con người không đặt ra các quy tắc chặn (Guardrails) tường minh. Sự can thiệp của con người là yếu tố then chốt để sản phẩm đạt độ tin cậy.

---

## 3. Bài học sâu sắc nhất từ một case fail của chính nhóm
- **Tình huống lỗi điển hình:** Ở Lượt chạy 1 (Baseline v1), mô hình chỉ đạt **50.0% (12/24 ca fail)**. Đáng chú ý nhất là ca **`B2-007`** (Học viên lo lắng về hồ sơ năng lực trên Phoenix và hỏi có bị xem xét kết thúc đào tạo sớm không) và ca **`B2-009`** (Học viên hỏi thủ tục gửi email xin vào trễ lecture 30 phút). Model đã xếp các ca này là việc TA có thể tự trả lời và gán `requires_admin: false`.
- **Hậu quả nếu đưa vào vận hành thật:** TA chỉ là người trợ giảng kỹ thuật, không có thẩm quyền đưa ra phát ngôn về việc học viên có bị đình chỉ đào tạo hay không, cũng không có quyền duyệt phép vắng học. Nếu AI không cảnh báo chuyển tiếp lên Ban tổ chức/Admin, TA có thể trả lời sai thẩm quyền, gây hoang mang và tranh chấp nghiêm trọng với học viên.
- **Cách khắc phục:** Em đã thiết lập một mục riêng biệt trong System Prompt: `Authority Boundaries (requires_admin)` với bộ 7 trigger cụ thể, buộc mô hình phải trả về `requires_admin: true` bất cứ khi nào phát hiện từ khóa về điểm số, giấy tờ, thẻ học viên, hồ sơ Phoenix hay xin vào trễ. Kết quả là ở lượt v8, toàn bộ 5/5 ca thuộc lớp chỗ khó `out_of_scope_authority` đều đạt độ chính xác 100%.
- **Bài học rút ra (Takeaway):**  
  > *"Trong một sản phẩm AI ứng dụng, việc dạy cho AI biết khi nào nó KHÔNG ĐƯỢC PHÉP tự quyết định và phải chuyển quyền lên con người (Escalation) quan trọng không kém việc nó trả lời đúng. Một hệ thống AI an toàn là hệ thống biết rõ giới hạn thẩm quyền của chính mình."*
