/* ==========================================================
   DAYPILOT - CATEGORY MODULE
   Chức năng: Quản lý loại lịch (CRUD, đổi màu, đổi tên)
   - Đồng bộ hoàn toàn với Firestore (Firebase)
   - Popup quản lý loại lịch có danh sách cuộn riêng, nút cố định
   - Sidebar ghim "Tất cả lịch" trên cùng
========================================================== */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";

export const Category = {
  types: [],
  typeColors: {},

  init(data) {
    this.types = data.types;
    this.typeColors = data.typeColors;
    this.renderSidebar();
    this.bindManagerEvents();
  },

  async save() {
    const data = await Storage.load();
    await Storage.save({
      schedules: data.schedules || [],
      types: this.types,
      typeColors: this.typeColors
    });
  },

  // Hiển thị sidebar: ghim "Tất cả lịch" sticky, danh sách loại bên dưới
  renderSidebar() {
    const list = document.getElementById("scheduleList");
    list.innerHTML = "";

    // Khối sticky cho "Tất cả lịch"
    const allWrapper = document.createElement("div");
    allWrapper.className = "all-schedule-fixed";

    const allItem = document.createElement("div");
    allItem.className = "all-schedule-btn";
    allItem.textContent = "Tất cả lịch";
    allItem.onclick = () => {
      // Bỏ active trên tất cả li loại
      document.querySelectorAll("#scheduleList li").forEach(li => li.classList.remove("active"));
      // Active nút Tất cả lịch
      allItem.classList.add("active");
      // Gửi sự kiện reset lọc
      document.dispatchEvent(new CustomEvent("filterAll"));
    };

    allWrapper.appendChild(allItem);
    list.appendChild(allWrapper);

    // Danh sách loại lịch
    this.types.forEach(type => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="color-dot" style="background:${this.typeColors[type] || "#ccc"}"></span>
        ${Utils.capitalize(type)}
      `;
      li.onclick = () => {
        // Bỏ active ở nút Tất cả lịch
        allItem.classList.remove("active");
        // Bỏ active ở các li khác
        document.querySelectorAll("#scheduleList li").forEach(liItem => liItem.classList.remove("active"));
        // Active li hiện tại
        li.classList.add("active");
        // Gửi sự kiện lọc theo loại
        document.dispatchEvent(new CustomEvent("filterType", { detail: type }));
      };
      list.appendChild(li);
    });

    // Mặc định: chỉ set active cho "Tất cả lịch" tại đây
    // (không set active cho bất kỳ li nào)
    allItem.classList.add("active");
  },

  openManager() {
    const overlay = document.getElementById("typeManagerOverlay");
    overlay.innerHTML = this.templateManager();
    overlay.classList.remove("hidden");
    this.renderManagerList();
  },

  templateManager() {
    return `
      <div id="typeManagerPopup" class="popup type-manager-popup">
        <h3>Quản lý loại lịch</h3>

        <div id="typeListContainer" class="type-list-scroll"></div>

        <div id="typeButtons" class="type-buttons-fixed">
          <button id="addTypeBtn" style="background-color:#10b981;">+ Thêm loại mới</button>
          <button id="closeTypeManager" class="secondary-btn">Đóng</button>
        </div>
      </div>
    `;
  },

  async renderManagerList() {
    const container = document.getElementById("typeListContainer");
    container.innerHTML = "";

    const data = await Storage.load();
    this.types = data.types || this.types;
    this.typeColors = data.typeColors || this.typeColors;

    this.types.forEach(type => {
      const color = this.typeColors[type] || "#ccc";
      const div = document.createElement("div");
      div.className = "type-item";
      div.innerHTML = `
        <div class="type-left">
          <div class="color-box" style="background:${color}" title="Đổi màu"></div>
          <span class="type-name">${type}</span>
        </div>
        <div class="type-actions">
          <button class="rename-btn" title="Đổi tên">✏️</button>
          <button class="delete-btn" title="Xóa">🗑️</button>
        </div>
      `;

      div.querySelector(".color-box").onclick = async () => {
        const newColor = prompt("Nhập mã màu mới:", color);
        if (!newColor) return;
        this.typeColors[type] = newColor;
        await this.save();
        await this.reloadUI();
      };

      div.querySelector(".rename-btn").onclick = async () => {
        const newName = prompt("Nhập tên mới:", type);
        if (!newName || newName.trim() === type) return;
        if (this.types.includes(newName)) return alert("Tên đã tồn tại.");

        const colorVal = this.typeColors[type];
        delete this.typeColors[type];
        this.typeColors[newName] = colorVal;
        this.types = this.types.map(t => (t === type ? newName : t));

        const cur = await Storage.load();
        const schedules = (cur.schedules || []).map(s => s.type === type ? { ...s, type: newName } : s);

        await Storage.save({
          schedules,
          types: this.types,
          typeColors: this.typeColors
        });

        await this.reloadUI();
      };

      div.querySelector(".delete-btn").onclick = async () => {
        const cur = await Storage.load();
        let schedules = cur.schedules || [];
        const hasEvents = schedules.some(s => s.type === type);
        if (hasEvents && !confirm(`Loại "${type}" đang có lịch. Xóa luôn?`)) return;

        schedules = schedules.filter(s => s.type !== type);
        this.types = this.types.filter(t => t !== type);
        delete this.typeColors[type];

        await Storage.save({
          schedules,
          types: this.types,
          typeColors: this.typeColors
        });

        await this.reloadUI();
      };

      container.appendChild(div);
    });

    document.getElementById("addTypeBtn").onclick = async () => {
      const newType = prompt("Nhập tên loại mới:");
      if (!newType || this.types.includes(newType)) return;
      this.types.push(newType);
      this.typeColors[newType] = Utils.randomColor();
      await this.save();
      await this.reloadUI();
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    };

    document.getElementById("closeTypeManager").onclick = () => {
      document.getElementById("typeManagerOverlay").classList.add("hidden");
    };
  },

  async reloadUI() {
    this.renderSidebar();
    this.renderManagerList();
    document.dispatchEvent(new CustomEvent("rerenderCalendar"));
  },

  bindManagerEvents() {
    const btn = document.getElementById("manageTypesBtn");
    if (btn) btn.onclick = () => this.openManager();
  }
};