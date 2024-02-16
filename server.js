const express = require('express');
const connectDB = require('./utils/db');
const playerRoutes = require('./routes/playerRoutes');
const loginRoutes = require('./routes/loginRoutes'); // Import the loginRoutes
const teamRoutes = require('./routes/teamRoutes'); // Import the loginRoutes
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/auth', loginRoutes); // Use the loginRoutes for authentication
app.use('/api/teams', teamRoutes); // Use the loginRoutes for authentication



const User = mongoose.model("User");


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
