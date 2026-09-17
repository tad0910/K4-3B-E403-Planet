from __future__ import annotations

from abc import ABC, abstractmethod


class BaseLLMProvider(ABC):
    """Lớp cơ sở cho các nhà cung cấp mô hình LLM."""

    def __init__(self, model: str, api_key: str):
        self.model = model
        self.api_key = api_key

    @abstractmethod
    def generate_json(self, system_prompt: str, user_content: str) -> dict:
        """Gửi prompt và trả về kết quả định dạng JSON."""
        pass
