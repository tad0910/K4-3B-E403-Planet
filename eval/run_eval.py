from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CASES = ROOT / "eval" / "golden_set.json"
DEFAULT_PROMPT = ROOT / "codebase" / "prompts" / "system_prompt.md"
DEFAULT_RUNS = ROOT / "eval" / "runs"
ALLOWED_PRIORITIES = {"MISS_GAP", "TRUNG_BINH", "THAP_FAQ"}
ALLOWED_CATEGORIES = {"CVAT_ENVIRONMENT", "LAB_SUBMISSION", "LOGISTICS_ADMIN", "GENERAL_FAQ"}
ALLOWED_MISSING = {"NONE", "MISSING_LOGS", "MISSING_OS"}
REQUIRED_KEYS = {"priority", "category", "ai_summary", "missing_info", "suggested_action", "requires_admin"}


def load_cases(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    cases = data["cases"]
    if len(cases) < 20:
        raise ValueError("Golden set must contain at least 20 cases")
    for case in cases:
        if not {"id", "class", "input", "expected"}.issubset(case):
            raise ValueError(f"Invalid case shape: {case.get('id', '<missing id>')}")
    return cases


def extract_json(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    text = str(value or "").strip()
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL | re.IGNORECASE)
    candidate = fenced.group(1) if fenced else text
    if not fenced:
        start, end = candidate.find("{"), candidate.rfind("}")
        if start >= 0 and end > start:
            candidate = candidate[start:end + 1]
    parsed = json.loads(candidate)
    if not isinstance(parsed, dict):
        raise ValueError("Model output is not a JSON object")
    return parsed


def evaluate(case: dict[str, Any], raw_output: Any, error: str | None = None) -> dict[str, Any]:
    expected = case["expected"]
    actual: dict[str, Any] | None = None
    failures: list[str] = []
    if error:
        failures.append(error)
    else:
        try:
            actual = extract_json(raw_output)
        except Exception as exc:
            failures.append(f"invalid_json: {type(exc).__name__}: {exc}")

    if actual is not None:
        missing = REQUIRED_KEYS - set(actual)
        if missing:
            failures.append(f"schema missing keys: {sorted(missing)}")
        if actual.get("priority") not in ALLOWED_PRIORITIES:
            failures.append("schema invalid priority")
        if actual.get("category") not in ALLOWED_CATEGORIES:
            failures.append("schema invalid category")
        if actual.get("missing_info") not in ALLOWED_MISSING:
            failures.append("schema invalid missing_info")
        if not isinstance(actual.get("requires_admin"), bool):
            failures.append("schema requires_admin must be boolean")
        for key, expected_value in expected.get("answer", {}).items():
            if actual.get(key) != expected_value:
                failures.append(f"{key}: expected {expected_value!r}, got {actual.get(key)!r}")

        checks = expected.get("checks", {})
        raw_text = json.dumps(actual, ensure_ascii=False)
        if checks.get("forbid_urls") and re.search(r"https?://|www\.", raw_text, re.IGNORECASE):
            failures.append("hard condition: unverified URL in output")
        if re.search(r"\b\d{8,}\b|\b\S+@\S+\.\S+", raw_text):
            failures.append("hard condition: possible PII leak")

    return {
        "passed": not failures,
        "actual": actual,
        "raw_output": raw_output,
        "failures": failures,
    }


def build_user_content(case: dict[str, Any]) -> str:
    ticket = case["input"]
    return """MÃ TICKET: {ticket_id}
TIÊU ĐỀ: {title}
NGƯỜI GỬI: {author}
THỜI GIAN CHỜ: {wait_time_minutes} phút
NỘI DUNG CHI TIẾT:
{content}""".format(**ticket)


def run_provider(prompt: str, content: str, provider_name: str | None, model: str | None) -> tuple[Any, str, str]:
    if not provider_name:
        raise RuntimeError("--provider is required for a live run")
    sys.path.insert(0, str(ROOT))
    from codebase.env_loader import load_dotenv
    from codebase.providers import make_provider

    load_dotenv(ROOT / ".env")
    selected_provider, selected_model, provider = make_provider(provider_name, model)
    return provider.generate_json(prompt, content), selected_provider, selected_model


def summarize_results(results: list[dict[str, Any]]) -> dict[str, Any]:
    provider_errors = [item for item in results if any(f.startswith("provider_error") for f in item["result"]["failures"])]
    measured = [item for item in results if item not in provider_errors]
    passed = sum(1 for item in measured if item["result"]["passed"])
    by_class: dict[str, dict[str, int]] = {}
    for item in results:
        bucket = by_class.setdefault(item["class"], {"attempted": 0, "passed": 0, "failed": 0, "provider_errors": 0})
        bucket["attempted"] += 1
        if any(f.startswith("provider_error") for f in item["result"]["failures"]):
            bucket["provider_errors"] += 1
        elif item["result"]["passed"]:
            bucket["passed"] += 1
        else:
            bucket["failed"] += 1
    total = len(results)
    return {
        "attempted_cases": total,
        "measured_cases": len(measured),
        "provider_error_cases": len(provider_errors),
        "passed_cases": passed,
        "failed_cases": len(measured) - passed,
        "case_accuracy": round(passed / len(measured), 4) if measured else 0.0,
        "quality_bar_passed": len(measured) > 0 and passed / len(measured) >= 0.85 and all(
            not any("hard condition" in failure or "schema" in failure for failure in item["result"]["failures"])
            for item in measured
        ),
        "by_class": by_class,
    }


def write_report(path: Path, payload: dict[str, Any]) -> None:
    summary = payload["summary"]
    lines = [
        f"# Eval report - {payload['run_id']}",
        "",
        f"- Provider: `{payload['provider']}`",
        f"- Model: `{payload.get('model') or 'default'}`",
        f"- Tried: **{summary['attempted_cases']} cases**",
        f"- Correct: **{summary['passed_cases']} cases**",
        f"- Failed: **{summary['failed_cases']} cases**",
        f"- Provider errors: **{summary['provider_error_cases']} cases**",
        f"- Accuracy trên case đo được: **{summary['case_accuracy']:.2%}**",
        f"- Quality bar: **{'PASS' if summary['quality_bar_passed'] else 'FAIL'}**",
        "",
        "## Theo lớp chỗ khó",
        "",
        "| Lớp | Thử | Đúng | Sai | Provider error |",
        "|---|---:|---:|---:|---:|",
    ]
    for name, counts in summary["by_class"].items():
        lines.append(f"| `{name}` | {counts['attempted']} | {counts['passed']} | {counts['failed']} | {counts['provider_errors']} |")
    lines.extend(["", "Số liệu được ghi nguyên trạng từ lần chạy; không loại case lỗi khỏi artifact.", ""])
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Track B2 prompt-only golden set eval.")
    parser.add_argument("--version", required=True)
    parser.add_argument("--provider", choices=["openai", "openrouter", "anthropic", "gemini"], default=None)
    parser.add_argument("--model", default=None)
    parser.add_argument("--cases", type=Path, default=DEFAULT_CASES)
    parser.add_argument("--system-prompt", type=Path, default=DEFAULT_PROMPT)
    parser.add_argument("--runs-dir", type=Path, default=DEFAULT_RUNS)
    parser.add_argument("--responses", type=Path, default=None, help="Offline JSON map: case id -> model output")
    args = parser.parse_args()

    cases = load_cases(args.cases)
    prompt = args.system_prompt.read_text(encoding="utf-8")
    responses = json.loads(args.responses.read_text(encoding="utf-8")) if args.responses else {}
    results: list[dict[str, Any]] = []
    selected_provider = args.provider or ("offline" if args.responses else "unknown")
    selected_model = args.model

    for case in cases:
        print(f"Running {case['id']}...", flush=True)
        error = None
        raw_output: Any = responses.get(case["id"])
        if args.responses is None:
            try:
                raw_output, selected_provider, selected_model = run_provider(prompt, build_user_content(case), args.provider, args.model)
            except Exception as exc:
                error = f"provider_error: {type(exc).__name__}: {exc}"
        elif raw_output is None:
            error = "offline_response_missing"
        result = evaluate(case, raw_output, error)
        results.append({"id": case["id"], "class": case["class"], "rarity": case["rarity"], "source": case["source"], "result": result})

    summary = summarize_results(results)
    now = datetime.now()
    run_id = f"{args.version}_{selected_provider}_{now.strftime('%Y%m%dT%H%M%S%f')}"
    payload = {"run_id": run_id, "version": args.version, "provider": selected_provider, "model": selected_model, "system_prompt": str(args.system_prompt), "cases": str(args.cases), "generated_at": now.isoformat(timespec="seconds"), "summary": summary, "results": results}
    args.runs_dir.mkdir(parents=True, exist_ok=True)
    out_path = args.runs_dir / f"{run_id}.json"
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    report_path = args.runs_dir / f"{run_id}.md"
    write_report(report_path, payload)
    for item in results:
        print(f"{item['id']:<8} {'PASS' if item['result']['passed'] else 'FAIL'}")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    print(f"Saved JSON: {out_path}")
    print(f"Saved report: {report_path}")


if __name__ == "__main__":
    main()