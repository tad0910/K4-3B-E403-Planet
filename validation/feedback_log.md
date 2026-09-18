# NHẬT KÝ THỬ NGHIỆM VỚI NGƯỜI DÙNG THỰC TẾ (VALIDATION LOG — R6)

- **Dự án:** Smart Digest & Missed Ticket Alert cho TA Discord
- **Nhóm:** K4-3B-E403-Planet · Zone E403 · Track B2
- **Thời gian thực hiện:** Chiều 18/9/2026 (Phòng E403)
- **Phương pháp:** Giao task theo outcome (tìm và xử lý 3 ticket bị miss trong 2 phút), quan sát không can thiệp, phỏng vấn sau khi trải nghiệm.

---

## 👥 BẢNG TỔNG HỢP CÁC PHIÊN THỬ NGHIỆM

| # | Người thử nghiệm | Vai trò / Đối tượng | Task đã giao | Thời gian hoàn thành | Trích dẫn nhận xét nguyên văn | Mức độ nghiêm trọng |
|---|---|---|---|:---:|---|:---:|
| 1 | **Coach Minh** | Lab Coach trực lớp E403 (Willing User) | Rà soát danh sách 8 ticket đang mở và tìm ra các ticket cần cứu hộ gấp | 1m 45s | *"Mấy cái mục cảnh báo miss, lỗi cvat đồ gì đó là gì không biết? Rồi cái phân loại thì ticket ngoài lab coach còn có nhiều người khác trả lời nữa như học viên... hay hiểu là yêu cầu đó cần gửi tới ai như hư dụng cụ đồ chẳng hạn. Rồi nếu muốn tổng hợp hết mấy yêu cầu cần giải quyết liền thì làm sao, kiểu bấm cái gì như /... thì nó tổng hợp lại hết luôn chứ không cuộn lướt từ từ xuống."* | 🔴 **Cao** (UX & Khả năng hiểu) |
| 2 | **Trần Ngọc Khánh** | Học viên phòng E403 (Willing User) | Tìm câu hỏi của mình về lỗi Phoenix và xem AI gợi ý xử lý | 45s | *"Nhìn vào thấy ngay ticket đỏ nổi lên đầu kèm lý do chờ bao lâu, không phải cuộn tìm từng kênh chat dài dằng dặc."* | 🟢 Nhẹ |
| 3 | **Lê Quang Ngọc** | Học viên phòng E403 (Willing User) | Đóng vai TA dùng thử tính năng gửi câu trả lời mẫu AI | 1m 10s | *"Rất thích nút bấm Direct Link nhảy thẳng vào thread, kèm câu hỏi mẫu gợi ý xin log giúp HV đỡ lúng túng khi hỏi cộc lốc."* | 🟢 Nhẹ |

---

## 🔍 PHÂN TÍCH 3 VẤN ĐỀ CỐT LÕI TỪ PHẢN HỒI CỦA COACH MINH

### 1. Thuật ngữ còn mang tính kỹ thuật / dev nội bộ
- **Vấn đề:** Các nhãn `MISS_GAP`, `CVAT_ENVIRONMENT`, `LOGISTICS_ADMIN` gây bỡ ngỡ cho Coach mới, chưa giải thích rõ mức độ nghiêm trọng.
- **Hành động khắc phục:**
  - Việt hóa và đời thường hóa toàn bộ nhãn tag: `🚨 BỎ SÓT >2H (Cần cứu gấp)`, `🛠️ Môi trường Lab (Docker/CVAT)`, `📋 Thủ tục & Phép vắng (Chuyển BTC)`.
  - Bổ sung **Thanh Chú thích trực quan (Quick Legend Bar)**: *Đỏ = Chờ >2h* | *Vàng = Chờ 1–2h* | *Xanh = Mới tạo*.

### 2. Thiếu phân luồng thẩm quyền "Ticket này gửi cho ai?" (Role Routing)
- **Vấn đề:** Trong thực tế, ticket kỹ thuật thuộc về Lab Coach, nhưng ticket sửa điểm/xin nghỉ thuộc về BTC, còn hỏng chuột/mất mạng thuộc về Kỹ thuật phòng máy.
- **Hành động khắc phục:**
  - Bổ sung trường **`👤 Gửi tới (Role)`** trên từng card:
    - 👨‍🏫 `Lab Coach / TA Kỹ thuật` (Lỗi code, docker, bài lab).
    - 🏛️ `Ban Tổ Chức / Quản lý Lớp` (Phúc khảo điểm, xin nghỉ phép).
    - 🔧 `Kỹ thuật Phòng máy` (Hỏng thiết bị, mạng LAN).
    - 👥 `Học viên hỗ trợ` (FAQ chung, slide, lịch học).
  - Bổ sung bộ lọc nhanh: `[🛠️ Việc của Lab Coach]` và `[🏛️ Chuyển BTC / Admin]`.

### 3. Thiếu công cụ tổng hợp tức thì (Instant Emergency Digest)
- **Vấn đề:** Coach không muốn phải cuộn lướt từng card mà cần 1 nút bấm gom toàn bộ các việc cần làm ngay thành một bản tin hành động ngắn gọn.
- **Hành động khắc phục:**
  - Bổ sung nút **`⚡ Bản tin Tóm tắt (/urgent-digest)`** ngay trên thanh điều khiển.
  - Khi bấm vào, mở modal **Instant Action Digest** gom riêng các ticket đỏ cần cứu gấp và ticket cần chuyển BTC, kèm nút `[📋 Sao chép Bản tin Discord]` để dán thẳng vào `#ta-ticket-control` chỉ trong 1 giây.

---

## 📊 BỐN DÒNG TỔNG HỢP THEO QUY ĐỊNH CP5 (§5.1):
1. **Chủ đề lặp nhiều nhất:** Thuật ngữ phân loại cần thuần Việt, rõ ràng và cần công cụ tổng hợp nhanh các ticket cần cứu gấp.
2. **Thay đổi đã làm:** Bổ sung modal `/urgent-digest`, thêm thanh chú thích màu sắc, thêm huy hiệu phân quyền `👤 Gửi tới (Role)`, đổi tên kênh và tag sang tiếng Việt trực quan.
3. **Phần giữ nguyên có lý do:** Giữ nguyên cơ chế phân loại AI 3 mức (Gấp/Trung bình/Thấp) và nút Direct Link vì được 100% người dùng đánh giá là cốt lõi giá trị nhất.
4. **Phần đưa vào backlog:** Tích hợp trực tiếp bot Discord Webhook để tự động bắn bản tin digest vào kênh chat theo lịch hẹn giờ.
