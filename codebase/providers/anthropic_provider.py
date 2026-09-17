from __future__ import annotations

import json
import urllib.error
import urllib.request

from codebase.providers.base import BaseLLMProvider


class AnthropicProvider(BaseLLMProvider):
    """Small standard-library adapter for Anthropic's Messages API."""

    def generate_json(self, system_prompt: str, user_content: str) -> dict:
        payload = {
            "model": self.model,
            "max_tokens": 1200,
            "temperature": 0.1,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_content}],
        }
        request = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                data = json.loads(response.read().decode("utf-8"))
            text = "".join(part.get("text", "") for part in data.get("content", []))
            start, end = text.find("{"), text.rfind("}")
            if start < 0 or end <= start:
                raise RuntimeError("Anthropic response did not contain a JSON object")
            return json.loads(text[start:end + 1])
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Anthropic API returned HTTP {exc.code}: {body}") from exc