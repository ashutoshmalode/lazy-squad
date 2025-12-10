import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./Firebase";

// Login user with email and password - EXACT CASE-SENSITIVE MATCHING
// Login user with email and password - EXACT CASE-SENSITIVE MATCHING
export const loginUser = async (email, password) => {
  try {
    // First, check if user exists in Firestore employees collection with exact email
    const employeesQuery = await getDocs(
      query(collection(db, "employees"), where("email", "==", email))
    );

    if (employeesQuery.empty) {
      throw new Error("auth/user-not-found");
    }

    const employeeDoc = employeesQuery.docs[0];
    const employeeData = employeeDoc.data();

    // Verify password matches employeeCode exactly (case-sensitive)
    if (employeeData.employeeCode !== password) {
      throw new Error("auth/wrong-password");
    }

    try {
      // Try to login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: email,
        name: employeeData.name,
        employeeCode: employeeData.employeeCode, // ✅ ADDED: Employee Code
        role: employeeData.role || "Employee", // Use existing role or default to "Employee"
        avatarText: employeeData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2),
        ...employeeData,
      };

      // Also save to users collection for future reference
      await setDoc(doc(db, "users", user.uid), userData);
      return userData;
    } catch (authError) {
      // If Firebase Auth fails with "user-not-found", create the auth account
      if (authError.code === "auth/user-not-found") {
        try {
          // Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          const userData = {
            uid: user.uid,
            email: email,
            name: employeeData.name,
            employeeCode: employeeData.employeeCode, // ✅ ADDED: Employee Code
            role: employeeData.role || "Employee", // Use existing role or default to "Employee"
            avatarText: employeeData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2),
            ...employeeData,
          };

          // Save to users collection
          await setDoc(doc(db, "users", user.uid), userData);
          return userData;
        } catch (createError) {
          console.error("Error creating auth account:", createError);

          // If email already exists in auth but with different password
          if (createError.code === "auth/email-already-in-use") {
            throw new Error("auth/email-already-in-use");
          }
          throw createError;
        }
      } else if (authError.code === "auth/wrong-password") {
        // This shouldn't happen since we already checked, but handle anyway
        throw new Error("auth/wrong-password");
      } else {
        throw authError;
      }
    }
  } catch (error) {
    console.error("Login error in loginUser function:", error);
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

// Create new employee user in Firebase Auth and Firestore
// Create new employee user in Firebase Auth and Firestore
export const createEmployeeUser = async (employeeData) => {
  try {
    // Use the EXACT email from employeeData
    const email = employeeData.email;
    if (!email || !email.includes("@")) {
      throw new Error("Employee email is required and must be valid");
    }
    // Generate password: Use Employee ID only (e.g., LSEMP0001)
    const password = employeeData.employeeCode;

    // STEP 1: Check if employee already exists in Firestore
    const employeesQuery = await getDocs(
      query(collection(db, "employees"), where("email", "==", email))
    );

    if (!employeesQuery.empty) {
      const employeeDoc = employeesQuery.docs[0];
      const existingData = employeeDoc.data();

      // Check if it's marked as deleted or active
      if (existingData.status === "deleted") {
        // We can proceed to create auth account
      } else {
        throw new Error(
          `Employee with email ${email} already exists in the system`
        );
      }
    }

    // STEP 2: Create Firebase Auth account (NEW FIXED LOGIC)
    try {
      // Directly create user - don't try to sign in first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Prepare user data for users collection
      const userData = {
        uid: user.uid,
        email: email,
        name: employeeData.name,
        employeeCode: employeeData.employeeCode, // ✅ ADDED: Employee Code
        role: employeeData.role || "Employee", // ✅ ADDED: Role with default
        avatarText: employeeData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2),
        ...employeeData,
      };

      // Save to users collection
      await setDoc(doc(db, "users", user.uid), userData);
      return employeeData;
    } catch (createError) {
      console.error("Error creating Firebase Auth account:", createError);

      if (createError.code === "auth/email-already-in-use") {
        // Try to sign in to see if it's the same credentials
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return employeeData;
        } catch (signInError) {
          if (signInError.code === "auth/wrong-password") {
            throw new Error(
              `Email ${email} already exists in system with different password. Please use a different email.`
            );
          }
          throw signInError;
        }
      }
      throw createError;
    }
  } catch (error) {
    console.error("❌ Error in createEmployeeUser:", error);
    throw error;
  }
};

// Delete employee user from Firebase Auth, Firestore employees, and users collection
export const deleteEmployeeUser = async (employeeData) => {
  try {
    const email = employeeData.email;
    const password = employeeData.employeeCode;

    // STEP 1: Try to delete from Firebase Authentication
    try {
      // Try to sign in to get the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Delete from Firebase Auth
      await deleteUser(user);
    } catch (authError) {
      if (authError.code === "auth/user-not-found") {
        // Try to find user by email in auth (might have different password)
        // Note: Firebase doesn't have a direct API to find user by email
        // We'll skip this and just delete from Firestore
      } else if (authError.code === "auth/wrong-password") {
        // Email exists but password is wrong - we need admin SDK to delete
        // For now, we'll just log this
      } else {
        console.error("Auth error during deletion:", authError);
      }
    }

    // STEP 2: Delete from Firestore users collection
    try {
      const usersQuery = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (!usersQuery.empty) {
        const batch = writeBatch(db);

        usersQuery.forEach((userDoc) => {
          batch.delete(userDoc.ref);
        });

        await batch.commit();
      } else {
      }
    } catch (usersError) {}

    // STEP 3: Delete from Firestore employees collection
    try {
      const employeesQuery = await getDocs(
        query(collection(db, "employees"), where("email", "==", email))
      );

      if (!employeesQuery.empty) {
        const batch = writeBatch(db);

        employeesQuery.forEach((employeeDoc) => {
          batch.delete(employeeDoc.ref);
        });

        await batch.commit();
      } else {
      }
    } catch (employeesError) {
      console.error(
        "Error deleting from employees collection:",
        employeesError
      );
    }

    return { success: true, email: email };
  } catch (error) {
    console.error("Error in deleteEmployeeUser:", error);
    throw error;
  }
};

// Update employee user credentials
export const updateEmployeeCredentials = async (
  oldEmail,
  newEmail,
  newEmployeeCode
) => {
  try {
    // Get the old user data from Firestore
    const employeesQuery = await getDocs(
      query(collection(db, "employees"), where("email", "==", oldEmail))
    );

    if (employeesQuery.empty) {
      throw new Error("Employee not found in Firestore");
    }

    const employeeDoc = employeesQuery.docs[0];
    const employeeData = employeeDoc.data();
    const oldPassword = employeeData.employeeCode;

    // If email is changing
    if (oldEmail !== newEmail) {
      try {
        // Try to delete old Firebase Auth account
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            oldEmail,
            oldPassword
          );
          const user = userCredential.user;
          await deleteUser(user);
        } catch (authError) {}

        // Create new Firebase Auth account with new email
        try {
          await createUserWithEmailAndPassword(auth, newEmail, newEmployeeCode);
        } catch (createError) {
          console.error("Error creating new auth account:", createError);
          throw createError;
        }
      } catch (error) {
        console.error("Error during email change:", error);
        throw error;
      }
    } else if (oldPassword !== newEmployeeCode) {
      // Only password is changing
      try {
        // Get the user
        const userCredential = await signInWithEmailAndPassword(
          auth,
          oldEmail,
          oldPassword
        );
        const user = userCredential.user;

        // Note: In Firebase, to update password, we need to:
        // 1. Re-authenticate the user (already done above)
        // 2. Call updatePassword(user, newPassword)
        // However, we can't update password without the user being logged in

        // For now, we'll delete and recreate the auth account
        await deleteUser(user);
        await createUserWithEmailAndPassword(auth, oldEmail, newEmployeeCode);
      } catch (authError) {
        console.error("Error updating password:", authError);
        throw authError;
      }
    }
  } catch (error) {
    console.error("Error updating employee credentials:", error);
    throw error;
  }
};

// Create admin user (run this once to setup admin)
export const createAdminUser = async () => {
  try {
    const adminData = {
      name: "Ashutosh Malode",
      employeeCode: "LSADM0001",
    };

    const email = "ashutoshmalode@lazysquad.com";
    const password = "AshutoshMalodeLSADM0001";

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
      avatarText: "ADM",
      employeeCode: adminData.employeeCode,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error) {
    throw error;
  }
};

// Helper function to generate email from name (for new employees)
export const generateEmployeeEmail = (name) => {
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0]?.toLowerCase() || "";
  const lastName = nameParts.slice(1).join("").toLowerCase() || "";
  return `${firstName}${lastName}@lazysquad.com`;
};

// Helper function to generate password from employee code
export const generateEmployeePassword = (employeeCode) => {
  return employeeCode; // Just return employee ID as password
};

// Function to create Firebase Auth account for existing employees
export const createAuthForExistingEmployee = async (employeeData) => {
  try {
    const email = employeeData.email;
    const password = employeeData.employeeCode; // Use Employee ID as password

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

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
    console.error("Error creating auth for existing employee:", error);
    throw error;
  }
};

// Batch function to create auth for ALL existing employees
export const createAuthForAllExistingEmployees = async () => {
  try {
    // Get all employees from Firestore
    const employeesQuery = await getDocs(collection(db, "employees"));
    const employees = employeesQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const results = [];

    for (const employee of employees) {
      try {
        // Skip if email is not valid
        if (!employee.email || !employee.email.includes("@")) {
          continue;
        }

        // Check if auth account already exists
        try {
          await signInWithEmailAndPassword(
            auth,
            employee.email,
            employee.employeeCode
          );
          results.push({ name: employee.name, status: "already_exists" });
        } catch (authError) {
          if (authError.code === "auth/user-not-found") {
            // Create auth account
            await createUserWithEmailAndPassword(
              auth,
              employee.email,
              employee.employeeCode
            );
            results.push({ name: employee.name, status: "created" });
          } else {
            console.error(
              `Error checking auth for ${employee.name}:`,
              authError.message
            );
            results.push({
              name: employee.name,
              status: "error",
              error: authError.message,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing ${employee.name}:`, error);
        results.push({
          name: employee.name,
          status: "error",
          error: error.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error in batch auth creation:", error);
    throw error;
  }
};

// Clean up all employee data (for admin use)
export const cleanupEmployeeData = async (email) => {
  try {
    const results = {
      email: email,
      authDeleted: false,
      usersDeleted: 0,
      employeesDeleted: 0,
      tasksDeleted: 0,
    };

    // 1. Try to find and delete from Firebase Auth
    results.authDeleted = "Requires server-side Admin SDK";

    // 2. Delete from users collection
    const usersQuery = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    if (!usersQuery.empty) {
      const batch = writeBatch(db);
      usersQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      results.usersDeleted = usersQuery.size;
    }

    // 3. Delete from employees collection
    const employeesQuery = await getDocs(
      query(collection(db, "employees"), where("email", "==", email))
    );

    if (!employeesQuery.empty) {
      const batch = writeBatch(db);
      employeesQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      results.employeesDeleted = employeesQuery.size;
    }

    // 4. Clean up tasks (optional)
    const tasksQuery = await getDocs(
      query(collection(db, "tasks"), where("assignedTo", "==", email))
    );

    if (!tasksQuery.empty) {
      results.tasksFound = tasksQuery.size;
    }

    return results;
  } catch (error) {
    console.error("Error in cleanupEmployeeData:", error);
    throw error;
  }
};
