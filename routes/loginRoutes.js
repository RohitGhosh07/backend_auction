const express = require('express');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Route to handle user registration
router.post('/', async (req, res) => {
  try {
    const {  username, password } = req.body;

    // Validate input
    if ( !username || !password) {
      return res.status(400).json({ error: ' username, and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this username' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Save user details to the database
    const user = new User({  username, password: hashedPassword });
    await user.save();

    // Respond with the saved user details
    res.status(201).json({
      username: user.username,
    });
  } catch (error) {
    console.error('Error submitting user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve all users
// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.get('/users', async (req, res) => {
  try {
      const { username } = req.query;

      if (username) {
          // If teamid is provided, retrieve a specific team by _id
          const usernames = await User.findById(username);

          if (!usernames) {
              return res.status(404).json({ error: 'User not found' });
          }

          // Respond with the details of the specific team
          return res.status(200).json({
              name: usernames.name,
              password: usernames.password,
              
          });
      }

      // If teamid is not provided, retrieve all teams
      const usernames = await User.find();

      // Respond with the list of teams
      res.status(200).json(usernames);
  } catch (error) {
      console.error('Error retrieving teams:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
