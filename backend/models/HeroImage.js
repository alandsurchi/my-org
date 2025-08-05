const mongoose = require('mongoose');

const HeroImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HeroImage', HeroImageSchema);
