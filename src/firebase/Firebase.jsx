// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh7AWt-5BCeGe2CrrujbTaTzfJlKDIS28",
  authDomain: "lazy-squad.firebaseapp.com",
  projectId: "lazy-squad",
  storageBucket: "lazy-squad.firebasestorage.app",
  messagingSenderId: "923404258418",
  appId: "1:923404258418:web:e6946d6f9d9b38c3e946eb",
  measurementId: "G-4VBBW60Q9N",
};

// Initialize Firebase ONLY if it hasn't been initialized
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  if (error.code === "app/duplicate-app") {
    // Firebase already initialized, get the existing app
    app = getApp();
    console.log("Firebase already initialized, using existing app");
  } else {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
