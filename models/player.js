const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  biddingPrice: {
    type: Number,
    // required: true,
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
