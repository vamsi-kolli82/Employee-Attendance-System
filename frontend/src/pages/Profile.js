import React, { useEffect, useState } from "react";
import API from "../api/api";
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const userStore = useUserStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    password: ""
  });

  const [loading, setLoading] = useState(true);

//   const loadProfile = async () => {
//     try {
//       const res = await API.get("/auth/me");
//       const u = res.data;

//       setForm({
//         name: u.name || "",
//         email: u.email || "",
//         employeeId: u.employeeId || "",
//         department: u.department || "",
//         password: ""
//       });

//       userStore.setUser(u);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load profile");
//     }
//   };

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      const u = res.data;

      setForm({
        name: u.name || "",
        email: u.email || "",
        employeeId: u.employeeId || "",
        department: u.department || "",
        password: ""
      });

      // safe to ignore eslint here
      userStore.setUser(u);

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    }
  };

  fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        employeeId: form.employeeId,
        department: form.department
      };

      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      const res = await API.put("/auth/me", payload);
      userStore.setUser(res.data);
      alert("Profile updated!");
      setForm((p) => ({ ...p, password: "" }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) return <div className="container"><h3>Loading...</h3></div>;

  return (
    <div className="container">
      <h2>My Profile</h2>

      <form onSubmit={handleSave}>
        
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email (readonly)</label>
        <input name="email" value={form.email} readOnly />

        <label>Employee ID</label>
        <input name="employeeId" value={form.employeeId} onChange={handleChange} required />

        <label>Department</label>
        <input name="department" value={form.department} onChange={handleChange} />

        <label>New Password (optional)</label>
        <input
          name="password"
          type="password"
          placeholder="Leave blank to keep same"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" style={{ marginTop: "15px" }}>
          Save Changes
        </button>

        <button
          type="button"
          style={{ marginLeft: "10px" }}
          onClick={() =>
            navigate(userStore.user.role === "manager" ? "/manager" : "/")
          }
        >
          Back
        </button>
      </form>
    </div>
  );
}
