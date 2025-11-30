const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const fs = require("fs");

exports.exportToCSV = async (records) => {
  const folder = path.join(__dirname, "..", "exports");

  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const filename = `attendance_${Date.now()}.csv`;

  const csvWriter = createCsvWriter({
    path: path.join(folder, filename),
    header: [
      { id: "date", title: "Date" },
      { id: "name", title: "Name" },
      { id: "employeeId", title: "Employee ID" },
      { id: "checkInTime", title: "Check In" },
      { id: "checkOutTime", title: "Check Out" },
      { id: "status", title: "Status" },
      { id: "totalHours", title: "Total Hours" },
    ],
  });

  const rows = records.map((r) => ({
    date: r.date,
    name: r.userId?.name,
    employeeId: r.userId?.employeeId,
    checkInTime: r.checkInTime || "",
    checkOutTime: r.checkOutTime || "",
    status: r.status,
    totalHours: r.totalHours || 0,
  }));

  await csvWriter.writeRecords(rows);

  return path.join(folder, filename);
};
