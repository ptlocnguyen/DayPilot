/* ==========================================================
   STORAGE MODULE - Firebase Firestore Backend
========================================================== */
import { FirestoreAPI } from "./firebase.js";

export const Storage = {
  // Load toàn bộ dữ liệu từ Firestore
  async load() {
    const data = await FirestoreAPI.load();
    console.log("Dữ liệu tải từ Firestore:", data);
    return data;
  },

  // Lưu toàn bộ dữ liệu lên Firestore
  async save({ schedules, types, typeColors }) {
    const data = { schedules, types, typeColors };
    await FirestoreAPI.save(data);
    console.log("Đã lưu dữ liệu lên Firestore!");
  }
};