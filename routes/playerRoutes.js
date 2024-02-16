const express = require('express');
const router = express.Router();
const cors = require('cors');
const Player = require('../models/player');
const Bidding = require('../models/Bidding'); // Make sure you have a Bidding model
const Team = require('../models/Team'); // Make sure you have a Bidding model
const Skip = require('../models/Skip');
const cache = {}

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Route to handle player details submission
router.post('/', (req, res) => {
  const { name, team, state, age, skills, category } = req.body;

  // Validate input
  if (!name || !team || !state || !age || !skills || !category) {
    return res.status(400).json({ error: 'Name, team,state, skills , category and age price are required' });
  }

  // Save player details to the database
  const player = new Player({ name, team, state, age, skills, category });
  player.save()
    .then(() => {
      // Respond with the saved player details
      res.status(201).json({
        name: player.name,
        team: player.team,
        state: player.state,
        age: player.age,
        skills: player.skills,
        category: player.category,
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
router.post('/biddings', async (req, res) => {
  const { name, team, biddingPrice } = req.body;

  // Validate input
  if (!name || !team || !biddingPrice) {
    return res.status(400).json({ error: 'Name, team, and bidding price are required' });
  }

  try {
    // Check if the team has less than 4 players
    const teamPlayersCount = await Bidding.countDocuments({ team });
    if (teamPlayersCount == 4) {
      return res.status(602).json({ error: 'Team already has 4 players' });
    }

    const { balance } = await Team.findOne({ name: team });
    console.log(balance);
    const bidding = new Bidding({ name, team, biddingPrice });
    console.log(biddingPrice)
    if (parseInt(balance) >= parseInt(biddingPrice)) {
      // Save bidding details to the 'biddings' collection
      await bidding.save();

      // Update the corresponding player's state to 'S'
      await Player.updateOne({ name: bidding.name }, { state: 'S' });

      const newBalance = (balance - biddingPrice);
      console.log(newBalance);
      await Team.updateOne({ name: team }, { balance: newBalance.toString() });
      // Respond with the saved bidding details
      res.status(201).json({
        name: bidding.name,
        team: bidding.team,
        biddingPrice: bidding.biddingPrice,
      });
    } else {
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

router.post('/skip', async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  await Player.updateOne({ name: name }, { state: 'Skipped' });
  // Save player details to the database
  const skip = new Skip({ name });
  skip.save()
    .then(() => {
      // Respond with the saved player details
      res.status(201).json({
        name: skip.name,

      });
    })
    .catch((error) => {
      console.error('Error submitting skip player details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });

});
// Route to retrieve all skip
router.get('/allskip', (req, res) => {
  Skip.find()
    .then((skip) => {
      // Respond with the list of players
      res.status(200).json(skip);
    })
    .catch((error) => {
      console.error('Error retrieving players:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
async function getPosts() {
  try {
    const posts = await Bidding.find().sort({ _id: -1 }).limit(1);
    console.log(posts);
  } catch (error) {
    console.log(error.message);
  }
}
getPosts();

router.get('/biddings/latestbid', async (req, res) => {
  try {
    const posts = await Bidding.find().sort({ _id: -1 }).limit(1);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/deleteLatestBid', async (req, res) => {
  try {
    // Assuming your Bidding model has a field named 'userid', use it to find and delete the latest bid
    const posts = await Bidding.find().sort({ _id: -1 }).limit(1);
    console.log(posts[0].name)
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No bids found for the user.' });
    }

    // Update the corresponding player's state to 'U'
    await Player.updateOne({ name: posts[0].name }, { state: 'U' });
    await Team.updateOne({ name: posts[0].team }, { balance: balance+biddingPrice });


    // Use await for findOneAndDelete
    const latestBid = await Bidding.findOneAndDelete({ _id: posts[0]._id });

    res.status(200).json({ message: 'Latest bid deleted successfully.', deletedBid: latestBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


