const attendance = require("../model/attendance");
const Department = require("../model/department");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

const addEmployee = async (req, res) => {
  try {
    const { name, email, password, department, role, phone } = req.body;

    if (!name || !email || !password || !department || !role || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      departmentId: department,
      phone,
      role,
    });

    await newEmployee.save();

    res
      .status(201)
      .json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(409).json({ message: "Department already exists" });
    }

    const newDepartment = new Department({ name });
    await newDepartment.save();

    res
      .status(201)
      .json({
        message: "Department added successfully",
        department: newDepartment,
      });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addAttendance = async (req, res) => {
  try {
    const { clockTime, breakTime, userId } = req.body;

    if (!clockTime || !breakTime || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const attendanceRecord = new attendance({
      clockTime,
      breakTime,
      userId,
    });

    await attendanceRecord.save();

    res
      .status(201)
      .json({
        message: "Attendance added successfully",
        attendance: attendanceRecord,
      });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { addEmployee, addDepartment, addAttendance };
