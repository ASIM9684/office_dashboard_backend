const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./database/database');
const router = require('./route/routes');
const useragent = require("express-useragent");
require("dotenv").config();

connectDB();
app.use(cors());
app.use(express.json());
app.use(useragent.express());
app.use(router);

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log('Server is running on port 8000');
});