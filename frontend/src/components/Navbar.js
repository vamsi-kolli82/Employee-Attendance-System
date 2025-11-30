// import React from "react";
// import { useNavigate } from "react-router-dom";
// import useUserStore from "../stores/userStore";

// export default function Navbar() {
//   const user = useUserStore((state) => state.user);
//   const logout = useUserStore((state) => state.logout);
//   const navigate = useNavigate();

//   if (!user) return null; // No navbar if not logged in

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       style={{
//         background: "#0066ff",
//         padding: "12px",
//         color: "white",
//         marginBottom: "20px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
//         Attendance System
//       </h3>

//       <div>
//         {user.role === "employee" && (
//           <>
//             <span
//               style={{ marginRight: "15px", cursor: "pointer" }}
//               onClick={() => navigate("/")}
//             >
//               Dashboard
//             </span>

//             <span
//               style={{ marginRight: "15px", cursor: "pointer" }}
//               onClick={() => navigate("/mark")}
//             >
//               Mark Attendance
//             </span>

//             <span
//               style={{ marginRight: "15px", cursor: "pointer" }}
//               onClick={() => navigate("/history")}
//             >
//               History
//             </span>
//           </>
//         )}

//         {user.role === "manager" && (
//           <>
//             <span
//               style={{ marginRight: "15px", cursor: "pointer" }}
//               onClick={() => navigate("/manager")}
//             >
//               Dashboard
//             </span>

//             <span
//               style={{ marginRight: "15px", cursor: "pointer" }}
//               onClick={() => navigate("/all-attendance")}
//             >
//               All Attendance
//             </span>
//           </>
//         )}

//         <button
//           onClick={handleLogout}
//           style={{
//             background: "white",
//             color: "#0066ff",
//             borderRadius: "5px",
//             padding: "5px 10px",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  if (!user) return null;

  return (
    <div
      style={{
        width: "100%",
        padding: "15px",
        background: "#282c34",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h3 style={{ cursor: "pointer" }} onClick={() => {
        navigate(user.role === "manager" ? "/manager" : "/");
      }}>
        Attendance System
      </h3>

      <div>

        {/* Employee Links */}
        {user.role === "employee" && (
          <>
            <span style={{ marginRight: 20, cursor: "pointer" }} onClick={() => navigate("/")}>Dashboard</span>
            <span style={{ marginRight: 20, cursor: "pointer" }} onClick={() => navigate("/mark")}>Mark Attendance</span>
            <span style={{ marginRight: 20, cursor: "pointer" }} onClick={() => navigate("/history")}>History</span>
          </>
        )}

        {/* Manager Links */}
        {user.role === "manager" && (
          <>
            <span style={{ marginRight: 20, cursor: "pointer" }} onClick={() => navigate("/manager")}>Dashboard</span>
            <span style={{ marginRight: 20, cursor: "pointer" }} onClick={() => navigate("/all-attendance")}>All Attendance</span>
          </>
        )}

        {/* COMMON Profile Link*/}
        <span
          style={{ marginRight: 20, cursor: "pointer", fontWeight: "bold", color: "#4db8ff" }}
          onClick={() => navigate("/profile")}
        >
          Profile
        </span>

        {/* Logout Button */}
        <button
          style={{ background: "red", color: "white", padding: "5px 12px", cursor: "pointer" }}
          onClick={() => { logout(); navigate("/login"); }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
