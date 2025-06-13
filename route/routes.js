const {addEmployee, addDepartment, addAttendance} = require('../controller/addController');
const { login } = require('../controller/authorization');
const { deleteEmployee, deleteDepartment } = require('../controller/deleteController');
const { getDepartments, getRoles, getEmployee, getAttendenceById } = require('../controller/fetchContoller');
const { updateEmployee, updateDepartment } = require('../controller/updateController');

const router = require('express').Router();

router.post("/addAttendance", addAttendance); 
router.post("/addDepartment", addDepartment); 
router.post("/addemployee", addEmployee);  
router.get("/getDepartments",getDepartments);
router.get("/getRoles",getRoles);
router.get("/getEmployee",getEmployee);
router.get("/getAttendenceById/:id", getAttendenceById);
router.post("/login", login)
router.put("/updateEmployee/:id", updateEmployee);
router.put("/updateDepartment/:id", updateDepartment);
router.delete("/deleteEmployee/:id", deleteEmployee);
router.delete("/deleteDepartment/:id", deleteDepartment);

module.exports = router;