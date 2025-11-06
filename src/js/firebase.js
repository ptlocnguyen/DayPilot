// ==========================================================
// FIREBASE CONFIGURATION & FIRESTORE API
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- Cấu hình Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDNhP61mIL5w5SsyraBMVbLzaEkznJHPAU",
  authDomain: "daypilot-d1127.firebaseapp.com",
  projectId: "daypilot-d1127",
  storageBucket: "daypilot-d1127.firebasestorage.app",
  messagingSenderId: "178170452395",
  appId: "1:178170452395:web:c803793354bffbea525aee"
};

// --- Khởi tạo Firebase App ---
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ==========================================================
// FIRESTORE API WRAPPER
// ==========================================================
export const FirestoreAPI = {
  // Lấy dữ liệu duy nhất (document "daypilot/data")
  async load() {
    const ref = doc(db, "daypilot", "data");
    const snap = await getDoc(ref);

    if (snap.exists()) return snap.data();

    // Nếu chưa có, khởi tạo dữ liệu mặc định
    const defaultData = {
      schedules: [],
      types: ["Work", "Study", "Health", "Personal"],
      typeColors: {
        Work: "#3b82f6",
        Study: "#f97316",
        Health: "#10b981",
        Personal: "#8b5cf6"
      }
    };
    await setDoc(ref, defaultData);
    return defaultData;
  },

  // Ghi đè dữ liệu DayPilot
  async save(data) {
    const ref = doc(db, "daypilot", "data");
    await setDoc(ref, data);
  }
};