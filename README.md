🚀 Employee Attendance Management System (MERN Stack)
Tap Academy – SDE Internship Round 2 Project Task (2026 Batch)

Author: Vamsi Krishna Reddy Kolli
College: Mohan Babu University
Mobile: 8688718864

📌 Project Overview

This is a complete Employee Attendance Management System built using the MERN Stack.
The system supports both Employee and Manager roles with separate dashboards, authentication, attendance tracking, analytics, CSV export, and profile management.

This project is fully developed following all requirements provided in the Tap Academy SDE Internship Round 2 PDF.

🌟 Key Features
👨‍💼 Employee Features

Register / Login

Mark Attendance

✔ Check-In

✔ Check-Out

Dashboard:

✔ Today's Status (Checked In / Not Checked In)

✔ Monthly Summary (Present, Absent, Late)

✔ Recent 7 Days Attendance

✔ Total Hours Worked

✔ Quick Check-In / Check-Out Buttons

View full attendance history

Update profile:

✔ Name

✔ Employee ID

✔ Department

✔ Password change

Logout

🧑‍💼 Manager Features

Login

Dashboard:

✔ Total Employees

✔ Today's Present / Absent Count

✔ Late Arrivals

✔ Absent Employees List

✔ Weekly Attendance Trend Chart

✔ Department-wise Attendance Pie Chart

View all employee attendance

✔ Filter by Employee

✔ Filter by Date

✔ Filter by Status

Export attendance report (CSV)

Update Profile

Logout

🏗️ Tech Stack Used
🔵 Frontend

React JS

Zustand (Global store)

Axios

Chart.js

HTML5, CSS3

React Router DOM

🟢 Backend

Node JS

Express JS

MongoDB

Mongoose

JWT Authentication

bcryptjs

Moment.js

CSV Export

📁 Project Folder Structure
attendance-system/<br>
│── backend/<br>
│   ├── controllers/<br>
│   ├── models/<br>
│   ├── routes/<br>
│   ├── middleware/<br>
│   ├── seed/<br>
│   ├── utils/<br>
│   ├── server.js<br>
│   ├── package.json<br>
│   └── .env.example<br>
│<br>
│── frontend/<br>
│   ├── src/<br>
│   │   ├── pages/<br>
│   │   ├── components/<br>
│   │   ├── stores/<br>
│   │   ├── api/<br>
│   │   ├── styles.css<br>
│   │   ├── App.js<br>
│   │   └── index.js<br>
│   ├── public/<br>
│   ├── package.json<br>
│<br>
└── README.md<br>

🔐 Environment Variables

Create a .env inside backend/:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=mysupersecretkey
JWT_EXPIRES_IN=7d


Add the safe example file for GitHub:

📄 backend/.env.example

PORT=5000
MONGO_URI=your_mongo_string_here
JWT_SECRET=secret_here
JWT_EXPIRES_IN=7d

▶️ How to Run the Project Locally
1️⃣ Backend Setup
cd backend
npm install
npm run seed   # (optional) inserts demo users
npm run dev


Backend runs at:
👉 http://localhost:5000

2️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:
👉 http://localhost:3000

🔑 Default Login Credentials (from seed data)
👨‍💼 Employee
Email: bob.employee@example.com
Password: password123

🧑‍💼 Manager
Email: alice.manager@example.com
Password: password123

📤 CSV Export Feature

Manager → All Attendance → Export CSV
Generates:

attendance.csv

📸 Screenshots Required for Submission
Employee Screenshots:

✔ Register
<img width="1905" height="762" alt="image" src="https://github.com/user-attachments/assets/8120b695-1342-427d-8017-88095ddd14ad" /><br>

✔ Login
<img width="1910" height="602" alt="image" src="https://github.com/user-attachments/assets/9bd29a5c-659e-441c-b073-fae3bb4a3629" /><br>

✔ Dashboard
<img width="1917" height="834" alt="image" src="https://github.com/user-attachments/assets/0ddecbe5-9578-4cad-b535-ce9574c84fb6" /><br>

✔ Mark Attendance
<img width="1919" height="680" alt="image" src="https://github.com/user-attachments/assets/502d8431-5c80-43db-bdc7-262828c6e142" /><br>

✔ Attendance History
<img width="1919" height="612" alt="image" src="https://github.com/user-attachments/assets/8fa135c9-95ec-44c3-9a58-a368b672f0bf" /><br>

✔ Profile Page
<img width="1919" height="812" alt="image" src="https://github.com/user-attachments/assets/455c92a9-7c49-47c9-9d04-9ebbb34f06ec" /><br>


Manager Screenshots:

✔ Dashboard
✔ Absent Employees
✔ Late Arrivals
<img width="1918" height="879" alt="image" src="https://github.com/user-attachments/assets/12b595a0-e89b-41f7-ae7b-295eb534a1b5" /><br>

✔ Weekly Trend Chart
<img width="1917" height="718" alt="image" src="https://github.com/user-attachments/assets/b70a2bfa-c025-41a6-92c3-491a472e8297" /><br>

✔ Department-wise Chart
<img width="1919" height="796" alt="image" src="https://github.com/user-attachments/assets/1cf19357-cc5a-4bee-b4a4-225d2946cd0b" /><br>

✔ All Attendance Page
✔ Filters Working
✔ CSV Export
<img width="1917" height="818" alt="image" src="https://github.com/user-attachments/assets/5197ef4e-12a4-48a0-af39-59a0e4a74d4c" /><br>

✔ Profile Page
<img width="1917" height="822" alt="image" src="https://github.com/user-attachments/assets/81f8ea23-b974-40bd-9de6-bacd3de9b97d" /><br>
