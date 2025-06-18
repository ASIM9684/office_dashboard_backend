const Department = require("../model/department");
const leave = require("../model/leave");
const Task = require("../model/task");
const todayattendance = require("../model/todayattendance");
const User = require("../model/user");
const userinfo = require("../model/userinfo");
const jwt = require("jsonwebtoken");

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, role, phone, joiningDate } = req.body;
  try {
    if (!name || !email || !department || !role || !phone || !joiningDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        departmentId: department,
        phone,
        role,
        joinDate: joiningDate,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "All name fields is required" });
    }

    const existingUser = await Department.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: "Department name in use" });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      {
        name,
      },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department updated successfully",
      Department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating Department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateLeave = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (!status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedLeave = await leave.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({
      message: "Leave request updated successfully",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateuser = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    phone,
    departmentId,
    roleId: role,
    homePhone,
    address,
    state,
    zip,
    profilePicture,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const userInfoData = await userinfo.findOneAndUpdate(
      { userId: id },
      {
        homephone: homePhone,
        address,
        state,
        zip,
        profilePicture,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, departmentId, role },
      { new: true }
    )
      .populate("departmentId")
      .populate("role");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const fullUserData = {
      userId: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      department: updatedUser.departmentId?.name || null,
      departmentId: updatedUser.departmentId?._id || null,
      role: updatedUser.role?.name || null,
      roleId: updatedUser.role?._id || null,
      homePhone: userInfoData?.homephone || "",
      address: userInfoData?.address || "",
      state: userInfoData?.state || "",
      zip: userInfoData?.zip || "",
      profilePicture: userInfoData?.profilePicture || "",
    };

    const token = jwt.sign(fullUserData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "User updated successfully",
      token,
      user: fullUserData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updatetodayattendance = async (req, res) => {
  const { status, endTime } = req.body;
  const { id } = req.params;

  try {
    const updatedAttendance = await todayattendance.findByIdAndUpdate(
      id,
      {
        status,
        endTime: endTime ?? null,
      },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        status: "Completed",
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task submitted successfully", task: updatedTask });
  } catch (e) {
    console.error("Error updating task:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  updateEmployee,
  updateDepartment,
  updateLeave,
  updateuser,
  updatetodayattendance,
  updateTask,
};
