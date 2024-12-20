//===================================================================
// Backend server for the application
//===================================================================
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');
const cors = require('cors'); // Import cors

const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const educationRoutes = require('./routes/educationRoutes');
const healthcareRoutes = require('./routes/healthcareRoutes');

dotenv.config();

//========================================================================================================================
// Validate SESSION_SECRET
if (!process.env.SESSION_SECRET) {
  console.error('Error: SESSION_SECRET is not set. Please check your .env file.');
  process.exit(1);
}
//========================================================================================================================


//========================================================================================================================
// MongoDB connection
connectDB();
const app = express();
//========================================================================================================================

//========================================================================================================================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
//========================================================================================================================

//========================================================================================================================
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000, 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
  },
}));
//========================================================================================================================
// Middleware to parse JSON requests
app.use(express.json());

// Serve static files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));

//========================================================================================================================
// Normal routess
app.use('/api/user', userRoutes); 
app.use('/api/education', educationRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/wallet', walletRoutes);
//========================================================================================================================

//========================================================================================================================
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});
//========================================================================================================================

module.exports = app;