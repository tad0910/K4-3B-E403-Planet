# Eval - Track B2

Golden set la `golden_set.json`. Script `run_eval.py` danh cho system prompt-only: khong import tool declaration va khong bat buoc tool call. Moi ket qua live duoc ghi thanh mot JSON moi trong `eval/runs/`, gom ca case pass, fail va provider error.

## Chay khi co API key

```powershell
python eval/run_eval.py --version v1 --provider gemini --model gemini-1.5-flash
```

Provider doc key duoc doc tu file `.env` o root repo; xem `.env.example`. Sau moi lan chay, `eval/runs/` nhan ca `<run_id>.json` (chi tiet tung case) va `<run_id>.md` (report: thu bao nhieu, dung bao nhieu, sai bao nhieu, provider error bao nhieu).

Neu muon kiem tra offline mot tap output da luu:

```powershell
python eval/run_eval.py --version v1 --responses eval/fixtures/responses.json
```

Khong thay doi `quality_bar.md` sau lan do dau tien. Quy trinh moi vong: chay tron bo, doc summary, chon mot failure nghiem trong nhat, sua prompt, chay lai tron bo.