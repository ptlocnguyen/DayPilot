/* ==========================================================
   DAYPILOT - UTILS MODULE
   Nhiệm vụ: Cung cấp các hàm tiện ích dùng chung
========================================================== */

export const Utils = {
  // Tính thời lượng giữa hai mốc thời gian (hh:mm)
  calcDuration(start, end) {
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
  },

  // Lấy ngày hiện tại (định dạng yyyy-mm-dd)
  today() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  // Tạo mã màu ngẫu nhiên dạng HSL
  randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  },

  // Chuyển chữ cái đầu thành in hoa
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};