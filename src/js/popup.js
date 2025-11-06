/* ==========================================================
   DAYPILOT - POPUP MODULE
   Chức năng: Hiển thị, xử lý popup thêm / sửa / xóa lịch
   - Hỗ trợ thêm loại lịch mới ngay trong popup
   - Đồng bộ hoàn toàn với Firestore qua module Storage
========================================================== */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";

export const Popup = {
  // Dữ liệu hiện tại
  schedules: [],
  types: [],
  typeColors: {},

  // Khởi tạo dữ liệu từ Firestore
  init(data) {
    this.schedules = data.schedules;
    this.types = data.types;
    this.typeColors = data.typeColors;
    this.bindPopupEvents();
  },

  // Cập nhật danh sách loại trong ô chọn
  updateTypeOptions() {
    const select = document.getElementById("typeSelect");
    select.innerHTML = "";

    // Thêm từng loại lịch hiện có
    this.types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      select.appendChild(opt);
    });

    // Tùy chọn "Tạo loại mới"
    const optNew = document.createElement("option");
    optNew.value = "new";
    optNew.textContent = "+ Tạo loại mới";
    select.appendChild(optNew);

    // Hiển thị hoặc ẩn ô nhập loại mới
    select.onchange = () => {
      const newBox = document.getElementById("newTypeBox");
      if (select.value === "new") newBox.classList.remove("hidden");
      else newBox.classList.add("hidden");
    };
  },

  // Hiển thị popup thêm lịch (đã fix đồng bộ loại lịch)
  async showAddPopup() {
    // Luôn tải lại dữ liệu mới nhất từ Firestore để cập nhật loại lịch
    const data = await Storage.load();
    this.types = data.types;
    this.typeColors = data.typeColors;

    document.getElementById("popupOverlay").classList.remove("hidden");
    document.getElementById("saveScheduleBtn").classList.remove("hidden");
    this.updateTypeOptions();
  },

  // Ẩn popup
  hidePopup() {
    document.getElementById("popupOverlay").classList.add("hidden");
  },

  // Lưu lịch mới
  saveNewSchedule() {
    const title = document.getElementById("titleInput").value;
    const startDate = document.getElementById("startDateInput").value;
    const endDate = document.getElementById("endDateInput").value;
    const startTime = document.getElementById("startTimeInput").value;
    const endTime = document.getElementById("endTimeInput").value;
    const note = document.getElementById("noteInput").value;
    let type = document.getElementById("typeSelect").value;

    // Kiểm tra hợp lệ
    if (!title || !startDate || !endDate || !startTime || !endTime) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
      return;
    }

    // Nếu người dùng chọn "Tạo loại mới"
    if (type === "new") {
      const newType = document.getElementById("newTypeInput").value.trim();
      if (newType) {
        const randomColor = Utils.randomColor();
        this.typeColors[newType] = randomColor;
        this.types.push(newType);
        type = newType;
      }
    }

    // Thêm lịch mới
    this.schedules.push({ title, startDate, endDate, startTime, endTime, note, type });

    // Lưu lại lên Firestore
    Storage.save({
      schedules: this.schedules,
      types: this.types,
      typeColors: this.typeColors
    });

    // Gửi sự kiện render lại
    document.dispatchEvent(new CustomEvent("rerenderCalendar"));
    this.hidePopup();
  },

  // Hiển thị popup chỉnh sửa lịch (đã fix đồng bộ loại lịch)
  async showEditPopup(index) {
    // Luôn lấy dữ liệu loại lịch mới nhất
    const data = await Storage.load();
    this.types = data.types;
    this.typeColors = data.typeColors;

    const s = this.schedules[index];
    this.updateTypeOptions();
    document.getElementById("popupOverlay").classList.remove("hidden");

    // Điền dữ liệu sẵn
    document.getElementById("titleInput").value = s.title;
    document.getElementById("startDateInput").value = s.startDate;
    document.getElementById("endDateInput").value = s.endDate;
    document.getElementById("startTimeInput").value = s.startTime;
    document.getElementById("endTimeInput").value = s.endTime;
    document.getElementById("noteInput").value = s.note;
    document.getElementById("typeSelect").value = s.type;

    // Ẩn nút "Lưu"
    document.getElementById("saveScheduleBtn").classList.add("hidden");

    // Nếu chưa có nút cập nhật thì thêm vào
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

    // Khi bấm nút cập nhật
    updateBtn.onclick = () => {
      const title = document.getElementById("titleInput").value;
      const startDate = document.getElementById("startDateInput").value;
      const endDate = document.getElementById("endDateInput").value;
      const startTime = document.getElementById("startTimeInput").value;
      const endTime = document.getElementById("endTimeInput").value;
      const note = document.getElementById("noteInput").value;
      const type = document.getElementById("typeSelect").value;

      if (!title || !startDate || !endDate || !startTime || !endTime) {
        alert("Vui lòng nhập đủ thông tin!");
        return;
      }

      if (new Date(endDate) < new Date(startDate)) {
        alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
        return;
      }

      // Cập nhật lại dữ liệu
      this.schedules[index] = { title, startDate, endDate, startTime, endTime, note, type };

      // Lưu lên Firestore
      Storage.save({
        schedules: this.schedules,
        types: this.types,
        typeColors: this.typeColors
      });

      document.dispatchEvent(new CustomEvent("rerenderCalendar"));
      this.hidePopup();

      // Hiện lại nút Lưu, ẩn nút Cập nhật
      document.getElementById("saveScheduleBtn").classList.remove("hidden");
      updateBtn.remove();
    };
  },

  // Xóa lịch
  deleteSchedule(index) {
    if (confirm("Bạn có chắc muốn xóa lịch này?")) {
      this.schedules.splice(index, 1);
      Storage.save({
        schedules: this.schedules,
        types: this.types,
        typeColors: this.typeColors
      });
      document.dispatchEvent(new CustomEvent("rerenderCalendar"));
    }
  },

  // Gắn sự kiện cho popup
  bindPopupEvents() {
    const addBtn = document.getElementById("addScheduleBtn");
    const saveBtn = document.getElementById("saveScheduleBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const overlay = document.getElementById("popupOverlay");

    if (addBtn) addBtn.onclick = () => this.showAddPopup();
    if (saveBtn) saveBtn.onclick = () => this.saveNewSchedule();
    if (cancelBtn) cancelBtn.onclick = () => this.hidePopup();

    // Đóng popup khi bấm ra ngoài nền tối
    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target.id === "popupOverlay") this.hidePopup();
      };
    }
  }
};