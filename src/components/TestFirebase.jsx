import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../redux-toolkit/Hooks";
import { fetchEmployees } from "../redux-toolkit/slices/EmployeeSlice";
import { fetchTasks } from "../redux-toolkit/slices/taskSlice";

const TestFirebase = () => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("Testing Firebase connection...");

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("Testing employees collection...");
        await dispatch(fetchEmployees()).unwrap();

        setStatus("Testing tasks collection...");
        await dispatch(fetchTasks()).unwrap();

        setStatus("✅ Firebase connection successful!");

        // Remove this component after 3 seconds
        setTimeout(() => {
          setStatus("Connection verified. You can remove this test component.");
        }, 3000);
      } catch (error) {
        setStatus(`❌ Firebase connection failed: ${error.message}`);
      }
    };

    testConnection();
  }, [dispatch]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: status.includes("✅") ? "#d4edda" : "#f8d7da",
        border: status.includes("✅")
          ? "1px solid #c3e6cb"
          : "1px solid #f5c6cb",
        padding: "10px 15px",
        borderRadius: "5px",
        zIndex: 1000,
        maxWidth: "300px",
      }}
    >
      <strong>Firebase Test:</strong>
      <br />
      {status}
    </div>
  );
};

export default TestFirebase;
