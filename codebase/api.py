"""
api.py — FastAPI Backend kết nối trực tiếp AI Pipeline với Giao diện Discord Frontend
Hỗ trợ:
1. Lấy danh sách Ticket thật từ eval/golden_set.json
2. Phân tích Ticket trực tiếp bằng mô hình AI thật (OpenRouter / Gemini / OpenAI)
3. Endpoint phục vụ Live Demo cho mốc CP3 & thẻ giám khảo CP6
"""

from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Đảm bảo import được codebase
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from codebase.env_loader import load_dotenv
from codebase.providers import get_provider
from codebase.ai_classifier import classify_ticket

# Nạp .env
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="Discord TA AI Assistant API", version="1.0.0")

# Cấu hình CORS để React Vite từ cổng 5173 gọi vào được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOLDEN_SET_PATH = ROOT_DIR / "eval" / "golden_set.json"


class TicketInput(BaseModel):
    ticket_id: Optional[str] = "T-CUSTOM"
    title: str
    author: Optional[str] = "HV-Unknown"
    wait_time_minutes: Optional[int] = 30
    content: str


def format_wait_time(minutes: int) -> str:
    if minutes >= 60:
        h = minutes // 60
        m = minutes % 60
        return f"{h}h {m}m" if m > 0 else f"{h}h"
    return f"{minutes}m"


def map_category(cat: str) -> str:
    cat = (cat or "").upper()
    if "CVAT" in cat:
        return "cvat"
    if "LOGISTICS" in cat:
        return "logistics"
    return "prompt"


def build_frontend_ticket(case: dict[str, Any], index: int) -> dict[str, Any]:
    c_id = case.get("id", f"T-{index+1:03d}")
    inp = case.get("input", {})
    wait = int(inp.get("wait_time_minutes", 30))
    author = inp.get("author", f"HV-{1000+index}")
    title = inp.get("title", "Yêu cầu hỗ trợ")
    content = inp.get("content", "")

    # Mức độ khẩn cấp dựa trên thời gian chờ
    if wait >= 120:
        status_type = "urgent"
        status_tag = f"🚨 MISS GẤP ({format_wait_time(wait)})"
    elif wait >= 60:
        status_type = "warning"
        status_tag = f"🟡 CẦN THEO DÕI ({format_wait_time(wait)})"
    else:
        status_type = "new"
        status_tag = f"🟢 TICKET MỚI ({format_wait_time(wait)})"

    # Màu avatar sinh ngẫu nhiên ổn định theo index
    colors = ["#9c27b0", "#ff9800", "#23a55a", "#5865f2", "#e91e63", "#00bcd4"]
    avatar_bg = colors[index % len(colors)]

    return {
        "id": c_id,
        "cardId": f"ticket-{index+1}",
        "userInitials": author[:2].upper() if len(author) >= 2 else "HV",
        "avatarBg": avatar_bg,
        "userName": f"Học viên {author}",
        "studentId": author,
        "channel": "#general-qa",
        "timeElapsed": format_wait_time(wait),
        "statusTag": status_tag,
        "statusType": status_type,
        "category": "cvat" if "cvat" in content.lower() or "docker" in content.lower() else "logistics" if "nghỉ" in content.lower() or "thẻ" in content.lower() or "team" in content.lower() else "prompt",
        "title": title,
        "studentQuestion": content,
        "aiSummary": "Chưa chạy phân tích AI. Bấm 'Quét AI' để gọi mô hình thật.",
        "aiSuggestedAction": "Bấm nút 'Kích hoạt AI' để nhận hành động gợi ý.",
        "aiDraftReply": "",
        "isAnalyzed": False,
    }


@app.get("/api/health")
def health_check():
    try:
        provider_name, model_name, _ = get_provider()
        return {
            "status": "online",
            "provider": provider_name,
            "model": model_name,
            "timestamp": time.time(),
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": time.time(),
        }


@app.get("/api/tickets")
def get_tickets(limit: int = 10):
    """Lấy danh sách Ticket từ file golden_set.json thật"""
    if not GOLDEN_SET_PATH.exists():
        raise HTTPException(status_code=404, detail="golden_set.json not found")

    try:
        data = json.loads(GOLDEN_SET_PATH.read_text(encoding="utf-8"))
        cases = data.get("cases", [])[:limit]
        formatted = [build_frontend_ticket(case, idx) for idx, case in enumerate(cases)]
        return {"total": len(data.get("cases", [])), "returned": len(formatted), "tickets": formatted}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Lỗi đọc dữ liệu: {exc}")


@app.post("/api/classify")
def classify_single_ticket(payload: TicketInput):
    """
    Gọi mô hình AI thật để phân loại và soạn câu trả lời cho Ticket.
    """
    ticket_dict = {
        "ticket_id": payload.ticket_id,
        "title": payload.title,
        "author": payload.author,
        "wait_time_minutes": payload.wait_time_minutes,
        "content": payload.content,
    }

    try:
        result = classify_ticket(ticket_dict)
        return {
            "success": True,
            "ticket_id": payload.ticket_id,
            "ai_result": result,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Lỗi gọi AI: {exc}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
