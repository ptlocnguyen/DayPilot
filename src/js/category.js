/* ==========================================================
   DAYPILOT - CATEGORY MODULE (FINAL FIXED VERSION)
   Quản lý loại lịch: CRUD + đổi màu + rename
   Đồng bộ Firestore 100%, không đụng localStorage
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
    const data = await Storage.load(); // lấy lịch mới nhất
    await Storage.save({
      schedules: data.schedules || [],
      types: this.types,
      typeColors: this.typeColors,
    });
  },

  renderSidebar() {
    const list = document.getElementById("scheduleList");
    list.innerHTML = "";

    // Mục "Tất cả lịch"
    const allItem = document.createElement("li");
    allItem.innerHTML = `<b>Tất cả lịch</b>`;
    allItem.style.color = "#2563eb";
    allItem.onclick = () => {
      document
        .querySelectorAll("#scheduleList li")
        .forEach((li) => li.classList.remove("active"));
      allItem.classList.add("active");
      document.dispatchEvent(new CustomEvent("filterAll"));
    };
    list.appendChild(allItem);

    // Render từng loại lịch
    this.types.forEach((type) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="color-dot" style="background:${
          this.typeColors[type] || "#ccc"
        }"></span>
        ${Utils.capitalize(type)}
      `;
      li.onclick = () => {
        document
          .querySelectorAll("#scheduleList li")
          .forEach((liItem) => liItem.classList.remove("active"));
        li.classList.add("active");
        document.dispatchEvent(new CustomEvent("filterType", { detail: type }));
      };
      list.appendChild(li);
    });
  },

  openManager() {
    const overlay = document.getElementById("typeManagerOverlay");
    overlay.innerHTML = this.templateManager();
    overlay.classList.remove("hidden");
    this.renderManagerList();
  },

  templateManager() {
    return `
      <div id="typeManagerPopup" class="popup">
        <h3>Quản lý loại lịch</h3>
        <div id="typeListContainer"></div>
        <hr style="margin:10px 0;" />
        <button id="addTypeBtn" style="background-color:#10b981;">+ Thêm loại mới</button>
        <button id="closeTypeManager" class="secondary-btn">Đóng</button>
      </div>
    `;
  },

  async renderManagerList() {
    const container = document.getElementById("typeListContainer");
    container.innerHTML = "";

    // Sync dữ liệu Firestore mới nhất
    const data = await Storage.load();
    this.types = data.types || this.types;
    this.typeColors = data.typeColors || this.typeColors;

    this.types.forEach((type) => {
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

      // Đổi màu
      div.querySelector(".color-box").onclick = async () => {
        const newColor = prompt("Nhập mã màu mới:", color);
        if (!newColor) return;
        this.typeColors[type] = newColor;
        await this.save();
        await this.reloadUI();
      };

      // Đổi tên
      div.querySelector(".rename-btn").onclick = async () => {
        const newName = prompt("Nhập tên mới:", type);
        if (!newName || newName.trim() === type) return;
        if (this.types.includes(newName)) return alert("Tên đã tồn tại.");

        const colorVal = this.typeColors[type];
        delete this.typeColors[type];
        this.typeColors[newName] = colorVal;
        this.types = this.types.map((t) => (t === type ? newName : t));

        const cur = await Storage.load();
        const schedules = (cur.schedules || []).map((s) =>
          s.type === type ? { ...s, type: newName } : s
        );

        await Storage.save({
          schedules,
          types: this.types,
          typeColors: this.typeColors,
        });

        await this.reloadUI();
      };

      // Xóa loại
      div.querySelector(".delete-btn").onclick = async () => {
        const cur = await Storage.load();
        let schedules = cur.schedules || [];
        const hasEvents = schedules.some((s) => s.type === type);
        if (hasEvents && !confirm(`Loại "${type}" đang có lịch. Xóa luôn?`))
          return;

        schedules = schedules.filter((s) => s.type !== type);
        this.types = this.types.filter((t) => t !== type);
        delete this.typeColors[type];

        await Storage.save({
          schedules,
          types: this.types,
          typeColors: this.typeColors,
        });

        await this.reloadUI();
      };

      container.appendChild(div);
    });

    // Thêm loại mới
    document.getElementById("addTypeBtn").onclick = async () => {
      const newType = prompt("Nhập tên loại mới:");
      if (!newType || this.types.includes(newType)) return;
      this.types.push(newType);
      this.typeColors[newType] = Utils.randomColor();
      await this.save();
      await this.reloadUI();
    };

    document.getElementById("closeTypeManager").onclick = () => {
      document.getElementById("typeManagerOverlay").classList.add("hidden");
    };
  },

  async reloadUI() {
    // cập nhật sidebar + manager list + render lại lịch
    this.renderSidebar();
    this.renderManagerList();
    document.dispatchEvent(new CustomEvent("rerenderCalendar"));
  },

  bindManagerEvents() {
    const btn = document.getElementById("manageTypesBtn");
    if (btn) btn.onclick = () => this.openManager();
  },
};