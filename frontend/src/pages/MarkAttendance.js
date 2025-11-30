import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function MarkAttendance() {
  const [today, setToday] = useState({});
  const navigate = useNavigate();

  const loadToday = async () => {
    try {
      const res = await API.get("/attendance/today");
      setToday(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load today's status");
    }
  };

  useEffect(() => {
    loadToday();
  }, []);

  const handleCheckIn = async () => {
    try {
      await API.post("/attendance/checkin");
      alert("Checked In successfully");
      loadToday();
    } catch (err) {
      alert(err.response?.data?.msg || "Check-In failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await API.post("/attendance/checkout");
      alert("Checked Out successfully");
      loadToday();
    } catch (err) {
      alert(err.response?.data?.msg || "Check-Out failed");
    }
  };

  return (
    <div className="container">
      <h2>Mark Attendance</h2>

      <div className="card">
        <p>
          <strong>Status:</strong> {today?.status || "Absent"}
        </p>
        <p>
          <strong>Check In:</strong> {today?.checkInTime || "-"}
        </p>
        <p>
          <strong>Check Out:</strong> {today?.checkOutTime || "-"}
        </p>
      </div>

      <button onClick={handleCheckIn}>Check In</button>
      <button onClick={handleCheckOut}>Check Out</button>

      <br />
      <button onClick={() => navigate("/")}>Back to Dashboard</button>
    </div>
  );
}
