const express = require('express');
const db = require('./config/dbconfig');
const AuthRoute=require('./routes/AuthRoute')
const AdminAuthRoute=require('./routes/AdminAuthRoute');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const ExtendSessionRoute=require("./routes/ExtendSessionRoute")
// Middlewares in here
//Middleware for cross platform
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(express.json());
app.use('/user', AuthRoute);
app.use('/session',ExtendSessionRoute);
app.use('/admin',AdminAuthRoute);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
