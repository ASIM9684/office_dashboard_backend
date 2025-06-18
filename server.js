const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./database/database');
const router = require('./route/routes');
const Department = require('./model/department');
const Role = require('./model/role');
const useragent = require("express-useragent");
connectDB();
app.use(cors());
app.use(express.json());
app.use(useragent.express());
app.use(router);


async function seedDefaults() {
  const defaultDepartments = [
    'Human Resources',
    'Engineering',
    'Finance',
    'Marketing',
    'Sales',
    'IT Support'
  ];

  const defaultRoles = [
    'Admin',
    'HR',
    'Employee',
    'Manager'
  ];

  try {
    // Seed Departments
    for (const name of defaultDepartments) {
      const exists = await Department.findOne({ name });
      if (!exists) {
        await Department.create({ name });
        console.log(`Department "${name}" created.`);
      }
    }

    // Seed Roles
    for (const name of defaultRoles) {
      const exists = await Role.findOne({ name });
      if (!exists) {
        await Role.create({ name });
        console.log(`Role "${name}" created.`);
      }
    }

    console.log('Seeding completed.');
  } catch (err) {
    console.error('Error during seeding:', err);
  }
}
// seedDefaults()
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});