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
    console.log("Attempting login with email:", email, "password:", password);

    // First, check if user exists in Firestore employees collection with exact email
    const employeesQuery = await getDocs(
      query(collection(db, "employees"), where("email", "==", email))
    );

    if (employeesQuery.empty) {
      console.log("No employee found with email:", email);
      throw new Error("auth/user-not-found");
    }

    const employeeDoc = employeesQuery.docs[0];
    const employeeData = employeeDoc.data();
    console.log("Found employee in employees collection:", employeeData);

    // Verify password matches employeeCode exactly (case-sensitive)
    if (employeeData.employeeCode !== password) {
      console.log(
        "Password mismatch. Expected:",
        employeeData.employeeCode,
        "Got:",
        password
      );
      throw new Error("auth/wrong-password");
    }

    console.log("Credentials matched! Employee:", employeeData.name);

    try {
      // Try to login with Firebase Auth
      console.log("Attempting Firebase Auth login...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Firebase Auth login successful, user ID:", user.uid);

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
      console.log("Saved user data to users collection");
      return userData;
    } catch (authError) {
      console.log("Firebase Auth error:", authError.code, authError.message);

      // If Firebase Auth fails with "user-not-found", create the auth account
      if (authError.code === "auth/user-not-found") {
        console.log("Creating Firebase Auth account for existing employee...");

        try {
          // Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          console.log("Firebase Auth user created, ID:", user.uid);

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
          console.log(
            "Auth account created successfully for:",
            employeeData.name
          );
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
    console.log("Creating employee user with data:", employeeData);

    // Use the EXACT email from employeeData
    const email = employeeData.email;
    if (!email || !email.includes("@")) {
      throw new Error("Employee email is required and must be valid");
    }

    console.log("Using email from employee record:", email);

    // Generate password: Use Employee ID only (e.g., LSEMP0001)
    const password = employeeData.employeeCode;
    console.log("Generated password (Employee ID):", password);

    // STEP 1: Check if employee already exists in Firestore
    const employeesQuery = await getDocs(
      query(collection(db, "employees"), where("email", "==", email))
    );

    if (!employeesQuery.empty) {
      console.log("⚠️ Employee already exists in Firestore!");
      const employeeDoc = employeesQuery.docs[0];
      const existingData = employeeDoc.data();

      console.log("Existing employee data:", existingData);

      // Check if it's marked as deleted or active
      if (existingData.status === "deleted") {
        console.log(
          "Employee is marked as deleted, proceeding with recreation..."
        );
        // We can proceed to create auth account
      } else {
        throw new Error(
          `Employee with email ${email} already exists in the system`
        );
      }
    }

    // STEP 2: Create Firebase Auth account (NEW FIXED LOGIC)
    console.log("Creating Firebase Auth account...");
    try {
      // Directly create user - don't try to sign in first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("✅ Firebase Auth user created, ID:", user.uid);

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
      console.log("✅ User data saved to users collection");

      return employeeData;
    } catch (createError) {
      console.error("Error creating Firebase Auth account:", createError);

      if (createError.code === "auth/email-already-in-use") {
        console.log("⚠️ Email already exists in Firebase Auth");

        // Try to sign in to see if it's the same credentials
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log("✅ Email exists with same credentials");
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

    console.log("Deleting employee user:", email);

    // STEP 1: Try to delete from Firebase Authentication
    try {
      // Try to sign in to get the user
      console.log("Attempting to sign in to get user...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Delete from Firebase Auth
      console.log("Deleting user from Firebase Auth:", user.uid);
      await deleteUser(user);
      console.log("Successfully deleted from Firebase Auth");
    } catch (authError) {
      if (authError.code === "auth/user-not-found") {
        console.log("User not found in Firebase Auth, checking other cases...");

        // Try to find user by email in auth (might have different password)
        // Note: Firebase doesn't have a direct API to find user by email
        // We'll skip this and just delete from Firestore
      } else if (authError.code === "auth/wrong-password") {
        console.log("Wrong password for Firebase Auth");
        // Email exists but password is wrong - we need admin SDK to delete
        // For now, we'll just log this
      } else {
        console.error("Auth error during deletion:", authError);
      }
    }

    // STEP 2: Delete from Firestore users collection
    try {
      console.log("Deleting from Firestore users collection...");
      const usersQuery = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (!usersQuery.empty) {
        console.log(`Found ${usersQuery.size} documents in users collection`);
        const batch = writeBatch(db);

        usersQuery.forEach((userDoc) => {
          console.log("Deleting user document:", userDoc.id);
          batch.delete(userDoc.ref);
        });

        await batch.commit();
        console.log("Deleted from users collection");
      } else {
        console.log("No documents found in users collection");
      }
    } catch (usersError) {
      console.error("Error deleting from users collection:", usersError);
    }

    // STEP 3: Delete from Firestore employees collection
    try {
      console.log("Deleting from Firestore employees collection...");
      const employeesQuery = await getDocs(
        query(collection(db, "employees"), where("email", "==", email))
      );

      if (!employeesQuery.empty) {
        console.log(
          `Found ${employeesQuery.size} documents in employees collection`
        );
        const batch = writeBatch(db);

        employeesQuery.forEach((employeeDoc) => {
          console.log("Deleting employee document:", employeeDoc.id);
          batch.delete(employeeDoc.ref);
        });

        await batch.commit();
        console.log("Deleted from employees collection");
      } else {
        console.log("No documents found in employees collection");
      }
    } catch (employeesError) {
      console.error(
        "Error deleting from employees collection:",
        employeesError
      );
    }

    console.log("Employee deletion process completed for:", email);

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
    console.log("Updating employee credentials:", {
      oldEmail,
      newEmail,
      newEmployeeCode,
    });

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
      console.log("Email is being changed from", oldEmail, "to", newEmail);

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
          console.log("Old Firebase Auth account deleted");
        } catch (authError) {
          console.log("Could not delete old auth account:", authError.message);
        }

        // Create new Firebase Auth account with new email
        try {
          await createUserWithEmailAndPassword(auth, newEmail, newEmployeeCode);
          console.log("New Firebase Auth account created with new email");
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
      console.log("Only password is being updated");

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

        console.log("Password update requires user to be logged in");
        // For now, we'll delete and recreate the auth account
        await deleteUser(user);
        await createUserWithEmailAndPassword(auth, oldEmail, newEmployeeCode);
        console.log("Auth account recreated with new password");
      } catch (authError) {
        console.error("Error updating password:", authError);
        throw authError;
      }
    }

    console.log("Credentials update completed");
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

    console.log("Creating auth for existing employee:");
    console.log("Email:", email);
    console.log("Password (Employee ID):", password);

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
    console.log("Auth created successfully for:", employeeData.name);
    return userData;
  } catch (error) {
    console.error("Error creating auth for existing employee:", error);
    throw error;
  }
};

// Batch function to create auth for ALL existing employees
export const createAuthForAllExistingEmployees = async () => {
  try {
    console.log("Creating auth accounts for all existing employees...");

    // Get all employees from Firestore
    const employeesQuery = await getDocs(collection(db, "employees"));
    const employees = employeesQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Found ${employees.length} employees`);

    const results = [];

    for (const employee of employees) {
      try {
        // Skip if email is not valid
        if (!employee.email || !employee.email.includes("@")) {
          console.log(`Skipping ${employee.name}: Invalid email`);
          continue;
        }

        // Check if auth account already exists
        try {
          await signInWithEmailAndPassword(
            auth,
            employee.email,
            employee.employeeCode
          );
          console.log(`Auth account already exists for ${employee.name}`);
          results.push({ name: employee.name, status: "already_exists" });
        } catch (authError) {
          if (authError.code === "auth/user-not-found") {
            // Create auth account
            await createUserWithEmailAndPassword(
              auth,
              employee.email,
              employee.employeeCode
            );
            console.log(`Created auth account for ${employee.name}`);
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

    console.log("Batch auth creation completed. Results:", results);
    return results;
  } catch (error) {
    console.error("Error in batch auth creation:", error);
    throw error;
  }
};

// Clean up all employee data (for admin use)
export const cleanupEmployeeData = async (email) => {
  try {
    console.log("Starting cleanup for email:", email);

    const results = {
      email: email,
      authDeleted: false,
      usersDeleted: 0,
      employeesDeleted: 0,
      tasksDeleted: 0,
    };

    // 1. Try to find and delete from Firebase Auth
    console.log(
      "Note: Firebase Auth cleanup requires Admin SDK on server side"
    );
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
      console.log(`Deleted ${usersQuery.size} documents from users collection`);
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
      console.log(
        `Deleted ${employeesQuery.size} documents from employees collection`
      );
    }

    // 4. Clean up tasks (optional)
    const tasksQuery = await getDocs(
      query(collection(db, "tasks"), where("assignedTo", "==", email))
    );

    if (!tasksQuery.empty) {
      console.log(`Found ${tasksQuery.size} tasks assigned to ${email}`);
      results.tasksFound = tasksQuery.size;
    }

    console.log("Cleanup completed:", results);
    return results;
  } catch (error) {
    console.error("Error in cleanupEmployeeData:", error);
    throw error;
  }
};
