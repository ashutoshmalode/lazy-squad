// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔥 PASTE YOUR ACTUAL CONFIG HERE (from Step 9)
const firebaseConfig = {
  apiKey: "AIzaSyBh7AWt-5BCeGe2CrrujbTaTzfJlKDIS28",
  authDomain: "lazy-squad.firebaseapp.com",
  projectId: "lazy-squad",
  storageBucket: "lazy-squad.firebasestorage.app",
  messagingSenderId: "923404258418",
  appId: "1:923404258418:web:e6946d6f9d9b38c3e946eb",
  measurementId: "G-4VBBW60Q9N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
