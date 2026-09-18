# BÀI HỌC SUY NGẪM CÁ NHÂN (REFLECTION LOG)

- **Họ và tên:** Nguyễn Thành Tiến
- **Mã học viên:** 2A202603003
- **Lớp:** 3B · **Phòng:** E403 · **Cụm:** 4 · **Track:** B2 (Trợ lý Discord - Cảnh báo Ticket bị Miss)
- **Vai trò trong nhóm:** Thành viên — Phụ trách xây dựng Golden set, Validation & Slide

---

## 1. Phần việc cụ thể em đã trực tiếp đảm nhiệm trong dự án

Với vai trò phụ trách kiểm chuẩn và validation, em tập trung biến ý tưởng sản phẩm thành các tiêu chí có thể đo lường và kiểm chứng:
- **Xây dựng bộ Golden set tại [eval/golden_set.json](eval/golden_set.json):**
  - Tổng hợp 24 case để kiểm thử khả năng phân loại ticket Discord, trong đó có 18 case phổ biến và 6 case hiếm.
  - Phân bổ dữ liệu theo đủ 4 lớp chỗ khó: `source_truth`, `ambiguity_missing_info`, `out_of_scope_authority` và `domain_specificity`.
  - Gắn expected answer cho từng case ở 4 trường quan trọng: `priority`, `category`, `missing_info` và `requires_admin`; đồng thời bổ sung các check chống bịa URL, lộ PII và vi phạm schema.
  - Ưu tiên dữ liệu có căn cứ từ chatlog thật, với 20/24 case được trích xuất trực tiếp hoặc phát triển từ dữ liệu thực tế.
- **Thiết lập và theo dõi quy trình Eval:**
  - Đóng góp vào việc chốt Quality Bar: đạt khi ít nhất 85% case pass và không có case nào vi phạm điều kiện cứng.
  - Theo dõi các lượt chạy trong [eval/runs/](eval/runs/) và đối chiếu lỗi theo từng lớp chỗ khó, thay vì chỉ nhìn vào một con số accuracy tổng.
  - Kết quả cho thấy baseline v1 chỉ đạt 12/24 case, tương đương 50%; sau các vòng cải tiến, v8 đạt 23/24 case, tương đương 95,83%, không có provider error và vượt Quality Bar.
- **Thực hiện Validation với người dùng:**
  - Ghi nhận feedback từ Coach Minh về ba điểm nghẽn: các nhãn `MISS` và `CVAT` khó hiểu, chưa rõ ticket cần chuyển cho ai, và khó tổng hợp nhanh các yêu cầu khẩn.
  - Cập nhật các phát hiện và thay đổi sản phẩm vào [validation/feedback_log.md](validation/feedback_log.md), làm căn cứ cho việc bổ sung mô tả cảnh báo, `target_role`/`target_team` và action `/urgent-digest`.

## 2. AI đã hỗ trợ em như thế nào trong quá trình làm việc?

Trong suốt thời gian hackathon, em sử dụng AI như một trợ lý phân tích và phản biện cho công việc kiểm thử:
- **Đọc và tổng hợp kết quả eval nhanh hơn:** AI giúp nhóm rà soát các file JSON/Markdown sau mỗi lượt chạy, nhóm các case fail theo nguyên nhân và nhận ra các lỗi lặp lại trong việc phân loại thẩm quyền, thiếu log và nguồn sự thật.
- **Kiểm tra độ bao phủ của Golden set:** AI hỗ trợ đối chiếu các case với 4 lớp chỗ khó, phát hiện các tình huống dễ bị bỏ sót như prompt injection, deadline không có nguồn chính thức, thread đã được trả lời và yêu cầu sửa điểm.
- **Chuyển feedback thành yêu cầu sản phẩm:** Từ ghi nhận của Coach Minh, AI giúp em hệ thống hóa feedback thành ba thay đổi có thể hành động: giải thích nhãn, xác định nơi xử lý và tạo bản tin tổng hợp ticket khẩn.
- **Nhận thức về giới hạn của AI:** AI có thể tóm tắt log rất nhanh nhưng không tự bảo đảm rằng một bộ test đã đại diện cho rủi ro thực tế. Con người vẫn phải quyết định expected answer, điều kiện cứng và phân biệt một lỗi phân loại với một trường hợp không được phép suy đoán.

## 3. Bài học sâu sắc nhất từ một case fail của chính nhóm

- **Tình huống lỗi điển hình:** Ở lượt chạy v8, hệ thống đạt 23/24 case và chỉ còn sai case **`B2-017`**. Đây là tình huống học viên hỏi deadline Lab2 nhưng input không kèm thông báo chính thức. Model đã nhận diện đúng đây là case cần chuyển Admin (`requires_admin: true`) và không được tự tạo URL, nhưng lại phân loại `category` thành `LOGISTICS_ADMIN` thay vì `LAB_SUBMISSION`.
- **Vì sao case này đáng chú ý:** Nếu chỉ nhìn vào việc hệ thống có chuyển tiếp Admin hay không, kết quả có vẻ đúng. Tuy nhiên, phân loại sai category làm giảm độ chính xác của bộ lọc và bản tổng hợp; ticket có thể bị đưa đến nhóm xử lý chưa phù hợp hoặc bị thống kê sai trong dashboard.
- **Cách nhóm xử lý:** Nhóm bổ sung và làm rõ quy tắc phân loại trong System Prompt, đồng thời giữ nguyên case này trong Golden set để không che khuất lỗi. Case được dùng như một phép thử cho nguyên tắc: khi thiếu nguồn sự thật, hệ thống phải vừa chuyển Admin vừa giữ đúng ngữ cảnh nghiệp vụ là `LAB_SUBMISSION`.
- **Bài học rút ra (Takeaway):**
  > *"Một hệ thống AI đáng tin cậy không chỉ cần trả lời đúng ở những tình huống dễ nhận biết. Nó phải được kiểm tra bằng các case ranh giới, nơi nhiều nhãn cùng có vẻ hợp lý. Golden set tốt không phải là bộ test để chứng minh sản phẩm luôn đúng, mà là công cụ giúp nhóm nhìn thấy chính xác sản phẩm đang sai ở đâu và cần cải thiện điều gì."*

Qua phần Validation, em cũng hiểu thêm rằng accuracy không phải là toàn bộ trải nghiệm. Một hệ thống có thể đạt 95,83% trên Golden set nhưng vẫn khiến người dùng bối rối nếu nhãn cảnh báo không có giải thích, không chỉ rõ nơi tiếp nhận, hoặc bắt người dùng tự tìm ticket khẩn. Vì vậy, eval và validation cần đi cùng nhau: một bên đo tính đúng của mô hình, một bên kiểm tra sản phẩm có thực sự giúp con người hành động nhanh hơn hay không.