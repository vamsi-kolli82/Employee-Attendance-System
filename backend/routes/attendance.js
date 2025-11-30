const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/attendanceController");

// Employee
router.post("/checkin", auth, controller.checkIn);
router.post("/checkout", auth, controller.checkOut);
router.get("/my-history", auth, controller.myHistory);
router.get("/my-summary", auth, controller.mySummary);
router.get("/today", auth, controller.todayStatus);

// Manager
router.get("/all", auth, controller.getAll);
router.get("/employee/:id", auth, controller.getEmployee);
router.get("/summary", auth, controller.summary);
router.get("/export", auth, controller.exportCSV);
router.get('/total-employees', auth, controller.totalEmployees);
router.get('/today-counts', auth, controller.todayCounts);
router.get('/late-today', auth, controller.lateArrivalsToday);
router.get('/absent-today', auth, controller.absentToday);
router.get('/weekly-trend', auth, controller.weeklyTrend);
router.get('/department-attendance', auth, controller.departmentAttendance);


module.exports = router;
