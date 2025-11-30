import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useUserStore from "./stores/userStore";

// Pages
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MarkAttendance from "./pages/MarkAttendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import ManagerDashboard from "./pages/ManagerDashboard";
import AllAttendance from "./pages/AllAttendance";

import Navbar from "./components/Navbar";

// Protect routes
function PrivateRoute({ children, roles }) {
  const user = useUserStore((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <>
      {/* NAVBAR shown only when user is logged in */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute roles={["employee"]}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/mark"
          element={
            <PrivateRoute roles={["employee"]}>
              <MarkAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute roles={["employee"]}>
              <AttendanceHistory />
            </PrivateRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager"
          element={
            <PrivateRoute roles={["manager"]}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-attendance"
          element={
            <PrivateRoute roles={["manager"]}>
              <AllAttendance />
            </PrivateRoute>
          }
        />

        {/* Profile Page (Accessible to both Employee & Manager) */}
<Route
  path="/profile"
  element={
    <PrivateRoute roles={["employee", "manager"]}>
      <Profile />
    </PrivateRoute>
  }
/>

      </Routes>
    </>
  );
}
