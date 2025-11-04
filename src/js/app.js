import { Storage } from "./storage.js";
import { Utils } from "./utils.js";
import { Category } from "./category.js";
import { Calendar } from "./calendar.js";
import { Popup } from "./popup.js";
import { bindGlobalEvents } from "./events.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // 🔹 1. Chỉ cần load dữ liệu từ backend Drive
    const data = await Storage.load();

    // 🔹 2. Khởi tạo toàn bộ module
    Category.init(data);
    Calendar.init(data);
    Popup.init(data);
    bindGlobalEvents();

    // 🔹 3. Thiết lập ngày mặc định (hôm nay)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const dateInput = document.getElementById("dateFilter");
    if (dateInput) dateInput.value = todayStr;

    Calendar.updateFilterDate(todayStr);
    Calendar.currentFilterType = null;

    const allItem = document.querySelector("#scheduleList li");
    if (allItem) allItem.classList.add("active");

    console.log("%c✅ DayPilot đã khởi động thành công (backend Firestore).", "color: #10b981; font-weight: bold;");
  } catch (err) {
    console.error("❌ Lỗi khởi tạo ứng dụng:", err);
  }
});