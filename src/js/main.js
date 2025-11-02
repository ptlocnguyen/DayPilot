/* ==============================================================
   🌤️ DAYPILOT - MAIN.JS
   Phiên bản: Hoàn chỉnh Giai đoạn 8C
   Mô tả: Toàn bộ logic của ứng dụng DayPilot
================================================================ */

/* -----------------------------
   1. KHỞI TẠO DỮ LIỆU CƠ BẢN
------------------------------ */
let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

// Màu mặc định cho các loại lịch
let typeColors = JSON.parse(localStorage.getItem("typeColors")) || {
  work: "#3b82f6",      // xanh dương
  study: "#f97316",     // cam
  health: "#10b981",    // xanh lá
  personal: "#8b5cf6"   // tím
};

let types = Object.keys(typeColors);
let currentFilterDate = "";
let currentViewMode = "day";
let currentLayout = "list";
let gridDate = new Date();      // ngày hiện tại đang xem trong grid
let gridMode = "month";         // "month" hoặc "week"

/* -----------------------------
   2. HÀM LƯU DỮ LIỆU VÀO LOCAL
------------------------------ */
function saveToLocal() {
  localStorage.setItem("schedules", JSON.stringify(schedules));
  localStorage.setItem("types", JSON.stringify(types));
  localStorage.setItem("typeColors", JSON.stringify(typeColors));
}

/* -----------------------------
   3. TÍNH THỜI LƯỢNG HOẠT ĐỘNG
------------------------------ */
function calcDuration(start, end) {
  if (!start || !end) return "";
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (diff < 0) diff += 24 * 60; // nếu qua ngày
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  let txt = "";
  if (hours > 0) txt += `${hours} giờ `;
  if (minutes > 0) txt += `${minutes} phút`;
  return txt.trim();
}

/* -----------------------------
   4. RENDER SIDEBAR (LOẠI LỊCH)
------------------------------ */
function renderSidebar(typeList) {
  const list = document.getElementById("scheduleList");
  list.innerHTML = "";

  // Mục "Tất cả"
  const allItem = document.createElement("li");
  allItem.innerHTML = `📅 <b>Tất cả lịch</b>`;
  allItem.style.color = "#3b82f6";
  allItem.onclick = () => renderSchedules(schedules);
  list.appendChild(allItem);

  // Liệt kê từng loại lịch
  typeList.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="color-dot" style="background:${typeColors[t] || '#ccc'}"></span>
      ${t.charAt(0).toUpperCase() + t.slice(1)}
    `;
    li.onclick = () => filterByType(t);
    list.appendChild(li);
  });
}

/* -----------------------------
   5. LỌC LỊCH THEO LOẠI
------------------------------ */
function filterByType(type) {
  const filtered = schedules.filter(s => s.type === type);
  renderSchedules(filtered);
}

/* -----------------------------
   6. HIỂN THỊ DANH SÁCH LỊCH (LIST VIEW)
------------------------------ */
function renderSchedules(data) {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  // Lọc theo ngày nếu có chọn
  let filteredData = data;
  if (currentFilterDate) {
    const selected = new Date(currentFilterDate);

    if (currentViewMode === "day") {
      filteredData = filteredData.filter(item => item.date === currentFilterDate);
    } else if (currentViewMode === "week") {
      const weekStart = new Date(selected);
      const weekEnd = new Date(selected);
      weekEnd.setDate(weekStart.getDate() + 6);
      filteredData = filteredData.filter(item => {
        const d = new Date(item.date);
        return d >= weekStart && d <= weekEnd;
      });
    } else if (currentViewMode === "month") {
      const month = selected.getMonth();
      const year = selected.getFullYear();
      filteredData = filteredData.filter(item => {
        const d = new Date(item.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }
  }

  if (filteredData.length === 0) {
    container.innerHTML = `<p style="color:#888;">Không có lịch nào để hiển thị.</p>`;
    return;
  }

  filteredData.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "schedule-card";
    card.style.borderLeft = `5px solid ${typeColors[item.type] || "#3b82f6"}`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="color:${typeColors[item.type] || '#3b82f6'}">${item.title}</h3>
        <div>
          <button class="edit-btn" title="Sửa lịch">✏️</button>
          <button class="delete-btn" title="Xóa lịch">🗑</button>
        </div>
      </div>
      <p><b>Ngày:</b> ${item.date}</p>
      <p><b>Thời gian:</b> ${item.startTime} → ${item.endTime}</p>
      <p style="color:#2563eb;"><b>⏱ Thời lượng:</b> ${calcDuration(item.startTime, item.endTime)}</p>
      <p>${item.note}</p>
      <p><b>Loại:</b> <span style="color:${typeColors[item.type]}">${item.type}</span></p>
    `;
    card.querySelector(".edit-btn").onclick = () => editSchedule(index);
    card.querySelector(".delete-btn").onclick = () => deleteSchedule(index);
    container.appendChild(card);
  });
}

/* -----------------------------
   7. HIỂN THỊ LỊCH DẠNG LƯỚI (GRID VIEW)
------------------------------ */
function renderGridView() {
  const grid = document.getElementById("gridContainer");
  grid.innerHTML = "";

  const year = gridDate.getFullYear();
  const month = gridDate.getMonth();
  const gridTitle = document.getElementById("gridTitle");

  gridTitle.textContent =
    gridMode === "month"
      ? `Tháng ${month + 1} / ${year}`
      : `Tuần của ${gridDate.toLocaleDateString("vi-VN")}`;

  const days = [];
  if (gridMode === "month") {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();

    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
  } else {
    const startOfWeek = new Date(gridDate);
    startOfWeek.setDate(gridDate.getDate() - gridDate.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
  }

  grid.style.gridTemplateColumns = "repeat(7, 1fr)";

  days.forEach(date => {
    const cell = document.createElement("div");
    cell.className = "day-cell";
    if (!date) {
      grid.appendChild(cell);
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dateLabel = document.createElement("div");
    dateLabel.className = "date";
    dateLabel.textContent = date.getDate();

    const events = schedules.filter(e => e.date === dateStr);
    const eventsList = document.createElement("div");
    events.forEach(ev => {
      const evDiv = document.createElement("div");
      evDiv.className = "event";
      evDiv.style.borderColor = typeColors[ev.type] || "#3b82f6";
      evDiv.textContent = ev.title;
      eventsList.appendChild(evDiv);
    });

    cell.onclick = () => {
      currentLayout = "list";
      document.getElementById("scheduleContainer").classList.remove("hidden");
      document.getElementById("gridContainer").classList.add("hidden");
      document.getElementById("gridHeader").classList.add("hidden");
      document.getElementById("toggleViewBtn").textContent = "🔄 Chuyển sang dạng lưới";
      currentFilterDate = dateStr;
      document.getElementById("dateFilter").value = dateStr;
      renderSchedules(schedules);
    };

    cell.appendChild(dateLabel);
    cell.appendChild(eventsList);
    grid.appendChild(cell);
  });
}

/* -----------------------------
   8. NÚT THÊM / LƯU LỊCH
------------------------------ */
document.getElementById("addScheduleBtn").onclick = () => {
  document.getElementById("popupOverlay").classList.remove("hidden");
  document.getElementById("addForm").reset;
  document.getElementById("saveScheduleBtn").classList.remove("hidden");
  updateTypeOptions();
};

// Lưu lịch mới
document.getElementById("saveScheduleBtn").onclick = () => {
  const title = document.getElementById("titleInput").value;
  const date = document.getElementById("dateInput").value;
  const startTime = document.getElementById("startTimeInput").value;
  const endTime = document.getElementById("endTimeInput").value;
  const note = document.getElementById("noteInput").value;
  const type = document.getElementById("typeSelect").value;

  if (!title || !date || !startTime || !endTime) {
    alert("Vui lòng nhập đủ thông tin thời gian!");
    return;
  }

  const newSchedule = { title, date, startTime, endTime, note, type };
  schedules.push(newSchedule);
  saveToLocal();
  renderSchedules(schedules);
  document.getElementById("popupOverlay").classList.add("hidden");
};

/* -----------------------------
   9. CẬP NHẬT DANH SÁCH LOẠI LỊCH
------------------------------ */
function updateTypeOptions() {
  const select = document.getElementById("typeSelect");
  select.innerHTML = "";
  types.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });

  // Thêm lựa chọn tạo loại mới
  const optNew = document.createElement("option");
  optNew.value = "new";
  optNew.textContent = "+ Tạo loại mới";
  select.appendChild(optNew);

  select.onchange = () => {
    const newBox = document.getElementById("newTypeBox");
    if (select.value === "new") newBox.classList.remove("hidden");
    else newBox.classList.add("hidden");
  };
}

document.getElementById("addNewTypeBtn").onclick = () => {
  const newType = document.getElementById("newTypeInput").value.trim();
  if (!newType) return;
  if (!types.includes(newType)) {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    typeColors[newType] = randomColor;
    types.push(newType);
    saveToLocal();
    renderSidebar(types);
    updateTypeOptions();
    document.getElementById("typeSelect").value = newType;
  }
  document.getElementById("newTypeInput").value = "";
  document.getElementById("newTypeBox").classList.add("hidden");
};

/* -----------------------------
   10. XÓA LỊCH
------------------------------ */
function deleteSchedule(index) {
  if (confirm("Bạn có chắc muốn xóa lịch này?")) {
    schedules.splice(index, 1);
    saveToLocal();
    renderSchedules(schedules);
  }
}

/* -----------------------------
   11. SỬA LỊCH
------------------------------ */
function editSchedule(index) {
  const s = schedules[index];
  updateTypeOptions();
  document.getElementById("popupOverlay").classList.remove("hidden");

  document.getElementById("titleInput").value = s.title;
  document.getElementById("dateInput").value = s.date;
  document.getElementById("startTimeInput").value = s.startTime;
  document.getElementById("endTimeInput").value = s.endTime;
  document.getElementById("noteInput").value = s.note;
  document.getElementById("typeSelect").value = s.type;

  document.getElementById("saveScheduleBtn").classList.add("hidden");

  let updateBtn = document.getElementById("updateScheduleBtn");
  if (!updateBtn) {
    updateBtn = document.createElement("button");
    updateBtn.id = "updateScheduleBtn";
    updateBtn.textContent = "Cập nhật";
    updateBtn.style.backgroundColor = "#f59e0b";
    updateBtn.style.color = "white";
    updateBtn.style.marginRight = "10px";
    document.getElementById("addForm").insertBefore(updateBtn, document.getElementById("cancelBtn"));
  }

  updateBtn.onclick = () => {
    const title = document.getElementById("titleInput").value;
    const date = document.getElementById("dateInput").value;
    const startTime = document.getElementById("startTimeInput").value;
    const endTime = document.getElementById("endTimeInput").value;
    const note = document.getElementById("noteInput").value;
    const type = document.getElementById("typeSelect").value;

    if (!title || !date || !startTime || !endTime) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    schedules[index] = { title, date, startTime, endTime, note, type };
    saveToLocal();
    renderSchedules(schedules);
    document.getElementById("popupOverlay").classList.add("hidden");
    document.getElementById("saveScheduleBtn").classList.remove("hidden");
    updateBtn.remove();
  };
}

/* -----------------------------
   12. ĐÓNG POPUP
------------------------------ */
document.getElementById("cancelBtn").onclick = () => {
  document.getElementById("popupOverlay").classList.add("hidden");
};

document.getElementById("popupOverlay").onclick = (e) => {
  if (e.target.id === "popupOverlay") {
    document.getElementById("popupOverlay").classList.add("hidden");
  }
};

/* -----------------------------
   13. LỌC LỊCH THEO NGÀY
------------------------------ */
document.getElementById("dateFilter").addEventListener("change", (e) => {
  currentFilterDate = e.target.value;
  renderSchedules(schedules);
});

document.getElementById("todayBtn").addEventListener("click", () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  document.getElementById("dateFilter").value = todayStr;
  currentFilterDate = todayStr;
  renderSchedules(schedules);
});

/* -----------------------------
   14. THAY ĐỔI CHẾ ĐỘ XEM (NGÀY / TUẦN / THÁNG)
------------------------------ */
document.querySelectorAll('input[name="viewMode"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    currentViewMode = e.target.value;
    renderSchedules(schedules);
  });
});

/* -----------------------------
   15. CHUYỂN GIỮA LIST <-> GRID
------------------------------ */
document.getElementById("toggleViewBtn").addEventListener("click", () => {
  if (currentLayout === "list") {
    currentLayout = "grid";
    document.getElementById("scheduleContainer").classList.add("hidden");
    document.getElementById("gridContainer").classList.remove("hidden");
    document.getElementById("gridHeader").classList.remove("hidden");
    document.getElementById("toggleViewBtn").textContent = "↩️ Quay lại dạng danh sách";
    renderGridView();
  } else {
    currentLayout = "list";
    document.getElementById("scheduleContainer").classList.remove("hidden");
    document.getElementById("gridContainer").classList.add("hidden");
    document.getElementById("gridHeader").classList.add("hidden");
    document.getElementById("toggleViewBtn").textContent = "🔄 Chuyển sang dạng lưới";
    renderSchedules(schedules);
  }
});

/* -----------------------------
   16. ĐIỀU HƯỚNG GRID (THÁNG / TUẦN)
------------------------------ */
document.getElementById("prevGridBtn").onclick = () => {
  gridDate.setDate(gridDate.getDate() - (gridMode === "month" ? 30 : 7));
  renderGridView();
};

document.getElementById("nextGridBtn").onclick = () => {
  gridDate.setDate(gridDate.getDate() + (gridMode === "month" ? 30 : 7));
  renderGridView();
};

document.getElementById("todayGridBtn").onclick = () => {
  gridDate = new Date();
  renderGridView();
};

document.getElementById("gridModeSelect").onchange = (e) => {
  gridMode = e.target.value;
  renderGridView();
};

/* -----------------------------
   17. KHỞI TẠO BAN ĐẦU
------------------------------ */
window.onload = () => {
  renderSidebar(types);
  updateTypeOptions();
  renderSchedules(schedules);
};
