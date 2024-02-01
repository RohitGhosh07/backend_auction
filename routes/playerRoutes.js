const express = require('express');
const router = express.Router();
const cors = require('cors');
const Player = require('../models/player');
const Bidding = require('../models/Bidding'); // Make sure you have a Bidding model
const Team = require('../models/Team'); // Make sure you have a Bidding model

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Route to handle player details submission
router.post('/', (req, res) => {
  const { name, team, state, biddingPrice } = req.body;

  // Validate input
  if (!name || !team || !state || !biddingPrice) {
    return res.status(400).json({ error: 'Name, team,state and bidding price are required' });
  }

  // Save player details to the database
  const player = new Player({ name, team, state, biddingPrice });
  player.save()
    .then(() => {
      // Respond with the saved player details
      res.status(201).json({
        name: player.name,
        team: player.team,
        state: player.state,
        biddingPrice: player.biddingPrice,
      });
    })
    .catch((error) => {
      console.error('Error submitting player details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Route to retrieve all players
router.get('/allplayers', (req, res) => {
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
    



    const { balance } = await Team.findOne({ name: team });
    console.log(balance);
    if (balance >= biddingPrice) {
      const newBalance = (balance - biddingPrice);
      console.log(newBalance);
      await Team.updateOne({ name: team }, { balance: newBalance.toString() });
      // Update the corresponding player's state to 'S'
      await Player.updateOne({ name: bidding.name }, { state: 'S' });
      await bidding.save();
      // Respond with the saved bidding details
      res.status(201).json({
        name: bidding.name,
        team: bidding.team,
        biddingPrice: bidding.biddingPrice,
      });
    } else {
      // If the bidding price exceeds the balance, respond with an error
      res.status(601).json({ error: 'Bidding price exceeds team balance' });
    }




  } catch (error) {
    console.error('Error submitting bidding details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to retrieve all bidding details
router.get('/biddings/allbiddings', async (req, res) => {
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
