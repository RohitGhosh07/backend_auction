const express = require('express');
const router = express.Router();
const cors = require('cors');
const Team = require('../models/Team'); // Adjust the path based on your project structure
const Bidding = require('../models/Bidding'); // Import the Bidding model

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Route to handle team details submission
router.post('/', async (req, res) => {
    try {
        const { name, owner, balance, image } = req.body;

        // Validate input
        if (!name || !owner || !balance || !image) {
            return res.status(400).json({ error: 'Name, Owner, balance, and image are required' });
        }

        // Save team details to the database
        const team = new Team({ name, owner, balance, image });
        await team.save();

        // Fetch the latest bid price for the specified team
        const latestBid = await Bidding.findOne({ team: team._id })
            .sort({ createdAt: -1 })
            .limit(1);

        // If there's a latest bid, subtract it from the team's balance
        if (latestBid) {
            const updatedBalance = team.balance - latestBid.biddingPrice;
            await Team.updateOne({ _id: team._id }, { balance: updatedBalance });
        }

        // Respond with the saved team details
        res.status(201).json({
            name: team.name,
            owner: team.owner,
            image: team.image,
            balance: team.balance,
        });
    } catch (error) {
        console.error('Error submitting team details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to retrieve all teams or a specific team by _id
router.get('/allteams', async (req, res) => {
    try {
        const { _id } = req.query;

        if (_id) {
            // If teamid is provided, retrieve a specific team by _id
            const team = await Team.findById(_id);

            if (!team) {
                return res.status(404).json({ error: 'Team not found' });
            }

            // Respond with the details of the specific team
            return res.status(200).json({
                name: team.name,
                owner: team.owner,
                image: team.image,
                balance: team.balance,
            });
        }

        // If teamid is not provided, retrieve all teams
        const teams = await Team.find();

        // Respond with the list of teams
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error retrieving teams:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
