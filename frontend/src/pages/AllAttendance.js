import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AllAttendance() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const navigate = useNavigate();

  const loadAll = async () => {
    try {
      const res = await API.get("/attendance/all");
      setRecords(res.data);
      setFiltered(res.data); // default
    } catch (err) {
      console.log(err);
      alert("Failed to load all attendance");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Apply filters
  useEffect(() => {
    let data = records;

    // Filter by employee name or ID
    if (searchEmployee.trim() !== "") {
      data = data.filter(
        (r) =>
          r.user?.name?.toLowerCase().includes(searchEmployee.toLowerCase()) ||
          r.user?.employeeId?.toLowerCase().includes(searchEmployee.toLowerCase())
      );
    }

    // Filter by date
    if (searchDate !== "") {
      data = data.filter((r) => r.date === searchDate);
    }

    // Filter by status
    if (searchStatus !== "") {
      data = data.filter((r) => r.status === searchStatus);
    }

    setFiltered(data);
  }, [searchEmployee, searchDate, searchStatus, records]);

  const handleExport = () => {
    const token = localStorage.getItem("token");

    const url =
      (process.env.REACT_APP_API_URL || "http://localhost:5000/api") +
      `/attendance/export?token=${token}`;

    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <h2>All Employees Attendance</h2>

      {/* FILTER SECTION */}
      <div className="card">
        <h3>Filters</h3>

        <input
          type="text"
          placeholder="Search by Employee Name or ID"
          value={searchEmployee}
          onChange={(e) => setSearchEmployee(e.target.value)}
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="absent">Absent</option>
          <option value="half-day">Half Day</option>
        </select>

        <button onClick={() => { 
          setSearchEmployee("");
          setSearchDate("");
          setSearchStatus("");
        }}>
          Clear Filters
        </button>
      </div>

      {/* ATTENDANCE TABLE */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.date}</td>
              <td>{rec.user?.name}</td>
              <td>{rec.user?.employeeId}</td>
              <td>{rec.checkInTime || "-"}</td>
              <td>{rec.checkOutTime || "-"}</td>
              <td>{rec.status}</td>
              <td>{rec.totalHours || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleExport} style={{ marginTop: "20px" }}>
        Export CSV
      </button>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/manager")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
