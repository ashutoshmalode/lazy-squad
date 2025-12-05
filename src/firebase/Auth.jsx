import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./Firebase";

// Login user with email and password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Create new employee user
export const createEmployeeUser = async (employeeData) => {
  try {
    const email = `${employeeData.name
      .toLowerCase()
      .replace(/\s+/g, "")}@lazysquad.com`;
    const password = `${employeeData.name.replace(/\s+/g, "")}${
      employeeData.employeeCode
    }`;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save employee data in Firestore
    const userData = {
      uid: user.uid,
      email: email,
      name: employeeData.name,
      role: "employee",
      avatarText: employeeData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2),
      employeeCode: employeeData.employeeCode,
      ...employeeData,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error) {
    throw error;
  }
};

// Create admin user (run this once to setup admin)
export const createAdminUser = async () => {
  try {
    const adminData = {
      name: "Ashutosh Malode",
      employeeCode: "LS001",
    };

    const email = "ashutoshmadode@lazysquad.com";
    const password = "AshutoshMalodeLS001";

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: email,
      name: adminData.name,
      role: "admin",
      avatarText: "AS",
      employeeCode: adminData.employeeCode,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error) {
    throw error;
  }
};
