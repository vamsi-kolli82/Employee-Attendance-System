import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function ManagerDashboard() {
  const [summary, setSummary] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayCounts, setTodayCounts] = useState({});
  const [lateToday, setLateToday] = useState([]);
  const [absentToday, setAbsentToday] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [deptAttendance, setDeptAttendance] = useState([]);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const loadAll = async () => {
    try {
      const [s, t, tc, late, absent, weekly, dept] = await Promise.all([
        API.get('/attendance/summary'),
        API.get('/attendance/total-employees'),
        API.get('/attendance/today-counts'),
        API.get('/attendance/late-today'),
        API.get('/attendance/absent-today'),
        API.get('/attendance/weekly-trend'),
        API.get('/attendance/department-attendance')
      ]);
      setSummary(s.data);
      setTotalEmployees(t.data.totalEmployees || 0);
      setTodayCounts(tc.data);
      setLateToday(late.data);
      setAbsentToday(absent.data);
      setWeeklyTrend(weekly.data);
      setDeptAttendance(dept.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load manager data');
    }
  };

  useEffect(() => { loadAll(); }, []);

  // prepare chart data
  const lineData = {
    labels: weeklyTrend.map(w => w.date),
    datasets: [{
      label: 'Present',
      data: weeklyTrend.map(w => w.present),
      fill: false,
      tension: 0.4
    }]
  };

  const deptLabels = deptAttendance.map(d => d._id || 'Unknown');
  const deptValues = deptAttendance.map(d => d.presentCount);

  const pieData = {
    labels: deptLabels,
    datasets: [{
      data: deptValues
    }]
  };

  return (
    <div className="container">
      <h2>Manager Dashboard</h2>

      <div className="card">
        <h3>Overview</h3>
        <p>Total employees: <strong>{totalEmployees}</strong></p>
        <p>Today's Present: <strong>{todayCounts.present || 0}</strong></p>
        <p>Today's Absent: <strong>{todayCounts.absent || 0}</strong></p>
      </div>

      <div className="card">
        <h3>Late Arrivals Today</h3>
        {lateToday.length === 0 ? <p>No late arrivals</p> : (
          <ul>
            {lateToday.map(l => <li key={l._id}>{l.user?.name} ({l.user?.employeeId}) - {l.checkInTime}</li>)}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>Absent Employees Today</h3>
        {absentToday.length === 0 ? <p>No absentees</p> : (
          <ul>
            {absentToday.map(a => <li key={a._id || a.employeeId}>{a.name} ({a.employeeId}) - {a.department || 'N/A'}</li>)}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>Weekly Attendance Trend</h3>
        <Line data={lineData} />
      </div>

      <div className="card">
        <h3>Department-wise Attendance (This Month)</h3>
        <Pie data={pieData} />
      </div>

      <button onClick={() => navigate('/all-attendance')}>View All Attendance</button>

      <button style={{ marginTop: "20px", background: "red" }} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
    </div>
  );
}
