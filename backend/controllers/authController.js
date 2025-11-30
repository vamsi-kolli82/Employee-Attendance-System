const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      name,
      email,
      password,
      role,
      employeeId,
      department,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET LOGGED-IN USER
const getMe = (req, res) => {
  res.json(req.user);
};

// UPDATE PROFILE
const updateMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, department, employeeId, password } = req.body;

    const update = {};
    if (name) update.name = name;
    if (department) update.department = department;
    if (employeeId) update.employeeId = employeeId;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// EXPORT ALL FUNCTIONS
module.exports = {
  register,
  login,
  getMe,
  updateMe
};
