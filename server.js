const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./database/database');
const router = require('./route/routes');
const useragent = require("express-useragent");
connectDB();
app.use(cors());
app.use(express.json());
app.use(useragent.express());
app.use(router);


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});