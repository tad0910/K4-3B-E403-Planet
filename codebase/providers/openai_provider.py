from __future__ import annotations

import json
import urllib.request
import urllib.error
from codebase.providers.base import BaseLLMProvider


class OpenAICompatibleProvider(BaseLLMProvider):
    """Xử lý các endpoint tương thích OpenAI (OpenRouter, OpenAI)."""

    def __init__(self, model: str, api_key: str, base_url: str):
        super().__init__(model, api_key)
        self.base_url = base_url.rstrip("/")

    def generate_json(self, system_prompt: str, user_content: str) -> dict:
        payload = {
            "model": self.model,
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ]
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "K4-TA-Discord-Assistant/1.0",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "K4 Hackathon TA Discord Assistant"
        }
        
        req = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                raw_text = data["choices"][0]["message"]["content"]
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].split("```")[0].strip()
                return json.loads(raw_text)
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"API {self.base_url} trả về HTTP {e.code}: {error_body}") from e
