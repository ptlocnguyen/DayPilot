# 🌤️ DayPilot – Ứng dụng quản lý lịch cá nhân (Personal Schedule Manager)

---

## 🧭 Giới thiệu

**DayPilot** là dự án web cá nhân được xây dựng bằng **HTML + CSS + JavaScript**  
nhằm giúp người dùng **quản lý lịch trình cá nhân, công việc, học tập và sức khỏe** một cách trực quan và linh hoạt.

Ứng dụng được thiết kế để có thể **mở rộng dần theo từng giai đoạn**,  
và hướng tới mục tiêu **đồng bộ hóa dữ liệu với Google Drive** trong các bước tiếp theo.

---

## 🌟 Các tính năng hiện tại (đến Giai đoạn 8C)

### 🧩 Giao diện & Cấu trúc
- Giao diện hiện đại, rõ ràng, thân thiện với người dùng.  
- Cấu trúc chia tách:
DayPilot/
├── index.html
├── src/
│ ├── css/style.css
│ └── js/main.js
└── data/sample_data.json
- Sử dụng `localStorage` để lưu tạm dữ liệu trên trình duyệt.

---

### 📅 Quản lý lịch trình
✅ **Thêm / Sửa / Xóa lịch** qua popup hiển thị giữa màn hình  
✅ Chọn **thời gian bắt đầu – kết thúc** → tự động tính **thời lượng hoạt động**  
✅ Ghi chú chi tiết cho từng hoạt động  
✅ Hỗ trợ **nhiều loại lịch**: *Công việc, Học tập, Sức khỏe, Cá nhân...*  
✅ Có thể **tạo thêm loại lịch mới**, hệ thống tự gán màu riêng  

---

### 🌈 Giao diện màu & phân loại
- Mỗi loại lịch có **màu đặc trưng** riêng (tự sinh nếu tạo mới).  
- Thanh bên trái (**Sidebar**) hiển thị danh sách loại lịch cùng **chấm màu nhận diện**.  
- Nhấn vào từng loại → hiển thị riêng các hoạt động thuộc loại đó.

---

### 🕒 Bộ lọc thời gian thông minh
- Lọc lịch theo:
- **Ngày cụ thể** (Daily View)  
- **Tuần đang chọn** (Weekly View)  
- **Tháng đang chọn** (Monthly View)  
- Nút **📅 Hôm nay** để quay lại nhanh ngày hiện tại.

---

### 🧭 Chuyển đổi chế độ hiển thị
- **List View:** hiển thị lịch dạng danh sách, có đầy đủ chi tiết từng hoạt động.  
- **Grid View:** hiển thị dạng lưới tháng/tuần trực quan (7 cột, 5 hàng).  
- Có thể:
- Chuyển **qua lại giữa 2 chế độ**
- Duyệt **tháng trước / tháng sau / tuần trước / tuần sau**
- Chọn chế độ xem **“Xem theo tháng” hoặc “Xem theo tuần”**
- Click vào ngày trong grid → xem chi tiết lịch của ngày đó ở dạng danh sách.

---

### 🪟 Popup quản lý
- Form popup có hiệu ứng tối nền.  
- Cho phép:
- Nhập tiêu đề, ngày, giờ bắt đầu/kết thúc, ghi chú.  
- Chọn hoặc tạo loại lịch mới.  
- Hủy / lưu / cập nhật trực tiếp.

---

### 🧠 Kỹ thuật & Lưu trữ
- Toàn bộ dữ liệu lịch, loại lịch và màu sắc được lưu trong **`localStorage`**.  
- Không cần backend, có thể chạy trực tiếp trên trình duyệt hoặc GitHub Pages.  
- Code có **chú thích rõ ràng** ở từng phần:  
- Cấu trúc HTML  
- CSS theo module (sidebar, popup, grid, responsive)  
- JS chia logic (render, CRUD, grid navigation, localStorage)

---

## 📈 Hướng phát triển tiếp theo (Giai đoạn 9+)

| Giai đoạn | Mục tiêu |
|------------|----------|
| **9. Notification System** | Thêm nhắc nhở trước giờ hoạt động (dùng Notification API) |
| **10. Responsive hoàn chỉnh** | Giao diện tự co giãn đẹp trên điện thoại |
| **11. Cloud Sync** | Lưu & đồng bộ dữ liệu với Google Drive hoặc Firebase |
| **12. Theme Customization** | Cho phép người dùng chọn Dark Mode / Light Mode |
| **13. Xuất / nhập dữ liệu** | Xuất `.json` hoặc `.ics` để backup lịch cá nhân |

---

## ⚙️ Công nghệ sử dụng
| Thành phần | Công nghệ |
|-------------|-----------|
| Giao diện | HTML5, CSS3 (Flex, Grid, Responsive) |
| Logic & Dữ liệu | JavaScript ES6, LocalStorage |
| Biểu tượng | Emoji / Unicode |
| IDE | VS Code |
| Quản lý mã nguồn | Git + GitHub |

---

## 🚀 Cách chạy dự án

1. Clone project:
 ```bash
 git clone https://github.com/<username>/DayPilot.git
