const mongoose = require('mongoose');

const skipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
});

const Skip = mongoose.model('Skip',skipSchema);

module.exports = Skip;
