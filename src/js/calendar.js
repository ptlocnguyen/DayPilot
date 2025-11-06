/* ==========================================================
   DAYPILOT - CALENDAR MODULE
   Chức năng:
   - Quản lý hiển thị lịch ở dạng danh sách (list) và dạng lưới (grid)
   - Lọc theo loại lịch, theo ngày / tuần / tháng
   - Đồng bộ hoàn toàn với Firestore qua Storage
========================================================== */

import { Utils } from "./utils.js";
import { Storage } from "./storage.js";

export const Calendar = {
  currentFilterType: null,     // loại lịch đang được lọc (nếu có)
  currentFilterDate: "",       // ngày đang được chọn
  currentViewMode: "day",      // chế độ xem (day, week, month)
  schedules: [],               // danh sách lịch
  typeColors: {},              // màu của từng loại lịch
  currentLayout: "list",       // layout hiện tại (list hoặc grid)
  gridDate: new Date(),        // mốc ngày hiện tại cho grid
  gridMode: "month",           // chế độ hiển thị grid

  // Khởi tạo module khi app.js gọi
  init(data) {
    this.schedules = data.schedules || [];
    this.typeColors = data.typeColors || {};
    this.renderListView();
  },

  // Tải lại dữ liệu mới nhất từ Firestore
  async reloadData() {
    const data = await Storage.load();
    this.schedules = data.schedules || [];
    this.typeColors = data.typeColors || {};
  },

  // Hiển thị lịch ở dạng danh sách
  renderListView() {
    const container = document.getElementById("scheduleContainer");
    container.innerHTML = "";

    if (!Array.isArray(this.schedules)) {
      console.warn("Dữ liệu lịch chưa sẵn sàng:", this.schedules);
      this.schedules = [];
    }

    let data = this.schedules;

    // Lọc theo loại lịch
    if (this.currentFilterType) {
      data = data.filter(item => item.type === this.currentFilterType);
    }

    // Nếu chưa có ngày lọc, mặc định là hôm nay
    if (!this.currentFilterDate) {
      this.currentFilterDate = Utils.today();
    }

    // Lọc theo chế độ xem (ngày / tuần / tháng)
    if (this.currentFilterDate) {
      const selected = new Date(this.currentFilterDate);

      if (this.currentViewMode === "day") {
        data = data.filter(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          return selected >= start && selected <= end;
        });
      } else if (this.currentViewMode === "week") {
        const startWeek = new Date(selected);
        const endWeek = new Date(selected);
        endWeek.setDate(startWeek.getDate() + 6);
        data = data.filter(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          return end >= startWeek && start <= endWeek;
        });
      } else if (this.currentViewMode === "month") {
        const y = selected.getFullYear();
        const m = selected.getMonth();
        const startOfMonth = new Date(y, m, 1);
        const endOfMonth = new Date(y, m + 1, 0);
        data = data.filter(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          return start <= endOfMonth && end >= startOfMonth;
        });
      }
    }

    // Không có lịch phù hợp
    if (data.length === 0) {
      container.innerHTML = `<p style="color:#777;">Không có lịch nào phù hợp.</p>`;
      return;
    }

    // Sắp xếp lịch theo thời gian
    data.sort((a, b) => {
      const aStart = new Date(a.startDate);
      const bStart = new Date(b.startDate);
      if (aStart.getTime() === bStart.getTime()) {
        return (a.startTime || "").localeCompare(b.startTime || "");
      }
      return aStart - bStart;
    });

    // Gom nhóm theo ngày
    const groups = {};
    data.forEach(item => {
      const key = item.startDate;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    // Hiển thị từng nhóm ngày
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(date => {
      const dateObj = new Date(date);
      const options = { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" };
      const dateLabel = dateObj.toLocaleDateString("vi-VN", options);

      const dayTitle = document.createElement("h3");
      dayTitle.className = "day-group-title";
      dayTitle.textContent = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
      container.appendChild(dayTitle);

      groups[date].forEach(item => {
        const globalIndex = this.schedules.indexOf(item);
        const div = document.createElement("div");
        div.className = "schedule-card";
        div.style.borderLeft = `5px solid ${this.typeColors[item.type] || "#3b82f6"}`;
        div.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="color:${this.typeColors[item.type] || "#3b82f6"}">${item.title}</h3>
            <div>
              <button class="edit-btn" data-index="${globalIndex}">✏️</button>
              <button class="delete-btn" data-index="${globalIndex}">🗑️</button>
            </div>
          </div>
          <p><b>Ngày:</b> ${item.startDate} → ${item.endDate}</p>
          <p><b>Thời gian:</b> ${item.startTime} → ${item.endTime}</p>
          <p><b>Thời lượng:</b> ${Utils.calcDuration(item.startTime, item.endTime)}</p>
          ${item.note ? `<p>${item.note}</p>` : ""}
          <p><b>Loại:</b> <span style="color:${this.typeColors[item.type] || "#2563eb"}">${item.type}</span></p>
        `;
        container.appendChild(div);
      });
    });

    // Gắn sự kiện sửa / xóa cho các nút
    this.bindEditDeleteEvents();

    // Cuộn lên đầu danh sách
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Gắn sự kiện sửa / xóa cho từng lịch
  bindEditDeleteEvents() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute("data-index"));
        import("./popup.js").then(m => m.Popup.showEditPopup(index));
      };
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute("data-index"));
        import("./popup.js").then(m => m.Popup.deleteSchedule(index));
      };
    });
  },

  // Hiển thị lịch ở dạng lưới (Grid view)
  async renderGridView(highlightDate = null) {
    const gridContainer = document.getElementById("gridContainer");
    const gridTitle = document.getElementById("gridTitle");
    gridContainer.innerHTML = "";

    // Lấy dữ liệu mới nhất từ Firestore
    const data = await Storage.load();
    this.schedules = data.schedules || [];
    this.typeColors = data.typeColors || {};

    const year = this.gridDate.getFullYear();
    const month = this.gridDate.getMonth();
    const days = [];

    // Tạo danh sách ngày
    if (this.gridMode === "month") {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const offset = firstDay.getDay();
      for (let i = 0; i < offset; i++) days.push(null);
      for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
      gridTitle.textContent = `Tháng ${month + 1} / ${year}`;
    } else {
      const startOfWeek = new Date(this.gridDate);
      startOfWeek.setDate(this.gridDate.getDate() - this.gridDate.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push(d);
      }
      gridTitle.textContent = `Tuần của ${startOfWeek.toLocaleDateString("vi-VN")}`;
    }

    gridContainer.style.gridTemplateColumns = "repeat(7, 1fr)";

    // Tạo từng ô ngày
    days.forEach(date => {
      const cell = document.createElement("div");
      cell.className = "day-cell";
      if (!date) return gridContainer.appendChild(cell);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      cell.dataset.date = dateStr;

      const label = document.createElement("div");
      label.className = "date";
      label.textContent = dd;

      // Đánh dấu hôm nay
      if (dateStr === Utils.today()) cell.classList.add("today-cell");

      // Lấy các sự kiện của ngày đó
      let events = this.schedules.filter(e => {
        const d = new Date(dateStr);
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        return d >= start && d <= end;
      });

      const list = document.createElement("div");
      events.forEach(ev => {
        const eDiv = document.createElement("div");
        eDiv.className = "event";
        eDiv.dataset.type = ev.type;
        eDiv.style.borderColor = this.typeColors[ev.type] || "#3b82f6";
        eDiv.textContent = ev.title;
        list.appendChild(eDiv);
      });

      // Khi click vào ô ngày -> chuyển về list view
      cell.onclick = () => {
        const dateInput = document.getElementById("dateFilter");
        if (dateInput) dateInput.value = dateStr;
        this.currentFilterDate = dateStr;
        this.currentLayout = "list";

        document.getElementById("scheduleContainer").classList.remove("hidden");
        document.getElementById("gridContainer").classList.add("hidden");
        document.getElementById("gridHeader").classList.add("hidden");
        document.getElementById("toggleViewBtn").textContent = "Chuyển sang dạng lưới";

        this.renderListView();
      };

      cell.appendChild(label);
      cell.appendChild(list);
      gridContainer.appendChild(cell);
    });

    // Lọc loại lịch nếu đang chọn
    this.applyGridFilter();

    // Đánh dấu ngày được chọn (nếu có)
    if (highlightDate) this.highlightSelectedDate(highlightDate);
  },

  // Lọc loại lịch trong grid view
  applyGridFilter() {
    const allEvents = document.querySelectorAll(".event");
    const filter = this.currentFilterType;

    allEvents.forEach(ev => {
      const type = ev.dataset.type;
      if (!filter || type === filter) ev.style.display = "block";
      else ev.style.display = "none";
    });
  },

  // Chuyển đổi giữa list view và grid view
  toggleView() {
    const scheduleContainer = document.getElementById("scheduleContainer");
    const gridContainer = document.getElementById("gridContainer");
    const gridHeader = document.getElementById("gridHeader");
    const toggleBtn = document.getElementById("toggleViewBtn");

    const today = Utils.today();
    this.currentFilterDate = today;
    const dateInput = document.getElementById("dateFilter");
    if (dateInput) dateInput.value = today;

    if (this.currentLayout === "list") {
      this.currentLayout = "grid";
      scheduleContainer.classList.add("hidden");
      gridContainer.classList.remove("hidden");
      gridHeader.classList.remove("hidden");
      toggleBtn.textContent = "Quay lại dạng danh sách";

      const weekRadio = document.querySelector('input[name="viewMode"][value="week"]');
      if (this.currentViewMode === "day" && weekRadio) {
        weekRadio.checked = true;
        this.currentViewMode = "week";
      }

      this.gridMode = this.currentViewMode;
      this.gridDate = new Date();
      this.renderGridView(today);
    } else {
      this.currentLayout = "list";
      scheduleContainer.classList.remove("hidden");
      gridContainer.classList.add("hidden");
      gridHeader.classList.add("hidden");
      toggleBtn.textContent = "Chuyển sang dạng lưới";
      this.renderListView();
    }
  },

  // Điều hướng grid sang tháng hoặc tuần trước
  prevGrid() {
    this.gridDate.setDate(this.gridDate.getDate() - (this.gridMode === "month" ? 30 : 7));
    this.renderGridView();
  },

  // Điều hướng grid sang tháng hoặc tuần kế tiếp
  nextGrid() {
    this.gridDate.setDate(this.gridDate.getDate() + (this.gridMode === "month" ? 30 : 7));
    this.renderGridView();
  },

  // Cập nhật ngày lọc (tự động đổi grid khi chuyển tháng/tuần)
  updateFilterDate(date) {
    this.currentFilterDate = date;

    if (this.currentLayout === "grid") {
      const selected = new Date(date);

      if (this.gridMode === "month") {
        const gridMonth = this.gridDate.getMonth();
        const gridYear = this.gridDate.getFullYear();
        const selMonth = selected.getMonth();
        const selYear = selected.getFullYear();

        if (selMonth !== gridMonth || selYear !== gridYear) {
          this.gridDate = new Date(selYear, selMonth, 1);
          this.renderGridView(date);
        } else {
          this.highlightSelectedDate(date);
        }
      } else if (this.gridMode === "week") {
        const startOfWeek = new Date(this.gridDate);
        startOfWeek.setDate(this.gridDate.getDate() - this.gridDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        if (selected < startOfWeek || selected > endOfWeek) {
          this.gridDate = new Date(selected);
          this.renderGridView(date);
        } else {
          this.highlightSelectedDate(date);
        }
      }
    } else {
      this.renderListView();
    }
  },

  // Cập nhật chế độ xem (radio: ngày / tuần / tháng)
  updateViewMode(mode) {
    this.currentViewMode = mode;

    if (!this.currentFilterDate) {
      this.currentFilterDate = Utils.today();
    }

    if (this.currentLayout === "grid") {
      if (mode === "day") {
        this.currentLayout = "list";
        document.getElementById("scheduleContainer").classList.remove("hidden");
        document.getElementById("gridContainer").classList.add("hidden");
        document.getElementById("gridHeader").classList.add("hidden");
        document.getElementById("toggleViewBtn").textContent = "Chuyển sang dạng lưới";
        this.renderListView();
      } else {
        this.gridMode = mode;
        this.renderGridView();
      }
    } else {
      const today = Utils.today();
      this.currentFilterDate = today;
      const dateInput = document.getElementById("dateFilter");
      if (dateInput) dateInput.value = today;
      this.renderListView();
    }
  },

  // Highlight ô ngày đang chọn trong grid view
  highlightSelectedDate(dateStr) {
    document.querySelectorAll(".selected-cell").forEach(cell => cell.classList.remove("selected-cell"));

    const target = document.querySelector(`.day-cell[data-date="${dateStr}"]`);
    if (target) {
      if (dateStr !== Utils.today()) target.classList.add("selected-cell");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};