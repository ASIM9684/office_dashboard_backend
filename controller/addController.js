const attendance = require("../model/attendance");
const Department = require("../model/department");
const leave = require("../model/leave");
const Task = require("../model/task");
const todayattendance = require("../model/todayattendance");
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

    res.status(201).json({
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
    const { clockTime, breakTime, userId, startTime, endTime } = req.body;

    const attendanceRecord = new attendance({
      clockTime,
      breakTime,
      userId,
      startTime,
      endTime,
    });

    await attendanceRecord.save();

    res.status(201).json({
      message: "Attendance added successfully",
      attendance: attendanceRecord,
    });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, leaveDate } = req.body;

    if (!id || !reason || !leaveDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leaveRecord = new leave({
      userId: id,
      reason,
      leaveDate,
    });

    await leaveRecord.save();

    res.status(201).json({
      message: "Leave added successfully",
      leave: leaveRecord,
    });
  } catch (error) {
    console.error("Error adding leave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTodayAttendance = async (req, res) => {
  try {
    let { startTime, status, userId } = req.body;
    const deviceType = req.useragent.isMobile ? "Mobile" : "Desktop";

    if (!startTime || !userId) {
      return res
        .status(400)
        .json({ message: "Start time and user ID are required" });
    }

    const endTime = null;

    const todayAttendanceRecord = new todayattendance({
      startTime,
      status,
      endTime,
      userId,
      deviceType,
    });

    await todayAttendanceRecord.save();

    res.status(201).json({
      message: "Today's attendance added successfully",
      attendance: todayAttendanceRecord,
    });
  } catch (error) {
    console.error("Error adding today's attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const assignTask = async (req, res) => {
  try {
    const { assignedTo, task, assignedBy, status } = req.body;

    if (!assignedTo || !task || !assignedBy || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const taks = new Task({
      task,
      assignedBy,
      assignedTo,
      status,
    });
    await taks.save();

    return res
      .status(200)
      .json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error("Error assigning task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addEmployee,
  addDepartment,
  addAttendance,
  addLeave,
  addTodayAttendance,
  assignTask,
};
