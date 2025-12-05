import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./Firebase";

// Employees Collection
export const employeesCollection = collection(db, "employees");
export const tasksCollection = collection(db, "tasks");

// Real-time listeners
export const subscribeToEmployees = (callback) => {
  return onSnapshot(employeesCollection, (snapshot) => {
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(employees);
  });
};

export const subscribeToTasks = (callback) => {
  return onSnapshot(tasksCollection, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tasks);
  });
};

export const subscribeToEmployeeTasks = (employeeCode, callback) => {
  const q = query(
    tasksCollection,
    where("assignedToEmployeeCode", "==", employeeCode)
  );
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tasks);
  });
};

// CRUD Operations for Employees
export const addEmployee = async (employeeData) => {
  const docRef = await addDoc(employeesCollection, {
    ...employeeData,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...employeeData };
};

export const updateEmployee = async (id, employeeData) => {
  await updateDoc(doc(db, "employees", id), employeeData);
  return { id, ...employeeData };
};

export const deleteEmployee = async (id) => {
  await deleteDoc(doc(db, "employees", id));
  return id;
};

export const getEmployees = async () => {
  const snapshot = await getDocs(employeesCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// CRUD Operations for Tasks
export const addTask = async (taskData) => {
  const docRef = await addDoc(tasksCollection, {
    ...taskData,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...taskData };
};

export const updateTask = async (id, taskData) => {
  await updateDoc(doc(db, "tasks", id), taskData);
  return { id, ...taskData };
};

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
  return id;
};

export const getTasks = async () => {
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getEmployeeTasks = async (employeeCode) => {
  const q = query(
    tasksCollection,
    where("assignedToEmployeeCode", "==", employeeCode)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
