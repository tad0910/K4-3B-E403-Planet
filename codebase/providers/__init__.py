from __future__ import annotations

import os
from codebase.providers.base import BaseLLMProvider
from codebase.providers.anthropic_provider import AnthropicProvider
from codebase.providers.gemini_provider import GeminiProvider
from codebase.providers.openai_provider import OpenAICompatibleProvider


def get_available_providers() -> list[tuple[str, str, BaseLLMProvider]]:
    """Trả về danh sách các provider có sẵn trong .env theo thứ tự ưu tiên."""
    providers: list[tuple[str, str, BaseLLMProvider]] = []
    explicit_provider = (os.getenv("LLM_PROVIDER") or "").lower().strip()

    if explicit_provider:
        try:
            providers.append(make_provider(explicit_provider))
        except Exception:
            pass

    candidates = ["openrouter", "gemini", "openai", "anthropic"]
    for c in candidates:
        if c == explicit_provider:
            continue
        try:
            p_tuple = make_provider(c)
            providers.append(p_tuple)
        except Exception:
            continue

    if not providers:
        raise RuntimeError("Chưa tìm thấy API Key nào trong .env! Hãy mở file .env và điền GEMINI_API_KEY, OPENROUTER_API_KEY hoặc OPENAI_API_KEY.")
    return providers


def get_provider() -> tuple[str, str, BaseLLMProvider]:
    """Lấy provider ưu tiên số 1."""
    providers = get_available_providers()
    return providers[0]


def make_provider(name: str, model: str | None = None) -> tuple[str, str, BaseLLMProvider]:
    """Create the explicitly requested provider and read its key from the environment."""
    if name == "gemini":
        selected_model = model or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Missing GEMINI_API_KEY")
        return name, selected_model, GeminiProvider(model=selected_model, api_key=api_key)
    if name == "openai":
        selected_model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("Missing OPENAI_API_KEY")
        return name, selected_model, OpenAICompatibleProvider(
            model=selected_model, api_key=api_key, base_url="https://api.openai.com/v1"
        )
    if name == "openrouter":
        selected_model = model or os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise RuntimeError("Missing OPENROUTER_API_KEY")
        return name, selected_model, OpenAICompatibleProvider(
            model=selected_model,
            api_key=api_key,
            base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
        )
    if name == "anthropic":
        selected_model = model or os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError("Missing ANTHROPIC_API_KEY")
        return name, selected_model, AnthropicProvider(model=selected_model, api_key=api_key)
    raise ValueError(f"Unknown provider: {name}")
