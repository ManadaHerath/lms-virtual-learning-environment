const express = require('express');
const db = require('./config/dbconfig');
const AuthRoute=require('./routes/AuthRoute')
const AdminAuthRoute=require('./routes/AdminAuthRoute');
const SectionRoute=require('./routes/sectionRoute');
const TypeRoute=require('./routes/TypeRoute');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const ExtendSessionRoute=require("./routes/ExtendSessionRoute")
// Middlewares in here
//Middleware for cross platform

const allowedOrigins = ['http://localhost:5173','http://localhost:5174'];
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, origin); 
  } else {
    callback(new Error('Not allowed by CORS'));
  }
},
credentials: true,// Allow credentials (cookies, etc.)
}));
// Middleware to parse incoming JSON requests
app.use(express.json());
app.use('/api/user', AuthRoute);
app.use('/api/session',ExtendSessionRoute);
app.use('/api/admin',AdminAuthRoute);
app.use('/api/course',SectionRoute);
app.use('/api/type',TypeRoute);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
