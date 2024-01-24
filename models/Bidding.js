const mongoose = require('mongoose');

const biddingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  biddingPrice: {
    type: Number,
    required: true,
  },
});

const Bidding = mongoose.model('Bidding', biddingSchema);

module.exports = Bidding;
