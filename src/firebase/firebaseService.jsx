// src/firebase/firebaseService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

// Employee Services
export const employeeService = {
  // Get all employees
  getEmployees: async () => {
    const querySnapshot = await getDocs(collection(db, "employees"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get employee by ID
  getEmployee: async (id) => {
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    const docRef = await addDoc(collection(db, "employees"), employeeData);
    return { id: docRef.id, ...employeeData };
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const docRef = doc(db, "employees", id);
    await updateDoc(docRef, employeeData);
    return { id, ...employeeData };
  },

  // Delete employee
  deleteEmployee: async (id) => {
    await deleteDoc(doc(db, "employees", id));
    return id;
  },

  // Real-time listener for employees
  subscribeToEmployees: (callback) => {
    return onSnapshot(collection(db, "employees"), (snapshot) => {
      const employees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(employees);
    });
  },
};

// Task Services
export const taskService = {
  // Get all tasks
  getTasks: async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get tasks by employee
  getTasksByEmployee: async (employeeId) => {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", employeeId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Add new task
  addTask: async (taskData) => {
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    return { id: docRef.id, ...taskData };
  },

  // Update task
  updateTask: async (id, taskData) => {
    const docRef = doc(db, "tasks", id);
    await updateDoc(docRef, taskData);
    return { id, ...taskData };
  },

  // Delete task
  deleteTask: async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    return id;
  },

  // Real-time listener for tasks
  subscribeToTasks: (callback) => {
    return onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tasks);
    });
  },

  // Real-time listener for employee-specific tasks
  subscribeToEmployeeTasks: (employeeId, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", employeeId)
    );
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tasks);
    });
  },
};
