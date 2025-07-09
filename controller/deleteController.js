const Department = require("../model/department");
const User = require("../model/user");

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDep = await Department.findByIdAndDelete(id);
        if (!deletedDep) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error("Error deleting Department:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { deleteEmployee, deleteDepartment };