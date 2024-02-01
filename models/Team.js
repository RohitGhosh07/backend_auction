const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
});

const Team = mongoose.model('Teams', teamSchema);

module.exports = Team;
