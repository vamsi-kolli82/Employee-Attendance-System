const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");
const { exportToCSV } = require("../utils/csvExport");

// EMPLOYEE: CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const user = req.user;
    const date = moment().format("YYYY-MM-DD");
    const now = moment().format("HH:mm:ss");

    let record = await Attendance.findOne({ userId: user._id, date });

    if (record && record.checkInTime) {
      return res.status(400).json({ msg: "Already checked in" });
    }

    const status = moment(now, "HH:mm:ss").isAfter(
      moment("09:30:00", "HH:mm:ss")
    )
      ? "late"
      : "present";

    if (!record) {
      record = new Attendance({
        userId: user._id,
        date,
        checkInTime: now,
        status,
      });
    } else {
      record.checkInTime = now;
      record.status = status;
    }

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// EMPLOYEE: CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const user = req.user;
    const date = moment().format("YYYY-MM-DD");
    const now = moment().format("HH:mm:ss");

    const record = await Attendance.findOne({ userId: user._id, date });

    if (!record || !record.checkInTime) {
      return res.status(400).json({ msg: "Check-in first" });
    }

    if (record.checkOutTime) {
      return res.status(400).json({ msg: "Already checked out" });
    }

    record.checkOutTime = now;
    const duration = moment
      .duration(
        moment(record.checkOutTime, "HH:mm:ss").diff(
          moment(record.checkInTime, "HH:mm:ss")
        )
      )
      .asHours();

    record.totalHours = Math.round(duration * 100) / 100;

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// EMPLOYEE: MY HISTORY
exports.myHistory = async (req, res) => {
  try {
    const user = req.user;
    const records = await Attendance.find({ userId: user._id }).sort({
      date: -1,
    });

    res.json(records);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// EMPLOYEE: MONTHLY SUMMARY
exports.mySummary = async (req, res) => {
  try {
    const user = req.user;
    const month = req.query.month || moment().format("YYYY-MM");

    const start = `${month}-01`;
    const end = moment(start).endOf("month").format("YYYY-MM-DD");

    const records = await Attendance.find({
      userId: user._id,
      date: { $gte: start, $lte: end },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    records.forEach((r) => {
      summary.totalHours += r.totalHours || 0;
      summary[r.status] = summary[r.status] + 1 || 1;
    });

    res.json(summary);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// EMPLOYEE: TODAY STATUS
exports.todayStatus = async (req, res) => {
  try {
    const date = moment().format("YYYY-MM-DD");
    const record = await Attendance.findOne({
      userId: req.user._id,
      date,
    });

    res.json(record || { status: "absent" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// MANAGER: ALL EMPLOYEES ATTENDANCE
exports.getAll = async (req, res) => {
  try {
    const results = await Attendance.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// MANAGER: INDIVIDUAL EMPLOYEE RECORDS
exports.getEmployee = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.params.id });
    res.json(records);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// MANAGER: EXPORT CSV
exports.exportCSV = async (req, res) => {
  try {
    const records = await Attendance.find().populate("userId");

    const filePath = await exportToCSV(records);

    res.download(filePath);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// MANAGER: TEAM SUMMARY
exports.summary = async (req, res) => {
  try {
    const result = await Attendance.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// MANAGER: total employees
exports.totalEmployees = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalEmployees: count });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// MANAGER: today's attendance summary (present / absent)
exports.todayCounts = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const presentCount = await Attendance.countDocuments({ date: today, checkInTime: { $exists: true }});
    // Absent = total employees - present
    const totalEmployees = await User.countDocuments();
    const absentCount = Math.max(0, totalEmployees - presentCount);

    res.json({ present: presentCount, absent: absentCount, totalEmployees });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// MANAGER: late arrivals today (list)
exports.lateArrivalsToday = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const records = await Attendance.aggregate([
      { $match: { date: today, status: 'late' } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { date:1, 'user.name':1, 'user.employeeId':1, checkInTime:1, status:1 } }
    ]);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// MANAGER: absent employees today (list)
// MANAGER: absent employees today (exclude managers)
exports.absentToday = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    // All employees (NOT managers)
    const allEmployees = await User.find({ role: "employee" }).select("name employeeId department");

    // Employees who checked in today
    const presentIds = await Attendance.find({ date: today }).distinct("userId");

    // Filter employees not in present list
    const absent = allEmployees.filter(emp => !presentIds.includes(emp._id.toString()));

    res.json(absent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// MANAGER: weekly attendance trend (last 7 days counts per day)
exports.weeklyTrend = async (req, res) => {
  try {
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = moment().subtract(i, 'days').format('YYYY-MM-DD');
      days.push(d);
    }

    const agg = await Attendance.aggregate([
      { $match: { date: { $in: days } } },
      { $group: { _id: '$date', present: { $sum: 1 } } }
    ]);

    // map counts to days (ensure 0 for absent)
    const map = {};
    agg.forEach(a => map[a._id] = a.present || 0);
    const result = days.map(d => ({ date: d, present: map[d] || 0 }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// MANAGER: department-wise attendance for current month
exports.departmentAttendance = async (req, res) => {
  try {
    const month = req.query.month || moment().format('YYYY-MM');
    const start = `${month}-01`;
    const end = moment(start).endOf('month').format('YYYY-MM-DD');

    const agg = await Attendance.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $group: { _id: '$user.department', presentCount: { $sum: 1 } } }
    ]);

    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
