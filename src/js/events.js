/* ==========================================================
   DAYPILOT - EVENTS MODULE
   Chức năng:
   - Gắn các sự kiện toàn cục giữa giao diện và các module
   - Bao gồm: lọc lịch, thay đổi chế độ xem, chuyển dạng hiển thị
   - Kết nối Category, Calendar, Popup, Storage
========================================================== */

import { Storage } from "./storage.js";
import { Calendar } from "./calendar.js";
import { Category } from "./category.js";
import { Popup } from "./popup.js";
import { Utils } from "./utils.js";

export function bindGlobalEvents() {

  /* ==========================================================
     1. SỰ KIỆN CHỌN NGÀY TỪ Ô NHẬP DATE
  ========================================================== */
  const dateFilter = document.getElementById("dateFilter");
  if (dateFilter) {
    dateFilter.addEventListener("change", (e) => {
      const date = e.target.value;
      Calendar.updateFilterDate(date);
    });
  }

  /* ==========================================================
     2. NÚT "HÔM NAY" – ĐẶT LẠI NGÀY VỀ HIỆN TẠI
  ========================================================== */
  const todayBtn = document.getElementById("todayBtn");
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      const today = Utils.today();
      const dateInput = document.getElementById("dateFilter");
      if (dateInput) dateInput.value = today;
      Calendar.updateFilterDate(today);
    });
  }

  /* ==========================================================
     3. RADIO THAY ĐỔI CHẾ ĐỘ XEM (NGÀY / TUẦN / THÁNG)
  ========================================================== */
  document.querySelectorAll('input[name="viewMode"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const mode = e.target.value;
      Calendar.updateViewMode(mode);
    });
  });

  /* ==========================================================
     4. NÚT CHUYỂN GIỮA LIST VIEW / GRID VIEW
  ========================================================== */
  const toggleBtn = document.getElementById("toggleViewBtn");
  if (toggleBtn) {
    toggleBtn.onclick = () => Calendar.toggleView();
  }

  /* ==========================================================
     5. NÚT THÊM LỊCH MỚI (MỞ POPUP)
  ========================================================== */
  const addScheduleBtn = document.getElementById("addScheduleBtn");
  if (addScheduleBtn) {
    addScheduleBtn.onclick = () => Popup.showAddPopup();
  }

  /* ==========================================================
     6. LỌC THEO LOẠI LỊCH (NHẬN SỰ KIỆN TỪ CATEGORY)
  ========================================================== */
  document.addEventListener("filterType", async (e) => {
    const type = e.detail;
    const data = await Storage.load();

    Calendar.schedules = Array.isArray(data.schedules) ? data.schedules : [];
    Calendar.currentFilterType = type;

    if (Calendar.currentLayout === "grid") {
      Calendar.applyGridFilter(); // chỉ lọc lại trong grid
    } else {
      Calendar.renderListView();  // render lại danh sách
    }
  });

  /* ==========================================================
     7. HIỂN THỊ TẤT CẢ LỊCH (RESET LỌC LOẠI)
  ========================================================== */
  document.addEventListener("filterAll", async () => {
    const data = await Storage.load();

    Calendar.schedules = Array.isArray(data.schedules) ? data.schedules : [];
    Calendar.currentFilterType = null;

    if (Calendar.currentLayout === "grid") {
      Calendar.applyGridFilter();
    } else {
      Calendar.renderListView();
    }
  });

  /* ==========================================================
     8. RERENDER TOÀN BỘ SAU KHI THÊM / SỬA / XÓA
  ========================================================== */
  document.addEventListener("rerenderCalendar", async () => {
    const data = await Storage.load();

    Calendar.schedules = Array.isArray(data.schedules) ? data.schedules : [];
    Calendar.typeColors = data.typeColors || {};
    Calendar.renderListView();
  });

  /* ==========================================================
     9. ĐIỀU HƯỚNG LỊCH DẠNG GRID (THÁNG/TRƯỚC, SAU)
  ========================================================== */
  const prevGridBtn = document.getElementById("prevGridBtn");
  const nextGridBtn = document.getElementById("nextGridBtn");

  if (prevGridBtn) prevGridBtn.onclick = () => Calendar.prevGrid();
  if (nextGridBtn) nextGridBtn.onclick = () => Calendar.nextGrid();
}