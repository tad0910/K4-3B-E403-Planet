# Đánh giá (Eval) - Track B2

Golden set kiểm chuẩn được định nghĩa tại file `golden_set.json`. Script `run_eval.py` phục vụ đánh giá trực tiếp trên system prompt (prompt-only): không import tool declaration và không bắt buộc gọi tool. Mọi kết quả chạy thực tế (live run) đều được lưu thành các file JSON và Markdown riêng biệt trong thư mục `eval/runs/`, bao gồm đầy đủ cả các case đạt (pass), không đạt (fail) và lỗi kết nối provider.

## Cách chạy kiểm thử khi có API key

```powershell
python eval/run_eval.py --version v1 --provider openrouter
```
*(Hoặc dùng provider `gemini` / `openai` tùy theo cấu hình API key của bạn).*

Thông tin API key được tự động nạp từ file `.env` ở thư mục gốc của repository (tham khảo file `.env.example`). Sau mỗi lần chạy, thư mục `eval/runs/` sẽ tự động sinh:
- File `<run_id>.json`: Lưu vết chi tiết input, output của model và lỗi sai của từng test case.
- File `<run_id>.md`: Báo cáo tổng kết trực quan (số case đã thử, số case đúng, số case sai, lỗi kết nối, độ chính xác % và kết luận theo Quality Bar).

## Kiểm tra ngoại tuyến (Offline check)

Nếu muốn chạy đánh giá lại một tập kết quả output đã lưu từ trước mà không cần gọi API:

```powershell
python eval/run_eval.py --version v1 --responses eval/fixtures/responses.json
```

## Nguyên tắc đánh giá & Tối ưu

Tuyệt đối không thay đổi tiêu chí trong `quality_bar.md` sau lần đo đầu tiên. Quy trình lặp chuẩn cho từng vòng cải tiến:
1. Chạy trọn bộ toàn bộ test case.
2. Đọc bảng tổng kết và phân tích nguyên nhân các case thất bại.
3. Tinh chỉnh lại nội dung trong `codebase/prompts/system_prompt.md`.
4. Chạy lại trọn bộ để đo lường độ cải thiện của Pass Rate.