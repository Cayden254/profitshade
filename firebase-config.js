// firebase-config.js

// Import the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

// Firebase config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyBZ1AjgLxPTK3rE_unNu8CMxB245ESfW5I",
  authDomain: "profitshade-project.firebaseapp.com",
  projectId: "profitshade-project",
  storageBucket: "profitshade-project.firebasestorage.app",
  messagingSenderId: "880246785277",
  appId: "1:880246785277:web:caa35b60d1192eead4ea94",
  measurementId: "G-VTXZJMLCY2"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
