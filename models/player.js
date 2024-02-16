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
  age: {
    type: Number,
    // required: true,
  },
  skills: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
