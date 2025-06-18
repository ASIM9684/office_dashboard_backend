const {addEmployee, addDepartment, addAttendance, addLeave, addTodayAttendance, assignTask} = require('../controller/addController');
const { login, authenticate } = require('../controller/authorization');
const { deleteEmployee, deleteDepartment } = require('../controller/deleteController');
const { getDepartments, getRoles, getEmployee, getAttendenceById, getLeave, getUserProfile, ClockInNow, getDashboardCounts, getUserCountByDepartment, getTasksByUser } = require('../controller/fetchContoller');
const { updateEmployee, updateDepartment, updateLeave, updateuser, updatetodayattendance, updateTask } = require('../controller/updateController');

const router = require('express').Router();

router.post("/addleave/:id", addLeave); 
router.post("/assignTask", assignTask); 
router.post("/addAttendance", addAttendance); 
router.post("/addTodayAttendance", addTodayAttendance); 
router.post("/addDepartment", addDepartment); 
router.post("/addemployee", addEmployee);  
router.get("/getUserCountByDepartment",getUserCountByDepartment);
router.get("/getDepartments",getDepartments);
router.get("/getRoles",getRoles);
router.get("/getEmployee",getEmployee);
router.get("/getUserProfile/:id",getUserProfile);
router.get("/getTasksByUser/:userId",getTasksByUser);
router.get("/ClockInNow",ClockInNow);
router.get("/getAttendenceById/:id", getAttendenceById);
router.get("/getLeave",authenticate, getLeave);
router.get("/getDashboardCounts", getDashboardCounts);
router.post("/login", login)
router.put("/updatetodayattendance/:id", updatetodayattendance);
router.put("/updateLeave/:id", updateLeave);
router.put("/updateEmployee/:id", updateEmployee);
router.put("/updateDepartment/:id", updateDepartment);
router.put("/updateuser/:id", updateuser);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteEmployee/:id", deleteEmployee);
router.delete("/deleteDepartment/:id", deleteDepartment);

module.exports = router;