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
  writeBatch,
} from "firebase/firestore";
import { db } from "./Firebase";

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

  // Get employee by email (case-sensitive exact match)
  getEmployeeByEmail: async (email) => {
    console.log("🔍 Searching for employee with email:", email);
    const q = query(collection(db, "employees"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const employeeData = { id: doc.id, ...doc.data() };
      console.log("✅ Found employee:", employeeData.name);
      return employeeData;
    }
    console.log("❌ No employee found with email:", email);
    return null;
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    // Check if employee with same email already exists
    const existingEmployee = await employeeService.getEmployeeByEmail(
      employeeData.email
    );
    if (existingEmployee) {
      throw new Error(
        `Employee with email ${employeeData.email} already exists`
      );
    }

    // Check if employee with same employee code already exists
    const q = query(
      collection(db, "employees"),
      where("employeeCode", "==", employeeData.employeeCode)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error(
        `Employee with code ${employeeData.employeeCode} already exists`
      );
    }

    const docRef = await addDoc(collection(db, "employees"), {
      ...employeeData,
      createdAt: new Date().toISOString(),
      status: "active",
    });
    return { id: docRef.id, ...employeeData };
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const docRef = doc(db, "employees", id);

    // Get current employee data
    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error("Employee not found");
    }

    const currentData = currentDoc.data();

    // Check if email is being changed to an existing email
    if (employeeData.email !== currentData.email) {
      const existingEmployee = await employeeService.getEmployeeByEmail(
        employeeData.email
      );
      if (existingEmployee && existingEmployee.id !== id) {
        throw new Error(
          `Another employee with email ${employeeData.email} already exists`
        );
      }
    }

    // Check if employee code is being changed to an existing code
    if (employeeData.employeeCode !== currentData.employeeCode) {
      const q = query(
        collection(db, "employees"),
        where("employeeCode", "==", employeeData.employeeCode)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        if (existingDoc.id !== id) {
          throw new Error(
            `Another employee with code ${employeeData.employeeCode} already exists`
          );
        }
      }
    }

    await updateDoc(docRef, employeeData);
    return { id, ...employeeData };
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const docRef = doc(db, "employees", id);

    // Get employee data before deletion
    const employeeDoc = await getDoc(docRef);
    if (!employeeDoc.exists()) {
      throw new Error("Employee not found");
    }

    const employeeData = employeeDoc.data();
    const email = employeeData.email;

    console.log("Deleting employee with email:", email);

    // Use a batch to delete from multiple collections
    const batch = writeBatch(db);

    // 1. Delete from employees collection
    batch.delete(docRef);
    console.log("Marked for deletion from employees collection");

    // 2. Delete from users collection
    const usersQuery = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    if (!usersQuery.empty) {
      usersQuery.forEach((userDoc) => {
        batch.delete(userDoc.ref);
        console.log("Marked user document for deletion:", userDoc.id);
      });
    }

    // 3. Also check tasks collection if you want to delete assigned tasks
    const tasksQuery = await getDocs(
      query(
        collection(db, "tasks"),
        where("assignedTo", "==", employeeData.name)
      )
    );

    if (!tasksQuery.empty) {
      console.log(`Found ${tasksQuery.size} tasks assigned to this employee`);
      // Optional: Uncomment if you want to delete tasks too
      // tasksQuery.forEach((taskDoc) => {
      //   batch.delete(taskDoc.ref);
      // });
    }

    // Execute the batch
    await batch.commit();
    console.log("Batch deletion completed for employee:", email);

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

  // Get tasks by employee name
  getTasksByEmployee: async (employeeName) => {
    console.log("🔍 Searching for tasks assigned to employee:", employeeName);
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", employeeName)
    );
    const querySnapshot = await getDocs(q);
    console.log(`✅ Found ${querySnapshot.size} tasks for ${employeeName}`);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get tasks by employee email (NEW FUNCTION - IMPROVED)
  // In FirebaseService.jsx, update getTasksByEmployeeEmail function:
  getTasksByEmployeeEmail: async (employeeEmail) => {
    try {
      console.log("🔍 Getting tasks for employee email:", employeeEmail);

      // First get the employee by email
      const employee = await employeeService.getEmployeeByEmail(employeeEmail);

      if (!employee) {
        console.log("❌ Employee not found with email:", employeeEmail);
        return [];
      }

      console.log(
        "✅ Found employee:",
        employee.name,
        "Code:",
        employee.employeeCode
      );

      // Create the expected pattern: "LSEMP0001 - Anirudh Malode"
      const expectedPattern = `${employee.employeeCode} - ${employee.name}`;

      // Query tasks with this pattern
      const q = query(
        collection(db, "tasks"),
        where("assignedTo", "==", expectedPattern)
      );

      const querySnapshot = await getDocs(q);

      console.log(
        `📋 Found ${querySnapshot.size} tasks with pattern: "${expectedPattern}"`
      );

      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return tasks;
    } catch (error) {
      console.error("❌ Error getting tasks by employee email:", error);

      // Fallback: Get all tasks and filter
      try {
        console.log("🔄 Trying fallback method...");
        const allTasks = await taskService.getTasks();
        const employee = await employeeService.getEmployeeByEmail(
          employeeEmail
        );

        if (!employee) return [];

        const filteredTasks = allTasks.filter(
          (task) =>
            task.assignedTo === `${employee.employeeCode} - ${employee.name}` ||
            task.assignedTo?.includes(employee.name) ||
            task.assignedTo?.includes(employee.employeeCode)
        );

        console.log(`🔄 Fallback found ${filteredTasks.length} tasks`);
        return filteredTasks;
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        return [];
      }
    }
  },

  // Get ALL tasks and filter by employee (Alternative approach)
  getAllTasksAndFilterByEmployee: async (employeeEmail) => {
    try {
      console.log("🔍 Getting all tasks and filtering for:", employeeEmail);

      const employee = await employeeService.getEmployeeByEmail(employeeEmail);

      if (!employee) {
        console.log("❌ Employee not found");
        return [];
      }

      // Get ALL tasks
      const allTasks = await taskService.getTasks();
      console.log(`📋 Total tasks in system: ${allTasks.length}`);

      // Filter tasks by employee name
      const employeeTasks = allTasks.filter(
        (task) => task.assignedTo === employee.name
      );

      console.log(
        `✅ Filtered ${employeeTasks.length} tasks for ${employee.name}`
      );

      return employeeTasks;
    } catch (error) {
      console.error("❌ Error in getAllTasksAndFilterByEmployee:", error);
      return [];
    }
  },

  // Add new task
  addTask: async (taskData) => {
    console.log("➕ Adding new task:", taskData);
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    console.log("✅ Task added with ID:", docRef.id);
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
  subscribeToEmployeeTasks: (employeeName, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", employeeName)
    );
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tasks);
    });
  },

  // Real-time listener for employee-specific tasks by email (NEW FUNCTION)
  subscribeToEmployeeTasksByEmail: (employeeEmail, callback) => {
    return onSnapshot(collection(db, "employees"), async (employeeSnapshot) => {
      const employees = employeeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const employee = employees.find((emp) => emp.email === employeeEmail);

      if (!employee) {
        callback([]);
        return;
      }

      const q = query(
        collection(db, "tasks"),
        where("assignedTo", "==", employee.name)
      );

      onSnapshot(q, (taskSnapshot) => {
        const tasks = taskSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(tasks);
      });
    });
  },
};

// Export helper functions
export const getEmployeeByEmail = employeeService.getEmployeeByEmail;
export const getTasksByEmployeeEmail = taskService.getTasksByEmployeeEmail;
export const getAllTasksAndFilterByEmployee =
  taskService.getAllTasksAndFilterByEmployee;
