const mongoose = require('mongoose');

const HeroImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number,
    default: 0
  },
  mimeType: {
    type: String,
    default: ''
  },
  dimensions: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  uploadedBy: {
    type: String,
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
HeroImageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HeroImage', HeroImageSchema);
