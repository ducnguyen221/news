# 🤖📰 Daily AI News

Bản tin AI hằng ngày **tự động tạo** bởi một Claude Code routine (chạy 21:00 giờ VN mỗi tối).
Mỗi tối agent nghiên cứu tin AI ~24–48h qua (WebSearch/WebFetch, nguồn miễn phí), nhóm theo
5 chủ đề và viết tóm tắt **tiếng Việt** (giữ tiêu đề gốc tiếng Anh), xuất ra một file HTML
self-contained rồi commit vào repo này.

## Cấu trúc

```
YYYY/Www/YYYY-MM-DD.html      ví dụ: 2026/W23/2026-06-04.html
```

- `YYYY` — năm ISO (`date +%G`)
- `Www` — tuần ISO trong năm (`date +%V`, ví dụ `W23`)
- File theo ngày: `YYYY-MM-DD.html`

`index.html` ở gốc repo được **dựng lại mỗi ngày**, liệt kê toàn bộ bản tin theo năm → tuần.

## Xem bản tin

Bật GitHub Pages → xem dạng web tại: **https://ducnguyen221.github.io/daily-ai-news/**

## Nhóm tin

1. 🚀 Mô hình & Sản phẩm mới
2. 🛠️ Công cụ & Framework
3. 🔬 Nghiên cứu & Kỹ thuật mới
4. 📈 Hot trend & Thảo luận cộng đồng
5. 🏢 Ngành & Kinh doanh

---
*Tự động tạo — không chỉnh sửa thủ công các file trong thư mục năm/tuần.*
