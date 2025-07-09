const { default: mongoose } = require("mongoose");
const attendance = require("../model/attendance");
const Department = require("../model/department");
const leave = require("../model/leave");
const Role = require("../model/role");
const User = require("../model/user");
const todayattendance = require("../model/todayattendance");
const Task = require("../model/task");

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getEmployee = async (req, res) => {
  try {
    const employees = await User.aggregate([
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true
        }
      }
    ]);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getAttendenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendanceData = await attendance.find({ userId: id })
      .populate('userId', 'name email')
    if (!attendanceData || attendanceData.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this user' });
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLeave = async (req, res) => {
  try {
    const { userId, roleId: userRoleId } = req.user;

    const roleDoc = await Role.findById(userRoleId);
    const roleName = roleDoc?.name;

    let matchStage = {};

    if (roleName === 'Employee') {
      // Employee should only see their own leave
      matchStage = { userId: new mongoose.Types.ObjectId(userId) };
    }
    // HR and Admin can see all, no need to filter

    const leaveData = await leave.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },

      {
        $lookup: {
          from: 'roles',
          localField: 'user.role',
          foreignField: '_id',
          as: 'userRole'
        }
      },
      { $unwind: '$userRole' },

      { $match: matchStage },

      {
        $project: {
          _id: 1,
          reason: 1,
          leaveDate: 1,
          createdAt: 1,
          status: 1,
          'user.name': 1,
          'user.email': 1,
          'userRole.name': 1,
          'user._id': 1
        }
      }
    ]);

    if (!leaveData.length) {
      return res.status(404).json({ message: 'No leave records found' });
    }

    res.status(200).json(leaveData);
  } catch (error) {
    console.error('Error fetching leave records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: "userinfos",
          localField: "_id",
          foreignField: "userId",
          as: "userInfo"
        }
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          departmentId: 1,
          roleId: "$role",
          homePhone: "$userInfo.homephone",
          address: "$userInfo.address",
          state: "$userInfo.state",
          zip: "$userInfo.zip",
          profilePicture: "$userInfo.profilePicture",
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ClockInNow = async (req, res) => {

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingAttendance = await todayattendance.find({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }).populate('userId', 'name');

    if (!existingAttendance) {
      return res.status(400).json({ message: "No attendance record found for today. Please clock in first." });
    }

    return res.status(200).json(existingAttendance);
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getDashboardCounts = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [departmentCount, userCount, attendanceCount] = await Promise.all([
      Department.countDocuments(),
      User.countDocuments(),
      todayattendance.countDocuments({
        createdAt: { $gte: startOfToday, $lte: endOfToday },
      })
    ]);

    res.status(200).json({
      departmentCount,
      userCount,
      attendanceCount
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserCountByDepartment = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: "$departmentId",
          userCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: "$department"
      },
      {
        $project: {
          _id: 0,
          departmentId: "$department._id",
          departmentName: "$department.name",
          userCount: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user count by department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({
      $or: [
        { assignedTo: userId },
        { assignedBy: userId }
      ]
    }).populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPendingTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const tasks = await Task.find({
      assignedTo: userId,
      status: "Pending"
    })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const ErrorAttendance = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const nineHoursAgo = new Date(Date.now() - 9 * 60 * 60 * 1000);

    // Step 1: Get all records with missing endTime in current month
    const rawAttendance = await todayattendance.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      endTime: { $in: [null, "", undefined] },
      startTime: { $exists: true, $ne: null },
    }).populate("userId", "name");

    // Step 2: Filter those where parsed startTime is older than 9 hours
    const filtered = rawAttendance.filter(entry => {
      const parsedStart = new Date(entry.startTime);
      return parsedStart <= nineHoursAgo;
    });

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching error attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTodayAttendanceByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const attendance = await todayattendance.findOne({
      userId: new mongoose.Types.ObjectId(id),
      status: { $ne: "Clock Out" },
    }).select("startTime status statusHistory");

    if (!attendance) {
      return res.status(404).json({ message: "No attendance record found for today" });
    }

    let totalBreakSeconds = 0;
    const history = attendance.statusHistory;

    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i + 1];

      if (current.status === "On Break" && next.status === "Working") {
        const start = new Date(current.timestamp);
        const end = new Date(next.timestamp);
        totalBreakSeconds += Math.floor((end - start) / 1000);
      }
    }

    // If last status is "On Break", count break time until now
    const lastEntry = history[history.length - 1];
    if (lastEntry?.status === "On Break") {
      const start = new Date(lastEntry.timestamp);
      const end = new Date();
      totalBreakSeconds += Math.floor((end - start) / 1000);
    }

    // Format seconds to HH:MM:SS
    const hours = String(Math.floor(totalBreakSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalBreakSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalBreakSeconds % 60).padStart(2, "0");

    const breakTime = `${hours}:${minutes}:${seconds}`;

    res.status(200).json({
      startTime: attendance.startTime,
      status: attendance.status,
      breakTime,
    });
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  ErrorAttendance,
  getDepartments,
  getRoles,
  getEmployee,
  getAttendenceById,
  getLeave,
  getUserProfile,
  ClockInNow,
  getDashboardCounts,
  getUserCountByDepartment,
  getTasksByUser,
  getPendingTasksByUser,
  getTodayAttendanceByUser
};