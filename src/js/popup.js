/* ==========================================================
   DAYPILOT - POPUP MODULE
   Nhiệm vụ: Hiển thị và xử lý popup thêm / sửa / xóa lịch
========================================================== */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";

export const Popup = {
    schedules: [],
    types: [],
    typeColors: {},

    init(data) {
        this.schedules = data.schedules;
        this.types = data.types;
        this.typeColors = data.typeColors;
        this.bindPopupEvents();
    },

    // Cập nhật danh sách loại trong select
    updateTypeOptions() {
        const select = document.getElementById("typeSelect");
        select.innerHTML = "";
        this.types.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            select.appendChild(opt);
        });

        const optNew = document.createElement("option");
        optNew.value = "new";
        optNew.textContent = "+ Tạo loại mới";
        select.appendChild(optNew);

        select.onchange = () => {
            const newBox = document.getElementById("newTypeBox");
            if (select.value === "new") newBox.classList.remove("hidden");
            else newBox.classList.add("hidden");
        };
    },

    // Hiển thị popup thêm mới
    showAddPopup() {
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

        if (!title || !startDate || !endDate || !startTime || !endTime) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
            return;
        }

        // Nếu người dùng tạo loại mới
        if (type === "new") {
            const newType = document.getElementById("newTypeInput").value.trim();
            if (newType) {
                const randomColor = Utils.randomColor();
                this.typeColors[newType] = randomColor;
                this.types.push(newType);
                type = newType;
            }
        }

        this.schedules.push({ title, startDate, endDate, startTime, endTime, note, type });
        Storage.save({ schedules: this.schedules, types: this.types, typeColors: this.typeColors });
        document.dispatchEvent(new CustomEvent("rerenderCalendar"));
        this.hidePopup();
    },

    // Chỉnh sửa lịch
    showEditPopup(index) {
        const s = this.schedules[index];
        this.updateTypeOptions();
        document.getElementById("popupOverlay").classList.remove("hidden");

        document.getElementById("titleInput").value = s.title;
        document.getElementById("startDateInput").value = s.startDate;
        document.getElementById("endDateInput").value = s.endDate;
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

            this.schedules[index] = { title, startDate, endDate, startTime, endTime, note, type };
            Storage.save({ schedules: this.schedules, types: this.types, typeColors: this.typeColors });
            document.dispatchEvent(new CustomEvent("rerenderCalendar"));
            this.hidePopup();
            document.getElementById("saveScheduleBtn").classList.remove("hidden");
            updateBtn.remove();
        };
    },

    // Xóa lịch
    deleteSchedule(index) {
        if (confirm("Bạn có chắc muốn xóa lịch này?")) {
            this.schedules.splice(index, 1);
            Storage.save({ schedules: this.schedules, types: this.types, typeColors: this.typeColors });
            document.dispatchEvent(new CustomEvent("rerenderCalendar"));
        }
    },

    // Gắn sự kiện cơ bản
    bindPopupEvents() {
        const addBtn = document.getElementById("addScheduleBtn");
        const saveBtn = document.getElementById("saveScheduleBtn");
        const cancelBtn = document.getElementById("cancelBtn");
        const overlay = document.getElementById("popupOverlay");

        if (addBtn) addBtn.onclick = () => this.showAddPopup();
        if (saveBtn) saveBtn.onclick = () => this.saveNewSchedule();
        if (cancelBtn) cancelBtn.onclick = () => this.hidePopup();
        if (overlay)
            overlay.onclick = (e) => {
                if (e.target.id === "popupOverlay") this.hidePopup();
            };
    }
};