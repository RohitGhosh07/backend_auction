const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // leagueID: {
  //   type: String,
  //   required: true,
  // },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
