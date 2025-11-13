const mongoose = require('mongoose');

const GalleryPhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true,
    default: 'Untitled'
  },
  description: {
    type: String,
    trim: true
  },
  caption: {
    type: String,
    trim: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalleryPhoto', GalleryPhotoSchema);
