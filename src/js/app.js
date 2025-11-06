/* ==========================================================
   APP.JS - Điểm khởi động DayPilot (Firestore Backend)
========================================================== */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";
import { Category } from "./category.js";
import { Calendar } from "./calendar.js";
import { Popup } from "./popup.js";
import { bindGlobalEvents } from "./events.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1) Tải dữ liệu từ Firestore
    const data = await Storage.load();

    // 2) Khởi tạo các module
    Category.init(data);
    Calendar.init(data);
    Popup.init(data);
    bindGlobalEvents();

    // 3) Thiết lập ngày mặc định hôm nay
    const todayStr = Utils.today();
    const dateInput = document.getElementById("dateFilter");
    if (dateInput) dateInput.value = todayStr;

    // Cập nhật bộ lọc ngày và loại
    Calendar.updateFilterDate(todayStr);
    Calendar.currentFilterType = null;

    // 4) Chọn mặc định đúng nút "Tất cả lịch"
    // Lưu ý: bỏ hoàn toàn đoạn chọn li đầu tiên (#scheduleList li) trước đây
    const allBtn = document.querySelector(".all-schedule-btn");
    if (allBtn) allBtn.classList.add("active");

    console.log("%c DayPilot đã khởi động thành công (backend Firestore).", "color:#10b981;font-weight:bold;");
  } catch (err) {
    console.error("Lỗi khởi tạo ứng dụng:", err);
  }
});