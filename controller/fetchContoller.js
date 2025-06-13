const attendance = require("../model/attendance");
const Department = require("../model/department");
const Role = require("../model/role");
const User = require("../model/user");

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

module.exports = {
  getDepartments,
  getRoles,
  getEmployee,
  getAttendenceById
};