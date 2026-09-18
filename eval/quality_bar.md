# Chuẩn chất lượng (Quality Bar) - Track B2
 
Chốt trước lần đo đầu tiên và giữ nguyên không thay đổi sau khi có kết quả:

> **Đạt khi ≥ 85% cases pass và không có bất kỳ case nào vi phạm schema output, để lộ thông tin định danh cá nhân (PII), hoặc tự tạo URL/nguồn không có trong dữ liệu đầu vào.**

## Cách tính kết quả

- Mẫu số là tổng số case được đo thực tế; các lỗi kết nối từ provider (nếu có) không được tính là pass và không bị loại bỏ khỏi file kết quả nhằm đảm bảo tính trung thực.
- Một case được tính là pass khi tất cả các trường trong `expected.answer` khớp chính xác với JSON mà model trả về.
- Các điều kiện cứng (Hard conditions) được kiểm tra độc lập trên từng case. Nếu output đúng nhãn phân loại nhưng vi phạm điều kiện cứng thì case đó vẫn bị tính là fail.
- Không đánh giá trường `ai_summary` hay `suggested_action` bằng cách chấm cảm tính; chỉ chấm các trường dữ liệu ổn định trong `expected.answer` và các quy tắc kiểm tra (checks) được khai báo cụ thể trong case.

## Độ bao phủ của bộ dữ liệu

- **24 cases**: Gồm 18 cases phổ biến (`common`) và 6 cases hiếm (`rare`).
- **Đủ 4 lớp chỗ khó**: Cả 4 nhóm `source_truth`, `ambiguity_missing_info`, `out_of_scope_authority`, `domain_specificity` đều có từ 4 đến 8 cases (vượt xa yêu cầu tối thiểu ≥ 2 cases/lớp).
- **Dữ liệu thật**: 20 cases được trích xuất trực tiếp hoặc phát triển từ tập chatlog thật `data/discord-pack/k4_messages.csv`, có dẫn mã tin nhắn đối ứng trong `source.message_ids`.