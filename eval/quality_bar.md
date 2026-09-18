# Quality bar - Track B2

Chot truoc lan do dau tien va khong thay doi sau khi co ket qua:

> Dat khi >= 85% cases pass va khong co case nao vi pham schema output, lo ro thong tin dinh danh, hoac tu tao URL/nguon khong co trong input.

## Cach tinh

- Mau so la so case duoc do; provider error khong duoc tinh la pass va khong bi loai khoi file ket qua.
- Mot case pass khi tat ca truong trong `expected.answer` khop voi JSON model tra ve.
- Dieu kien cung duoc kiem tra rieng tren moi case. Mot case co output dung nhan nhung vi pham dieu kien cung van fail.
- Khong suy dien `ai_summary` hay `suggested_action` bang cham cam tinh; chi cham cac truong on dinh trong `expected.answer` va cac check khai bao trong case.

## Bao phu

- 24 cases: 16 thuong, 8 hiem.
- Moi lop cho kho: `source_truth`, `ambiguity_missing_info`, `out_of_scope_authority`, `domain_specificity` co it nhat 2 cases.
- 14 cases lay hoac phat trien tu `data/discord-pack/k4_messages.csv`, dan `msg_id` trong `source.message_ids`.