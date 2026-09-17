export const INITIAL_TICKETS = [
  {
    id: "T-2048",
    cardId: "ticket-48",
    userInitials: "MA",
    avatarBg: "#9c27b0",
    userName: "Nguyễn Minh Anh",
    studentId: "HV-23041",
    channel: "#general-qa",
    timeElapsed: "3h 42m",
    statusTag: "🚨 MISS GẤP (>2h)",
    statusType: "urgent", // 'urgent' | 'warning' | 'new'
    category: "cvat", // 'cvat' | 'logistics' | 'prompt'
    title: "Rate Limit API Gemini ở Bài 2",
    studentQuestion: "Em đang bị lỗi 429 Too Many Requests khi gọi Gemini API, đã thử đổi API key nhưng vẫn chưa được ạ.",
    aiSummary: "Lỗi 429 thường do vượt quota theo phút. Hướng dẫn học viên dùng exponential backoff và kiểm tra quota trong Google AI Studio.",
    aiSuggestedAction: "Gợi ý thêm đoạn retry có giới hạn 3 lần vào bài làm.",
    sourceCitation: "Trích từ: Bản ghi Bài 2 · Min 14:20",
    aiDraftReply: "Chào Minh Anh! Lỗi 429 Too Many Requests xuất hiện do vượt quá giới hạn request/phút (RPM) của API Gemini miễn phí. Em làm theo 2 bước sau nhé:\n\n1. Áp dụng Exponential Backoff (chờ tăng dần 2s, 4s, 8s giữa các lần gọi lại).\n2. Kiểm tra lại Quota & Rate Limit trên Dashboard Google AI Studio.\n\nNếu vẫn bị vướng, em gửi lại đoạn code gọi API để anh hỗ trợ debug nha!"
  },
  {
    id: "T-2041",
    cardId: "ticket-41",
    userInitials: "LN",
    avatarBg: "#ff9800",
    userName: "Lê Thảo Nguyên",
    studentId: "HV-22500",
    channel: "#general-qa",
    timeElapsed: "1h 50m",
    statusTag: "🟡 CẦN THÊM THÔNG TIN",
    statusType: "warning",
    category: "prompt",
    title: "Cùng một prompt nhưng mỗi lần chạy lại cho một kết quả khác nhau. Em nên kiểm tra tham số nào trong request ạ?",
    studentQuestion: "Cùng một prompt nhưng mỗi lần chạy lại cho một kết quả khác nhau. Em nên kiểm tra tham số nào trong request ạ?",
    aiSummary: "Kiểm tra temperature, seed và prompt formatting. Nếu cần kết quả deterministic, giảm temperature về 0.",
    aiSuggestedAction: "Hỏi thêm model và cấu hình temperature hiện tại.",
    sourceCitation: "Trích từ: Prompt Engineering Notes · P.6",
    aiDraftReply: "Chào Thảo Nguyên! Tính ngẫu nhiên của mô hình LLM phụ thuộc chủ yếu vào tham số Temperature và Top-P:\n\n1. Nếu muốn kết quả cố định (deterministic), em hãy đặt `temperature = 0`.\n2. Nếu dùng OpenAI/Gemini API, em có thể set thêm tham số `seed` cố định để các lần sinh ra tương đồng nhau.\n\nEm kiểm tra lại cấu hình request trong code nhé!"
  },
  {
    id: "T-2035",
    cardId: "ticket-35",
    userInitials: "DA",
    avatarBg: "#23a55a",
    userName: "Phạm Đức Anh",
    studentId: "HV-23216",
    channel: "#bai-3-rag",
    timeElapsed: "52m",
    statusTag: "🟢 TICKET MỚI",
    statusType: "new",
    category: "cvat",
    title: "Chunk tài liệu trước khi tạo embedding?",
    studentQuestion: "Em đang chuẩn bị dữ liệu cho phần RAG. Kích thước chunk bao nhiêu là hợp lý ạ?",
    aiSummary: "Nên chunk theo ngữ nghĩa, bắt đầu với 400–800 tokens và overlap khoảng 10–15% để giữ ngữ cảnh.",
    aiSuggestedAction: "Gợi ý thử nghiệm hai kích thước chunk và đo recall.",
    sourceCitation: "Trích từ: Bản ghi Bài 4 · Min 22:05",
    aiDraftReply: "Chào Đức Anh! Kích thước chunk phụ thuộc vào loại tài liệu, tuy nhiên baseline khuyên dùng cho RAG là:\n\n1. Chunk size: 400 - 800 tokens (tương đương 300 - 600 từ).\n2. Overlap: 10% - 15% (khoảng 50 - 80 tokens) giữa các đoạn liền kề để không bị mất ngữ cảnh ranh giới.\n\nEm thử nghiệm 2 cấu hình này trên bộ eval để xem độ khôi phục (recall) nào tốt hơn nhé!"
  },
  {
    id: "T-2030",
    cardId: "ticket-30",
    userInitials: "TT",
    avatarBg: "#e91e63",
    userName: "Trần Thành Tiến",
    studentId: "HV-23003",
    channel: "#general-qa",
    timeElapsed: "35m",
    statusTag: "📋 LOGISTICS",
    statusType: "warning",
    category: "logistics",
    title: "Thời hạn nộp bài Lab 2 và cách nộp file Zip",
    studentQuestion: "Cho em hỏi hạn chốt CP2 tối nay là mấy giờ và nộp qua form hay push repo ạ?",
    aiSummary: "Nhắc mốc nộp CP2 là 21:00 tối nay. Nộp link repo GitHub public kèm link prototype mock.",
    aiSuggestedAction: "Gửi link form nộp checkpoint và nhắc mốc 21h00.",
    sourceCitation: "Trích từ: Quy định Hackathon Batch 04 · CP2",
    aiDraftReply: "Chào Thành Tiến! Hạn chốt nộp CP2 là đúng 21:00 tối nay nhé. Em điền link repo GitHub công khai và link prototype vào Form nộp bài của BTC nhé!"
  }
];

export const INITIAL_METRICS = {
  totalOpen: 14,
  missedUrgent: 2,
  resolvedToday: 18,
  avgResponseTime: "15 phút"
};
