const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

dotenv.config();
connectDB();

const seed = async () => {
  try {
    await User.deleteMany({});

    const password = await bcrypt.hash("password123", 10);

    await User.create([
  { name: "Alice Manager", email: "alice.manager@example.com", password, role: "manager", employeeId: "EMP000", department: "Management" },
  { name: "Bob Employee", email: "bob.employee@example.com", password, role: "employee", employeeId: "EMP001", department: "Engineering" },
  { name: "Charlie Employee", email: "charlie.employee@example.com", password, role: "employee", employeeId: "EMP002", department: "Sales" },
]);


    console.log("Seed Data Inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
