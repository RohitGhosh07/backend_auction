const express = require('express');
const router = express.Router();
const cors = require('cors');
const Player = require('../models/player');
const Bidding = require('../models/Bidding'); // Make sure you have a Bidding model

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Route to handle player details submission
router.post('/', (req, res) => {
  const { name, team, biddingPrice } = req.body;

  // Validate input
  if (!name || !team || !biddingPrice) {
    return res.status(400).json({ error: 'Name, team, and bidding price are required' });
  }

  // Save player details to the database
  const player = new Player({ name, team, biddingPrice });
  player.save()
    .then(() => {
      // Respond with the saved player details
      res.status(201).json({
        name: player.name,
        team: player.team,
        biddingPrice: player.biddingPrice,
      });
    })
    .catch((error) => {
      console.error('Error submitting player details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Route to retrieve all players
router.get('/', (req, res) => {
  Player.find()
    .then((players) => {
      // Respond with the list of players
      res.status(200).json(players);
    })
    .catch((error) => {
      console.error('Error retrieving players:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Route to handle bidding details submission
router.post('/biddings', async (req, res) => {
  const { name, team, biddingPrice } = req.body;

  // Validate input
  if (!name || !team || !biddingPrice) {
    return res.status(400).json({ error: 'Name, team, and bidding price are required' });
  }

  try {
    // Save bidding details to the 'biddings' collection
    const bidding = new Bidding({ name, team, biddingPrice });
    await bidding.save();

    // Respond with the saved bidding details
    res.status(201).json({
      name: bidding.name,
      team: bidding.team,
      biddingPrice: bidding.biddingPrice,
    });
  } catch (error) {
    console.error('Error submitting bidding details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve all bidding details
router.get('/biddings', async (req, res) => {
  try {
    const biddings = await Bidding.find();
    // Respond with the list of bidding details
    res.status(200).json(biddings);
  } catch (error) {
    console.error('Error retrieving biddings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
