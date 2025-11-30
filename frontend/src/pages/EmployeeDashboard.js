import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import moment from "moment";

export default function EmployeeDashboard() {
  const [todayStatus, setTodayStatus] = useState({});
  const [summary, setSummary] = useState({});
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  const loadData = async () => {
    try {
      const [todayRes, summaryRes, historyRes] = await Promise.all([
        API.get('/attendance/today'),
        API.get('/attendance/my-summary'),
        API.get('/attendance/my-history')
      ]);
      setTodayStatus(todayRes.data);
      setSummary(summaryRes.data);
      // recent 7 days
      const last7 = historyRes.data.slice(0,7);
      setRecent(last7);
    } catch (err) {
      console.log("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async () => {
    try {
      await API.post('/attendance/checkin');
      await loadData();
      alert('Checked in');
    } catch (err) { alert(err.response?.data?.msg || 'Check-in failed'); }
  };

  const handleCheckOut = async () => {
    try {
      await API.post('/attendance/checkout');
      await loadData();
      alert('Checked out');
    } catch (err) { alert(err.response?.data?.msg || 'Check-out failed'); }
  };

  return (
    <div className="container">
      <h2>Employee Dashboard</h2>

      <div className="card">
        <h3>Today's Status</h3>
        <p>Status: <strong>{todayStatus?.status || 'Not Checked In'}</strong></p>
        <p>Check In: {todayStatus?.checkInTime || '-'}</p>
        <p>Check Out: {todayStatus?.checkOutTime || '-'}</p>
        <button onClick={handleCheckIn}>Quick Check In</button>
        <button onClick={handleCheckOut}>Quick Check Out</button>
      </div>

      <div className="card">
        <h3>This Month</h3>
        <p>Present: {summary.present || 0}</p>
        <p>Absent: {summary.absent || 0}</p>
        <p>Late: {summary.late || 0}</p>
        <p>Total Hours: {summary.totalHours || 0}</p>
      </div>

      <div className="card">
        <h3>Recent Attendance (Last 7)</h3>
        {recent.length === 0 ? <p>No recent records</p> : (
          <table>
            <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(r => (
                <tr key={r._id}>
                  <td>{r.date}</td>
                  <td>{r.checkInTime || '-'}</td>
                  <td>{r.checkOutTime || '-'}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={() => navigate('/history')}>View Full History</button>

      <button style={{ marginTop: "20px", backgroundColor: "red" }} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
    </div>
  );
}
