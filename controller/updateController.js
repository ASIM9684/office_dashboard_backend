const Department = require("../model/department");
const User = require("../model/user");

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email, department, role, phone,joiningDate } = req.body;
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
                joinDate: joiningDate
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name} = req.body;
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
                name
            },
            { new: true }
        );

        if (!updatedDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department updated successfully", Department: updatedDepartment });
    } catch (error) {
        console.error("Error updating Department:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = {updateEmployee,updateDepartment};