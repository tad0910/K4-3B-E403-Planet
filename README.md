# Mini Hackathon AI — Batch 04 · Lớp 3B

**SPEC → Prototype → Demo.** Đây không phải cuộc thi code — đây là cuộc thi **tư duy sản phẩm AI**.

## 👥 Thành viên nhóm & Phân công vai trò

**Lớp:** 3B · **Phòng:** E403 · **Cụm:** ____ · **Track:** ____

| Họ và Tên | Mã Học Viên | Vai trò chính | Phần việc đảm nhiệm trong dự án |
|---|---|---|---|
| Lục Tiến Đạt | 2A202602969 | Đội trưởng (Mã nộp bài) | Quản lý tiến độ, AI Spec, Prompt & Code |
| Đinh Kim Thái | 2A202602417 | Thành viên | Mining Data, Evidence & Testing |
| Lê Công Tâm | 2A202602406 | Thành viên | UI/UX Flow, Prototype Mock |
| Nguyễn Thành Tiến | 2A202603003 | Thành viên | Golden set, Validation & Slide |

> Nhóm copy nguyên file README này về repo của mình, rồi điền bảng trên. Cột **Phần việc đảm nhiệm** ghi càng cụ thể càng tốt.

- Thời lượng: **39 giờ** từ phát đề đến thuyết trình (ca 3B) — LAB 5 (phát đề + build) · LEC 6 (tiếp tục build theo ca) · LAB 6 (vòng thi)
- Nhóm: **3-4 người** · thi theo phòng (E403 / E402), chia cụm rồi chung kết phòng — xem *Thể thức thi*
- **Chia cụm theo bàn**, không cần chung đề tài. Chủ đề tự chọn trong khuôn khổ đề bài
- Nhóm nhỏ thì **chọn lát cắt nhỏ**, và phải có **khảo sát nỗi đau thật** — đây là chỗ ăn điểm nặng nhất

## Bắt đầu từ đâu?

1. Đọc **`01-challenge-brief.md`** để hiểu khung chung và 5 tiêu chí, rồi **`tracks/README.md`** để chọn track và đề.
2. Mở **`02-guide.md`** — hướng dẫn từng giai đoạn, đứng ở đâu đọc mục đó.
3. Viết spec theo **`03-ai-spec-template.md`** — deliverable trung tâm của cả sự kiện.
4. Đọc **`04-rubric.md`** ngay từ đầu — biết trước bài được chấm theo tiêu chí nào.

| File / thư mục | Nội dung |
|---|---|
| `01-challenge-brief.md` | Đề bài: bảng 5 track · lát cắt · ràng buộc chung · 5 tiêu chí nghiệm thu |
| `02-guide.md` | Hướng dẫn 5 giai đoạn: khám phá → spec → build → đo & validate → demo |
| `03-ai-spec-template.md` | Template AI Spec (nộp tại **hạn chốt spec** — xem Lịch) |
| `04-rubric.md` | Rubric 100 điểm (25 nộp checkpoint + 67 chấm bài + 8 điểm R6) + checklist xác minh 6 mốc |
| `examples/` | Ví dụ bài nộp của khoá trước (đã ẩn tên): `canvas-cp1.md` — mẫu trống Canvas 7 dòng + 3 ví dụ đạt (track A, A/D, B) |
| `tracks/` | **5 track**, mỗi đề cùng một khung mục: A VLearn Tutor · B Trợ lý Discord · C Lesson Studio · D Học tập thích ứng & tương tác · E Làn mở (trong phạm vi AI20k) — bắt đầu từ `tracks/README.md` |
| `data/` | Dữ liệu thật đã ẩn danh: `vlearn-pack/` (chatlog VLearn tutor + 6 transcript bài giảng + 2 bộ slide bản hackathon) và **`discord-pack/` (tin nhắn Discord khoá 4 + bản tin bot)** — dùng để tìm bằng chứng và xây golden set. **Đọc `data/README.md` trước** |
| `further-reading/` | Tài liệu tham khảo có tóm lược tiếng Việt: **Mom Test** (phỏng vấn), **PAIR Guidebook** (Google, 6 chương), **HAX Toolkit** (Microsoft, 18 nguyên tắc), **JTBD Playbook** + worksheet — bắt đầu từ `further-reading/README.md` |

## Lịch — 6 checkpoint (ca 3B · 39 giờ)

| Mốc | Cần hoàn thành | Hạn (ca 3B) |
|---|---|---|
| — | Khai mạc 17:30 · phát đề 18:00 | 17/9 |
| **CP1** | Canvas 7 dòng (`02-guide.md` §1.5) + đội trưởng + **link repo GitHub công khai** | **19:30** · 17/9 |
| **CP2** | Cho thấy **luồng hoạt động** — bấm thử được, hoặc sơ đồ luồng | **21:00** · 17/9 |
| **CP3** | **Video thao tác** 30 giây + **số đo** (thử bao nhiêu, đúng bao nhiêu) | **16:00** · 18/9 |
| **CP4** | Chốt `spec.md` — **khoá chuẩn "đạt"** · tự khai phần chưa xong | **21:00** · 18/9 |
| **CP5** | Slide PDF + **video demo dự phòng cho buổi pitch** — nộp cuối | **22:30** · 18/9 |
| **CP6** | Thuyết trình · không nộp thêm | **09:00** · 19/9 |

**CP1 đến CP5 mỗi mốc 5 điểm.** Nộp đúng hạn được đủ, nộp muộn là **0 điểm mốc đó** — không bù được bằng mốc khác.

## Cấu trúc repo

```
repo/
├── README.md          ← file này, điền bảng thành viên ở đầu
├── spec.md            ← AI Spec theo 03-ai-spec-template.md
├── demo-slides.pdf    ← slide 6 trang theo 02-guide.md §5.1
├── codebase/          ← prototype (ghi rõ phần nào mock)
├── eval/              ← golden set + bảng kết quả các lượt chạy
├── validation/        ← nhật ký cho người ngoài dùng thử (R6 — không làm thì trần điểm 92)
└── reflection/        ← mỗi người 1 file
```
