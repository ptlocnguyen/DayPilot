/* ==========================================================
   UTILS MODULE - Các hàm tiện ích dùng chung
========================================================== */

export const Utils = {
  // Tính thời lượng giữa hai mốc giờ (hh:mm)
  calcDuration(start, end) {
    if (!start || !end) return "";
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours > 0 ? hours + " giờ " : ""}${minutes > 0 ? minutes + " phút" : ""}`.trim();
  },

  // Trả về ngày hôm nay dạng yyyy-mm-dd
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  // Màu ngẫu nhiên dạng HSL
  randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  },

  // Viết hoa chữ cái đầu
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};