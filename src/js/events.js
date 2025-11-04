/* ==========================================================
   DAYPILOT - EVENTS MODULE (FINAL VERSION)
   Quản lý các sự kiện toàn cục (lọc, hiển thị, view)
========================================================== */

import { Storage } from "./storage.js";
import { Calendar } from "./calendar.js";
import { Category } from "./category.js";
import { Popup } from "./popup.js";
import { Utils } from "./utils.js";

export function bindGlobalEvents() {
    // --- Chọn ngày ---
    const dateFilter = document.getElementById("dateFilter");
    if (dateFilter) {
        dateFilter.addEventListener("change", (e) => {
            const date = e.target.value;
            Calendar.updateFilterDate(date);
        });
    }

    // --- Nút hôm nay ---
    const todayBtn = document.getElementById("todayBtn");
    if (todayBtn) {
        todayBtn.addEventListener("click", () => {
            const today = Utils.today();
            const dateInput = document.getElementById("dateFilter");
            if (dateInput) dateInput.value = today;
            Calendar.updateFilterDate(today);
        });
    }

    // --- Đổi chế độ xem ---
    document.querySelectorAll('input[name="viewMode"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
            const mode = e.target.value;
            Calendar.updateViewMode(mode);
        });
    });

    // --- Chuyển dạng xem ---
    const toggleBtn = document.getElementById("toggleViewBtn");
    if (toggleBtn) toggleBtn.onclick = () => Calendar.toggleView();

    // --- Thêm lịch ---
    const addScheduleBtn = document.getElementById("addScheduleBtn");
    if (addScheduleBtn) addScheduleBtn.onclick = () => Popup.showAddPopup();

    // --- Lọc theo loại lịch ---
    document.addEventListener("filterType", async (e) => {
        const type = e.detail;
        const data = await Storage.load();
        Calendar.schedules = Array.isArray(data.schedules) ? data.schedules : [];
        Calendar.currentFilterType = type;

        if (Calendar.currentLayout === "grid") {
            Calendar.applyGridFilter(); // ✅ chỉ lọc, không render lại
        } else {
            Calendar.renderListView();
        }
    });

    // --- Lọc tất cả lịch ---
    document.addEventListener("filterAll", async () => {
        const data = await Storage.load();
        Calendar.schedules = Array.isArray(data.schedules) ? data.schedules : [];
        Calendar.currentFilterType = null;

        if (Calendar.currentLayout === "grid") {
            Calendar.applyGridFilter(); // ✅ chỉ lọc, không render lại
        } else {
            Calendar.renderListView();
        }
    });

    // --- Render lại toàn bộ sau khi thêm/sửa/xóa ---
    document.addEventListener("rerenderCalendar", async () => {
        const data = await Storage.load();
        Calendar.schedules = Array.isArray(data.schedules) ? data.schedules : [];
        Calendar.typeColors = data.typeColors || {};
        Calendar.renderListView();
    });

    // --- Nút điều hướng grid ---
    const prevGridBtn = document.getElementById("prevGridBtn");
    const nextGridBtn = document.getElementById("nextGridBtn");
    if (prevGridBtn) prevGridBtn.onclick = () => Calendar.prevGrid();
    if (nextGridBtn) nextGridBtn.onclick = () => Calendar.nextGrid();
}