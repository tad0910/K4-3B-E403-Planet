# BÀI HỌC SUY NGẪM CÁ NHÂN (REFLECTION LOG)

- **Họ và tên:** Đinh Kim Thái
- **Mã học viên:** 2A202602417
- **Lớp:** 3B · **Phòng:** E403 · **Cụm:** 4 · **Track:** B2 (Trợ lý Discord - Cảnh báo Ticket bị Miss)
- **Vai trò trong nhóm:** Thành viên — Phụ trách Khai phá dữ liệu (Mining Data), Bằng chứng thực nghiệm (Evidence) & Thực thi Kiểm thử (Testing)

---

## 1. Phần việc cụ thể em đã trực tiếp đảm nhiệm trong dự án

Với vai trò phụ trách dữ liệu và kiểm thử kỹ thuật của nhóm, em tập trung vào việc tìm ra bằng chứng đau thật từ dữ liệu gốc và thực thi quy trình kiểm thử thực nghiệm:

- **Khai phá dữ liệu thật từ `data/discord-pack/` để chứng minh bài toán ([spec.md](spec.md) §1.5):**
  - Trực tiếp khảo sát toàn bộ **1.092 tin nhắn** (779 tin học viên, 313 tin bot) tại `k4_messages.csv` và 4 bản tin tự động tại `k4_daily_reports.md`.
  - Xây dựng phương pháp đếm kiểm chứng được (Reproducible Method): Sử dụng regex `r"(ticket|lỗi|hỏi|sao.*không|chưa.*được|\?)"` trên các tin nhắn của học viên để bóc tách chính xác **120 tin nhắn dạng thắc mắc/cần trợ giúp**.
  - Đo lường độ trễ phản hồi qua timestamp và `reply_to_msg_id`: Tìm ra con số định lượng đắt giá: **43 / 120 câu hỏi (chiếm 35.8%)** bị trôi dạt quá 2 giờ không có TA xử lý (trong đó 18 câu bị bỏ quên qua đêm > 8 tiếng).
  - Phân tích cơ cấu câu hỏi bị trôi: **62% là lỗi kỹ thuật chặn làm lab** (CVAT 500 OPA, tài khoản Phoenix, thiếu quyền Learner) và **38% là vướng mắc thủ tục/ghép đội/thẻ học viên**.
  - Khai thác lỗ hổng của bot cũ: Chỉ ra 100% bản tin bot hiện tại thiếu direct link dẫn về tin nhắn gốc; 50% bản tin dính lỗi nặng (bản tin 14/09 dính chuỗi rác *"nguồn tham chiếu..."* lặp lại 9 lần; bản tin 13/09 bị cắt cụt câu).
  - Trích xuất **10 trích dẫn nguyên văn kèm mã xác thực** (`M07901`, `M57545`, `M53930`, `M49710`, `M75130`, `M45903`, `M88368`, `M74716`, `M78683`, `M08310`), tạo nền tảng bằng chứng thuyết phục nhất cho Problem Statement của nhóm.

- **Cung cấp nguồn dữ liệu thô (Data Sourcing) & Thực thi Kiểm thử ([eval/](eval/)):**
  - Trích lọc từ kho 1.092 tin nhắn thật các đoạn hội thoại tiêu biểu (lỗi CVAT, bẫy injection, hỏi thủ tục...) để bàn giao nguồn dữ liệu thực tế cho bạn Tiến chuẩn hóa vào bộ test `golden_set.json` (giúp 20/24 case có nguồn gốc thực tế).
  - Trực tiếp chạy script kiểm thử `eval/run_eval.py` trên môi trường thực thi, theo dõi quá trình chạy benchmark của mô hình `gpt-4o-mini` qua từng đợt (từ baseline v1 đạt 50% đến v8 đạt 95.83%).
  - Kiểm thử 8 kịch bản hiểm (§5): Cùng nhóm rà soát các case góc cạnh (edge cases) như Prompt Injection bẫy sửa điểm (`B2-019`), deadline không có văn bản chính thức (`B2-017`) hay thread học viên đã giải quyết xong (`B2-024`).

---

## 2. AI đã hỗ trợ em như thế nào trong quá trình làm việc?

Trong suốt 39 giờ hackathon, em sử dụng AI như một trợ lý xử lý dữ liệu và tự động hóa kiểm thử:
- **Tăng tốc xử lý dữ liệu lớn:** AI hỗ trợ em viết nhanh các script regex, xử lý và phân tách các chuỗi thời gian (timestamp) trong file CSV hơn 1.000 dòng, tính toán chênh lệch giờ giữa câu hỏi và phản hồi chỉ trong vài giây thay vì phải rà soát thủ công.
- **Hỗ trợ sinh kịch bản kiểm thử biên (Edge-case Generator):** Dựa trên các ca lỗi CVAT thực tế em trích xuất, AI gợi ý thêm các biến thể câu hỏi (ví dụ: học viên hỏi cộc lốc, học viên chèn prompt injection đòi xem system prompt) để đưa vào danh mục kịch bản kiểm thử.
- **Nhận thức về giới hạn của AI trong xử lý dữ liệu:**
  - AI rất giỏi thống kê từ khóa nhưng hoàn toàn mù mờ về ngữ cảnh thực địa: AI không thể tự hiểu được một câu hỏi lúc 23:00 đêm muộn mang tính chất cấp bách hơn ban ngày nếu con người không chỉ định biến thời gian chờ.
  - Ngôn ngữ học viên rất tự nhiên, nhiều tiếng lóng và lỗi chính tả; nếu không có con người trực tiếp rà soát và kiểm chứng tính xác thực của dữ liệu (Ground Truth Verification), mọi phân tích của AI sẽ rất dễ rơi vào bẫy ảo giác và ngộ nhận số liệu.

---

## 3. Bài học sâu sắc nhất từ một case fail của chính nhóm

- **Tình huống lỗi điển hình:** Trong quá trình chạy thử nghiệm ban đầu, nhóm gặp lỗi với tình huống ca **`B2-024`** (thread câu hỏi học viên gặp lỗi nhưng bạn bè đã vào hướng dẫn xong và học viên đã nhắn *"cảm ơn mình sửa được rồi"*). Khi chạy mô hình phân loại ban đầu, do tin nhắn có chứa từ khóa lỗi kỹ thuật và thời gian tạo đã lâu, hệ thống vẫn tự động kích hoạt cờ đỏ `🚨 MISS GẤP (>2h)`.
- **Hậu quả nếu đưa vào vận hành thật:** Gây ra hiện tượng **"mệt mỏi vì cảnh báo" (Alert Fatigue)**. TA mở bảng điều khiển thấy tràn ngập cảnh báo đỏ, nhưng bấm vào thì toàn là các thread học viên đã tự xử lý xong. Cảnh báo giả (False Alarm) làm mất hoàn toàn niềm tin của TA vào công cụ, dẫn đến nguy cơ khi có ca nguy cấp thật thì TA lại chủ quan bỏ qua.
- **Cách khắc phục:** Từ góc độ dữ liệu và kiểm thử, em đã phối hợp cùng nhóm đưa ca `B2-024` thành một ca kiểm thử bắt buộc trong Golden Set; đồng thời bổ sung điều kiện lọc logic: chỉ những thread nào chưa có phản hồi hoặc chưa xuất hiện dấu hiệu giải quyết xong mới được tính vào luồng xét duyệt thời gian chờ `> 120 phút`.
- **Bài học rút ra (Takeaway):**  
  > *"Trong một hệ thống AI cảnh báo, việc loại bỏ cảnh báo giả (False Positives) cũng sống còn như việc không bỏ sót sự cố (False Negatives). Một bộ dữ liệu kiểm thử tốt phải chứa cả những tình huống nhiễu của đời thực để buộc hệ thống học được cách im lặng đúng lúc, thay vì báo động bừa bãi gây phiền toái cho con người."*
