"""
ai_classifier.py — AI Pipeline phân loại & cảnh báo Ticket cho TA Discord
Kiến trúc Module hóa theo chuẩn Day 04: Providers + Env Loader + Prompts.
"""

from __future__ import annotations
import sys
import json
import time
from pathlib import Path

# Đảm bảo UTF-8 cho console trên Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Đảm bảo import được module trong codebase
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from codebase.env_loader import load_dotenv
from codebase.providers import get_provider, get_available_providers

# Nạp file .env
load_dotenv(ROOT_DIR / ".env")

# Đường dẫn file System Prompt độc lập
PROMPT_PATH = Path(__file__).resolve().parent / "prompts" / "system_prompt.md"


def get_system_prompt() -> str:
    """Nạp system prompt từ file Markdown riêng biệt."""
    if PROMPT_PATH.exists():
        return PROMPT_PATH.read_text(encoding="utf-8").strip()
    raise FileNotFoundError(f"Không tìm thấy file System Prompt tại: {PROMPT_PATH}")


def classify_ticket(ticket: dict) -> dict:
    """
    Nhận vào 1 Ticket dict và gọi mô hình AI phân loại.
    Hỗ trợ cơ chế Fallback tự động: nếu provider số 1 gặp lỗi (hết quota, timeout...),
    hệ thống sẽ tự động chuyển sang provider tiếp theo trong danh sách.
    """
    providers = get_available_providers()
    system_prompt = get_system_prompt()

    user_content = f"""MÃ TICKET: {ticket.get('ticket_id', 'Unknown')}
TIÊU ĐỀ: {ticket.get('title', '')}
NGƯỜI GỬI: {ticket.get('author', 'Học viên')}
THỜI GIAN CHỜ: {ticket.get('wait_time_minutes', 0)} phút
NỘI DUNG CHI TIẾT:
{ticket.get('content', '')}"""

    errors: list[str] = []
    for idx, (provider_name, model_name, provider) in enumerate(providers):
        try:
            start_time = time.time()
            result = provider.generate_json(system_prompt, user_content)
            elapsed = round(time.time() - start_time, 2)

            result["latency_seconds"] = elapsed
            result["provider_used"] = provider_name
            result["model_used"] = model_name
            result["ticket_id"] = ticket.get("ticket_id")
            if idx > 0:
                result["fallback_from"] = [p[0] for p in providers[:idx]]
            return result
        except Exception as exc:
            err_msg = f"[{provider_name.upper()} - {model_name}] Lỗi: {exc}"
            print(f"⚠️ Cảnh báo Fallback: {err_msg}. Đang thử provider tiếp theo...")
            errors.append(err_msg)

    # Nếu tất cả provider đều lỗi
    raise RuntimeError(f"Tất cả LLM Providers đều thất bại:\n" + "\n".join(errors))


if __name__ == "__main__":
    try:
        provider_name, model_name, _ = get_provider()
        print(f"🚀 AI Classifier đã sẵn sàng | Provider: [{provider_name.upper()}] | Model: [{model_name}]")
    except Exception as e:
        print(f"⚠️ {e}")

    sample_ticket = {
        "ticket_id": "ticket-042",
        "author": "S4019",
        "title": "Lỗi 500 khi chạy CVAT bước 3",
        "content": "Em chạy cvat-server tới bước OPA thì bị lỗi 500 health check, màn hình đứng im hoài. Em cài trên Windows 11.",
        "wait_time_minutes": 180
    }

    print("\n📩 Thử nghiệm phân loại Ticket mẫu:")
    try:
        output = classify_ticket(sample_ticket)
        print("\n✅ KẾT QUẢ TỪ AI:")
        print(json.dumps(output, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"\n❌ Lỗi gọi AI: {e}")
