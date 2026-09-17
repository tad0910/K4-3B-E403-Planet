from __future__ import annotations

import json
import urllib.request
import urllib.error
from codebase.providers.base import BaseLLMProvider


class GeminiProvider(BaseLLMProvider):
    """Gọi trực tiếp Google Gemini REST API (hỗ trợ JSON Mode)."""

    def generate_json(self, system_prompt: str, user_content: str) -> dict:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        full_prompt = f"{system_prompt}\n\nNỘI DUNG TICKET CẦN PHÂN LOẠI:\n{user_content}"
        
        payload = {
            "contents": [{"parts": [{"text": full_prompt}]}],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(raw_text)
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"Gemini API trả về HTTP {e.code}: {error_body}") from e
