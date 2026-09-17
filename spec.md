# AI SPEC — Smart Digest & Missed Ticket Alert cho TA Discord · Nhóm K4-3B-E403-Planet · Zone E403
Hướng: [ ] A — VLearn  [x] B — Trợ lý Học viên  [ ] C — Làn mở  [ ] D — Học tập thích ứng  [ ] E — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới cho TA/Học viên (Track B2)

## §1. User & Job (Khám phá theo 5 câu hỏi cốt lõi — Guide §1.1)

1. **Ai là người trực tiếp làm việc này (Job Executor cụ thể)?**
   - **TA (Teaching Assistant) / Lab Coach trực kênh Discord** chịu trách nhiệm gỡ kẹt bài lab và giải đáp thắc mắc cho học viên trong suốt ngày học (không phải học viên hay người dùng nói chung).

2. **Họ đang cố hoàn thành việc gì (Core JTBD — verb + object + bối cảnh, KHÔNG chữ AI)?**
   - *Phát hiện và giải quyết kịp thời toàn bộ vướng mắc kỹ thuật bài lab cũng như các thủ tục hỗ trợ bên lề (hướng dẫn xin nghỉ học, quy định điểm danh, sự cố nộp bài) của học viên trong ngày học để không ai bị kẹt bài quá lâu hoặc bỏ lỡ thông tin vận hành quan trọng.*
   - *(Tự kiểm: Bỏ AI đi, nhiệm vụ trực giải đáp kỹ thuật lẫn thủ tục hành chính này vẫn tồn tại 100% trong khóa học).*

3. **Hôm nay họ đang giải quyết bằng gì? Nó fail ở đâu và vì sao họ chưa bỏ nó?**
   - **Đang giải quyết bằng:** (1) Lướt thủ công danh sách kênh ticket và kênh chat trên Discord; (2) Chờ học viên inbox riêng hoặc tag tên @TA; (3) Đọc bản tin tóm tắt tự động của bot hiện có.
   - **Nó fail ở đâu:** Lượng ticket và tin nhắn quá tải khiến ticket mở từ chiều bị chìm xuống dưới, trôi mất 1-2 ngày mà TA không hay biết; bản tin bot hiện tại thì dính rác từ, tóm tắt chung chung và KHÔNG có direct link để bấm vào xử lý ngay.
   - **Vì sao chưa bỏ:** Vì Discord và hệ thống Ticket là kênh liên lạc & hỗ trợ chính thức duy nhất của khóa học, học viên và TA bắt buộc phải làm việc qua đây.

4. **Problem statement (KHÔNG chữ AI):**
   - TA bị quá tải vì hàng chục Ticket và tin nhắn gửi tràn lan cùng lúc trên Discord (từ lỗi code kỹ thuật đến thủ tục xin nghỉ học, điểm danh, nhập học) không được phân loại độ khẩn cấp, dẫn đến việc nhiều Ticket và câu hỏi bị chìm và bỏ sót quá 2–4 tiếng (thậm chí 1–2 ngày) mà không có người xử lý.

5. **Bằng chứng đau thật (Evidence chuẩn A + B):**
   - **Quote phỏng vấn nguyên văn (Đường A — Phỏng vấn thực địa tại phòng E403):**
     - Học viên Trần Ngọc Khánh (E403): *"Gặp vấn đề về các thông tin khi nhập học trong thời gian đầu nhập học nhưng câu hỏi không được trả lời bởi TA, sau đó lại mất thời gian đi hỏi lại bạn bè."*
     - Học viên Lê Quang Ngọc (E403): *"Cũng gặp vấn đề về việc đưa ra câu hỏi trên discord nhưng bị miss / chưa được trả lời, sau đó cần đi hỏi lại chị TA/mentor."*
     - Lab Coach 1: *"Lần gần nhất câu hỏi học viên chưa được trả lời là 1-2 ngày, đã từng trôi tin của học viên, hậu quả là câu hỏi đó vẫn chưa được giải quyết => bản tin bot tự động mỗi ngày sẽ dùng được để hỗ trợ học viên."*
     - Lab Coach 2: *"Lần gần nhất câu hỏi học viên chưa được trả lời là 1-2 tiếng, đã từng bị trôi mất tin của học viên, hậu quả tương tự (problem của học viên chưa được giải quyết), công nhận tính năng tóm tắt bảng tin AI trên discord là dùng được để hỗ trợ học viên."*
   - **Bằng chứng phân tích dữ liệu (Đường B — Dữ liệu nội bộ khóa học):**
     - Phân tích mẫu log thảo luận khóa học qua các mã tin nhắn ẩn danh (`M78683`, `M24366`, `M04103`, `M66718`): Học viên liên tục hỏi về cách mở ticket hoặc được nhắc nhở tạo ticket khi câu hỏi trên kênh chung bị trôi, cho thấy lượng ticket hỗ trợ phát sinh rất lớn nhưng chưa có phân loại ưu tiên.
     - Phân tích các bản tin bot tự sinh hiện tại của khóa: 100% bản tin bị lỗi chèn chuỗi rác ("nguồn tham chiếu"), câu chữ tóm tắt bị cắt cụt và các thông báo hỗ trợ đều thiếu direct link dẫn tới tin nhắn/ticket gốc.

## §2. Impact & quyết định chọn
- **Bảng impact 3 ứng viên:**
  1. *Bot tự động trả lời bài lab (Auto QA):* 1.000 HV × 2 lần/tuần × 30 phút. Khả thi: Thấp (Dễ bịa thông tin deadline/code gây rủi ro lớn).
  2. *Tóm tắt nội dung thảo luận chung:* 1.000 HV × 1 lần/ngày × 10 phút. Khả thi: Trung bình (Ít ảnh hưởng trực tiếp tới kết quả nộp bài).
  3. *Smart Digest & Cảnh báo Ticket bị Miss cho TA:* 30 TA × 1 lần/ngày × 40 phút tốn vô ích. Khả thi: Rất cao (Cứu 100% ticket bị trôi, giảm 80% thời gian rà soát cho TA).
- **Ứng viên ĐÃ LOẠI:** Auto QA tự động (vì cost-of-error quá đắt nếu bot phét deadline/kiến thức).
- **Ứng viên CHỌN:** Smart Digest & Cảnh báo Ticket bị Miss (vì tiết kiệm 30 phút/ngày cho mỗi TA và giải quyết dứt điểm nỗi đau trôi bài của học viên).

## §3. Giải pháp tương tự đã nghiên cứu
- **Discord Bot mặc định hiện tại:** Đã có tính năng tự đăng bản tin ngày, nhưng rác chữ, không phân loại ưu tiên và KHÔNG có direct link.
- **ZenDesk / Ticket System truyền thống:** Phân loại ticket tốt nhưng không tích hợp mượt với môi trường chat Discord và không tự động gom nhóm bài học bị stuck.

## §4. Thiết kế
- **Lát cắt MỘT CÂU:** *Một TA · bất kỳ thời điểm nào mở Discord trực · AI quét danh sách toàn bộ Ticket đang mở, tự động phân loại mức độ ưu tiên (Gấp/Trung bình/Thấp FAQ) và cảnh báo các Ticket bị bỏ sót quá 2 giờ kèm direct link · TA click thẳng vào Ticket cần cứu gấp và xử lý xong 100% trong 5 phút.*
- **Non-goals:**
  1. KHÔNG quét hay can thiệp vào các kênh chat chung/thảo luận linh tinh ngoài Ticket.
  2. KHÔNG tự động trả lời thay cho TA đối với các sự cố kỹ thuật/logistics phức tạp.
  3. KHÔNG tự động xoá hay đóng (close) ticket khi chưa có xác nhận của học viên/TA.
- **Mức prototype nhắm tới:** [ ] Sketch [x] Mock [ ] Working — phần nào mock, phần nào thật: AI Pipeline phân loại Ticket thật (Python/LLM), Giao diện Discord Bot UI Mock.

### Sơ đồ luồng hoạt động (User Flow tập trung Scope Ticket Alert):

```mermaid
graph TD
    A["🎫 Danh sách các Ticket hỗ trợ đang mở (ticket-xxxx)"] --> B["🤖 AI Bot quét toàn bộ Ticket định kỳ liên tục (mỗi 30p)"]
    B --> C{"🔍 AI Phân loại Loại Ticket & Độ khẩn cấp"}
    
    C -- "Hỏi thông tin cơ bản / FAQ (Slide, Deadline, Zoom)" --> D["ℹ️ AI rep mẫu link FAQ & Gắn nhãn [Ưu tiên Thấp]"]
    C -- "Lỗi kỹ thuật / Sự cố bài Lab / Lỗi nộp bài" --> E{"Thời gian chờ của Ticket?"}
    
    E -- "Mới mở < 1 giờ" --> F["🟡 Gắn nhãn [Ưu tiên Trung Bình]"]
    E -- "Chờ > 2 giờ chưa có TA vào" --> G["🚨 CẢNH BÁO TICKET BỊ MISS (Ưu tiên Gấp)"]
    
    D --> H["📊 Tổng hợp thành Bảng Cảnh Báo gửi về #ta-ticket-control"]
    F --> H
    G --> H
    
    H --> I["👤 TA mở kênh #ta-ticket-control, thấy ngay danh sách Ticket bị MISS đẩy lên ĐẦU"]
    I --> J["🔗 TA click Direct Link -> Nhảy thẳng đến Ticket bị chìm -> Xử lý cho Học viên trong 5 phút"]
```

- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR):**
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | HAX G1 (Làm rõ hệ thống làm được gì) | Tiêu đề bản tin ghi rõ: "Bản tin Cảnh báo Ticket bị Miss & Gom nhóm Chủ đề Stuck" |
  | HAX G10 (Thu hẹp phạm vi khi nghi ngờ) | Chỉ gắn cờ [MISS GẤP] khi thời gian chờ >2h và có cờ câu hỏi kỹ thuật |
  | HAX G11 (Giải thích vì sao) | Đính kèm lý do gắn cờ: "Ticket mở từ 15:30 (chờ 3h20m), chứa từ khóa lỗi CVAT 500" |
  | PAIR (Feedback & Control) | Bổ sung nút [Mark as Resolved] / [Dismiss Alert] ngay dưới tin nhắn bản tin |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
- **① Nguồn sự thật:** AI đoán mò lý do học viên bị kẹt -> Kịch bản: AI chỉ trích dẫn đúng câu chữ nguyên văn của học viên trong ticket, không tự suy đoán linh tinh.
- **② Mơ hồ / Thiếu thông tin:** Học viên tạo ticket chỉ gửi ảnh không gõ chữ -> Kịch bản: AI gắn nhãn `[Ticket thiếu thông tin - Cần HV bổ sung log]` và tự nhắn 1 câu mẫu hướng dẫn HV gửi log.
- **③ Ngoài phạm vi / Thẩm quyền:** Học viên xin phúc khảo điểm / xin đổi lớp qua Ticket -> Kịch bản: AI phân loại vào nhóm `[Logistics - Cần Admin/BTC]`, gắn tag Admin.
- **④ Đặc thù domain:** Nhầm lẫn giữa Deadline Lab và Deadline Quiz -> Kịch bản: AI tra cứu đúng mã Lab (VD: Lab 2) với mốc giờ chính thức từ BTC.

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** AI nhận diện đúng Ticket bị Miss -> Gắn cờ Gấp + Direct Link -> TA click vào trả lời ngay.
- **Low-confidence (②):** Ticket mô tả quá ngắn -> AI hiển thị nhãn `[Cần kiểm tra thêm]` kèm trích đoạn ngắn.
- **Failure/không căn cứ (①):** Bot không lấy được link ticket -> Hiện thông báo "Không lấy được link direct, mã Ticket: #042".
- **Correction (user sửa):** TA thấy 1 ticket bị phân loại sai độ ưu tiên -> Bấm nút [Chuyển nhãn Thường].
- **Khi bị đòi ngoài phạm vi (③):** Học viên đòi sửa điểm -> AI hướng dẫn gửi mail chính thức cho BTC.
- **Case đặc thù domain (④):** Trùng tên nhiều học viên -> AI dựa vào Mã Học Viên / User ID Discord độc bản.

## §7. Kiểm thử
- **Chiều chất lượng:** 
  1. Accuracy (Độ chính xác nhận diện Ticket chưa rep: ≥90%).
  2. Factuality (Trích xuất đúng Direct Link & Tóm tắt không bịa: 100%).
- **Golden set:** Dựng bộ 20 case kiểm thử (10 case từ `discord-pack`, 5 case hiểm, 5 case bẫy) lưu tại `eval/golden_set.json`.
- **Quality bar:** "Đạt khi ≥ 85% case qua bộ eval và 0% lỗi bịa link hoặc dẫn sai ticket."

## §8. Phân công & kế hoạch
- **Phân công có tên:**
  - Lục Tiến Đạt (2A202602969 - Đội trưởng): Quản lý tiến độ, AI Spec, Prompt Pipeline & Logic backend.
  - Đinh Kim Thái (2A202602417): Data Mining, Xây dựng Golden Set & Testcase.
  - Lê Công Tâm (2A202602406): UI/UX Discord Mockup & Sơ đồ luồng.
  - Nguyễn Thành Tiến (2A202603003): Eval runner, Validation với 2 Willing Users & Slide PDF.
- **Willing users (≥2 tên):** Trần Ngọc Khánh (Học viên E403), Lê Quang Ngọc (Học viên E403), Lab Coach.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 17/9 (CP1) | Khởi tạo Canvas 7 dòng ban đầu | Nộp mốc CP1 đúng hạn |
| 17/9 (CP2) | Làm rõ bài toán từ "trôi câu hỏi chung" thành "Cảnh báo Ticket bị Miss do quá tải Ticket" | Khảo sát thực tế kênh Discord cho thấy nguyên nhân chính khiến TA bỏ sót bài là do bùng nổ quá nhiều Ticket không phân loại |
