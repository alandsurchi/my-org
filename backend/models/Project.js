const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // Origin/category of the project (e.g. provision, distribution, renovation, building, news)
  category: {
    type: String,
    trim: true,
    enum: [
      'provision',
      'distribution',
      'renovation',
      'building',
      'news',
      'water',
      'education',
      'emergency',
      'healthcare'
    ],
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'planned', 'on-hold'],
    default: 'active'
  },
  imageUrl: {
    type: String
  },
  // Optional location field mapped from template forms (city/province etc.)
  location: {
    type: String,
    trim: true,
    default: null
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
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
