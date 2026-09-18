# Feedback Log

## Thông tin ghi nhận

- **Người phản hồi:** Coach Minh - Lab Coach
- **Ngày ghi nhận:** 18/09/2026
- **Mục tiêu:** Ghi nhận feedback về khả năng giải thích cảnh báo, phân loại nơi xử lý và tổng hợp nhanh các yêu cầu cần ưu tiên.

## Feedback từ Coach Minh

### 1. Các mục cảnh báo / lỗi

- Chưa rõ ý nghĩa của các cảnh báo như **"miss", "CVAT", và các loại lỗi khác**.
- Cần bổ sung mô tả/giải thích ngắn gọn để người dùng hiểu cảnh báo đang nói về vấn đề gì và cần xử lý như thế nào.

### 2. Phân loại yêu cầu / người xử lý

- Ticket ngoài lab có thể được trả lời hoặc xử lý bởi nhiều đối tượng khác nhau, không chỉ Coach.
- Học viên và các bên liên quan khác cũng có thể tham gia trả lời.
- Nên phân loại theo hướng **"yêu cầu này cần được gửi/xử lý bởi ai"** thay vì chỉ phân loại theo người trả lời.
- Ví dụ: yêu cầu **hư dụng cụ** cần được chuyển đến người/bộ phận phụ trách dụng cụ.

### 3. Tổng hợp nhanh các yêu cầu cần xử lý ngay

- Hiện chưa có cách nhanh chóng xem **toàn bộ các yêu cầu cần giải quyết ngay**.
- Người dùng phải tự lướt xuống để tìm từng ticket có đánh dấu cần xử lý ngay.
- Cần bổ sung một action/command nhanh, ví dụ `/urgent-digest`, để tự động tổng hợp tất cả yêu cầu cần xử lý ngay trong một danh sách/tóm tắt duy nhất.
- Mục tiêu là giúp Coach nắm nhanh việc ưu tiên mà không phải đọc hoặc lướt toàn bộ lịch sử chat.

## Quan sát và yêu cầu sản phẩm

| Vấn đề | Quan sát | Yêu cầu cải thiện |
|---|---|---|
| Cảnh báo khó hiểu | Nhãn `MISS`, `CVAT` và các loại lỗi chưa nói rõ ý nghĩa | Hiển thị mô tả, điều kiện kích hoạt và hành động tiếp theo |
| Phân loại chưa đúng nơi xử lý | Category hiện tại chưa tách nơi chịu trách nhiệm khỏi người trả lời | Thêm `target_role` hoặc `target_team`|
| Khó xem việc khẩn | Chỉ có danh sách/bộ lọc, chưa có bản tổng hợp duy nhất | Thêm `/urgent-digest` để gom toàn bộ ticket cần ưu tiên |

## Thay đổi sản phẩm từ feedback

1. Bổ sung giải thích ngắn cho `MISS`, `CVAT`, lỗi thiếu log, lỗi quyền truy cập và yêu cầu hành chính.
2. Phân loại theo nơi/bộ phận chịu trách nhiệm xử lý, không chỉ theo người trả lời; bổ sung ví dụ cho yêu cầu hư dụng cụ.
3. Thêm action `/urgent-digest` để tổng hợp ticket khẩn, gồm mã ticket, vấn đề chính, thời gian chờ, đích xử lý và link ticket gốc.

## Changelog validation

| Ngày | Thay đổi | Căn cứ |
|---|---|---|
| 18/09/2026 | Bổ sung mô tả cho các cảnh báo và loại lỗi | Feedback Coach Minh về `miss`, `CVAT` và các lỗi chưa rõ nghĩa |
| 18/09/2026 | Đổi định hướng phân loại sang nơi/bộ phận cần xử lý | Feedback Coach Minh về ticket ngoài lab và ví dụ hư dụng cụ |
| 18/09/2026 | Thêm action `/urgent-digest` để tổng hợp các yêu cầu cần ưu tiên | Feedback Coach Minh về việc phải tự lướt tìm ticket khẩn |

## Quote nguyên văn

> “Nên phân loại theo hướng ‘yêu cầu này cần được gửi/xử lý bởi ai’ thay vì chỉ phân loại theo người trả lời.”

> “Cần bổ sung một action/command nhanh (ví dụ `/urgent-digest`) để khi bấm vào, hệ thống tự động tổng hợp tất cả các yêu cầu đang cần xử lý ngay trong một danh sách/tóm tắt duy nhất.”
