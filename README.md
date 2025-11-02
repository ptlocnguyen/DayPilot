# 🌤️ DayPilot – Ứng dụng quản lý lịch cá nhân (Personal Schedule Manager)

---

## 🧭 Giới thiệu
**DayPilot** là một ứng dụng web cá nhân được xây dựng bằng **HTML, CSS và JavaScript**.  
Mục tiêu là giúp người dùng **quản lý các lịch trình hằng ngày** (công việc, học tập, sức khỏe, cá nhân, v.v.)  
với giao diện thân thiện, nhiều chế độ xem, và khả năng mở rộng dễ dàng.

Dự án được phát triển theo hướng **mở rộng theo giai đoạn**,  
hướng tới việc trở thành **một ứng dụng quản lý lịch thông minh**,  
có thể **đồng bộ với Google Drive** trong các giai đoạn tiếp theo.

---

## 🌟 Các tính năng đã hoàn thành (đến Giai đoạn 8C)

### 🎨 Giao diện & cấu trúc tổng thể
- Thiết kế hiện đại, gọn gàng, responsive cơ bản.  
- Cấu trúc thư mục rõ ràng:
  ```
  DayPilot/
  ├── index.html
  ├── src/
  │   ├── css/
  │   │   └── style.css
  │   └── js/
  │       └── main.js
  └── data/
      └── sample_data.json
  ```
- Tất cả dữ liệu được lưu bằng **localStorage**, không cần backend.

---

### 🗓️ Quản lý lịch
✅ **Thêm / Sửa / Xóa lịch** qua popup hiển thị chính giữa web.  
✅ Nhập **thời gian bắt đầu – kết thúc** → tự động tính **thời lượng hoạt động**.  
✅ Cho phép thêm **ghi chú chi tiết** cho từng hoạt động.  
✅ Chọn hoặc tạo **loại lịch mới** tùy theo nhu cầu.  
✅ Tự động lưu dữ liệu sau khi tạo hoặc chỉnh sửa.

---

### 🌈 Quản lý loại lịch & phân màu
- Mỗi loại lịch có **màu sắc đặc trưng riêng** (định nghĩa sẵn hoặc ngẫu nhiên nếu mới tạo).  
- Sidebar bên trái hiển thị danh sách loại lịch kèm **vòng tròn màu nhận diện**.  
- Người dùng có thể **lọc lịch theo từng loại** dễ dàng.

---

### 🕒 Lọc theo thời gian
- Bộ lọc cho phép xem lịch theo:
  - **Ngày cụ thể (Daily View)**  
  - **Tuần (Weekly View)**  
  - **Tháng (Monthly View)**
- Có nút **📅 “Hôm nay”** để quay về ngày hiện tại nhanh chóng.

---

### 📋 Giao diện xem danh sách (List View)
- Hiển thị chi tiết từng hoạt động: ngày, giờ, thời lượng, ghi chú, loại lịch.  
- Có nút **✏️ Sửa** và **🗑️ Xóa** cho từng hoạt động.  
- Viền màu bên trái của mỗi hoạt động thể hiện **loại lịch**.

---

### 🧭 Giao diện dạng lưới (Grid View)
- Có thể chuyển qua lại giữa **List View** và **Grid View**.  
- Grid View có:
  - **Xem theo tháng hoặc theo tuần.**
  - **Nút điều hướng:** Tháng/tuần trước, sau, hoặc quay lại hôm nay.  
  - **Dropdown chọn chế độ xem:** “Xem theo tháng” / “Xem theo tuần”.
- Khi click vào một ngày bất kỳ → chuyển sang **List View**, hiển thị lịch chi tiết của ngày đó.

---

### 🪟 Popup quản lý
- Popup thêm/sửa/xóa lịch được căn giữa và làm mờ nền.  
- Gồm các trường nhập: Tiêu đề, Ngày, Giờ bắt đầu → kết thúc, Loại, Ghi chú.  
- Có thể thêm **loại lịch mới ngay trong popup**.  
- Dễ thao tác và tự động đóng sau khi lưu.

---

### 💾 Lưu trữ dữ liệu
- Toàn bộ thông tin lịch, loại lịch và màu sắc được lưu trong **LocalStorage** trình duyệt.  
- Dữ liệu **không bị mất khi tải lại trang**.  
- Có thể xóa dữ liệu thủ công qua DevTools > Application > Local Storage.

---

## ⚙️ Hướng dẫn sử dụng

### ▶️ Cách chạy dự án
1. Mở thư mục `DayPilot` trong VS Code.  
2. Mở file `index.html`.  
3. Chuột phải → **Open with Live Server**  
   *(hoặc mở trực tiếp bằng trình duyệt nếu chưa cài Live Server)*  
4. Giao diện sẽ tự hiển thị toàn bộ lịch và sidebar loại lịch.

### 🧱 Dữ liệu mẫu
- Dự án có file mẫu `data/sample_data.json` chứa vài lịch sẵn để thử nghiệm.  
- Khi khởi chạy, dữ liệu trong **localStorage** sẽ được ưu tiên.

---

## 🧠 Các lưu ý quan trọng
| Mục | Lưu ý |
|------|-------|
| **Lưu dữ liệu** | Tất cả dữ liệu được lưu tại localStorage, không cần server. |
| **Reset dữ liệu** | Vào DevTools > Application > Local Storage > Xóa domain. |
| **Không cần backend** | Toàn bộ chạy được trên trình duyệt hoặc GitHub Pages. |
| **Tự động lưu** | Mỗi khi thêm, sửa, xóa, hệ thống tự `saveToLocal()`. |
| **An toàn khi reload** | Dữ liệu vẫn giữ nguyên sau khi F5. |

---

## 💡 Kế hoạch phát triển tiếp theo
| Giai đoạn | Mục tiêu chính | Mô tả |
|------------|----------------|-------|
| **9. Notification System** | Thêm nhắc nhở hoạt động | Dùng Notification API, cảnh báo trước giờ diễn ra |
| **10. Responsive hoàn chỉnh** | Hiển thị đẹp trên mobile | Co giãn grid, popup và sidebar |
| **11. Cloud Sync (Google Drive)** | Lưu dữ liệu thật | Dùng Google Drive API để đồng bộ |
| **12. Theme Customization** | Dark / Light mode | Tùy chỉnh màu nền giao diện |
| **13. Xuất / Nhập dữ liệu** | Sao lưu cá nhân | Xuất `.json` / `.ics`, import lại khi cần |
| **14. Dashboard / Statistics** | Thống kê thời gian | Hiển thị biểu đồ tổng hợp hoạt động |
| **15. Mobile App (React Native)** | Ứng dụng di động | Phiên bản chạy trên Android/iOS |

---

## 🧰 Công nghệ sử dụng
| Thành phần | Công nghệ |
|-------------|------------|
| **Ngôn ngữ** | HTML5, CSS3, JavaScript (ES6) |
| **Lưu trữ** | LocalStorage |
| **IDE** | Visual Studio Code |
| **Quản lý mã nguồn** | Git + GitHub |
| **Hiển thị web** | Live Server / GitHub Pages |
| **Thiết kế UI** | Flexbox, Grid, Popup overlay |

---

## 🚀 Hướng dẫn đẩy code lên GitHub
> ⚠️ Dành cho repo có tên `DayPilot`.

### 1️⃣ Kiểm tra trạng thái thay đổi
```bash
git status
```

### 2️⃣ Thêm tất cả file đã chỉnh sửa
```bash
git add .
```

### 3️⃣ Commit thay đổi
```bash
git commit -m "Hoàn thành Giai đoạn 8C - Grid view, lọc tuần/tháng, chỉnh UI"
```

### 4️⃣ Push code lên GitHub
```bash
git push origin main
```

> Nếu chưa kết nối repo:
> ```bash
> git branch -M main
> git remote add origin https://github.com/<username>/DayPilot.git
> git push -u origin main
> ```

### 5️⃣ Kiểm tra lại trên GitHub
Truy cập:
```
https://github.com/<username>/DayPilot
```
→ bạn sẽ thấy tất cả file `index.html`, `src/`, `README.md`, `data/` hiển thị đầy đủ.

---

## ⚡ Lệnh Git hữu ích
| Lệnh | Chức năng |
|------|------------|
| `git status` | Kiểm tra file thay đổi |
| `git add .` | Thêm tất cả file vào commit |
| `git commit -m "..."` | Lưu thay đổi cục bộ |
| `git push origin main` | Đẩy code lên GitHub |
| `git pull origin main` | Cập nhật code mới nhất |
| `git log --oneline` | Xem lịch sử commit |
| `git restore <file>` | Hoàn tác file chưa commit |
| `git reset --hard HEAD` | Quay lại commit gần nhất (cẩn thận) |

---

## 👨‍💻 Tác giả
**Phan Tôn Lộc Nguyên**  
> 🎓 Sinh viên Khoa Khoa học Máy tính – Trường Đại học Công nghiệp TP.HCM (IUH)  
> 🌐 GitHub: [https://github.com/<username>](https://github.com/<username>)  
> 💡 Mục tiêu: Xây dựng hệ thống quản lý thời gian cá nhân, có thể mở rộng thành ứng dụng thật (Web + Mobile).
