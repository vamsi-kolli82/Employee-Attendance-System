import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      const res = await API.get("/attendance/my-history");
      setRecords(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load attendance history");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="container">
      <h2>Attendance History</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.date}</td>
              <td>{rec.checkInTime || "-"}</td>
              <td>{rec.checkOutTime || "-"}</td>
              <td>{rec.status}</td>
              <td>{rec.totalHours || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginTop: "15px" }} onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}
