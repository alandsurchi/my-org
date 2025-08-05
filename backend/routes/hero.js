const express = require('express');
const router = express.Router();
const HeroImage = require('../models/HeroImage');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/hero/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for hero images
  }
});

// GET current hero image
router.get('/', async (req, res) => {
  try {
    const heroImage = await HeroImage.findOne().sort({ updatedAt: -1 });
    if (!heroImage) {
      return res.status(404).json({ message: 'No hero image found' });
    }
    res.json(heroImage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hero image', error: error.message });
  }
});

// POST upload new hero image
router.post('/', upload.single('heroImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const heroImageData = {
      url: `/uploads/hero/${req.file.filename}`,
      updatedAt: Date.now()
    };
    
    // Delete old hero images (keep only the latest)
    await HeroImage.deleteMany({});
    
    const heroImage = new HeroImage(heroImageData);
    await heroImage.save();
    res.status(201).json(heroImage);
  } catch (error) {
    res.status(400).json({ message: 'Error uploading hero image', error: error.message });
  }
});

// PUT update hero image
router.put('/', upload.single('heroImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Delete old hero images
    await HeroImage.deleteMany({});
    
    const heroImageData = {
      url: `/uploads/hero/${req.file.filename}`,
      updatedAt: Date.now()
    };
    
    const heroImage = new HeroImage(heroImageData);
    await heroImage.save();
    res.json(heroImage);
  } catch (error) {
    res.status(400).json({ message: 'Error updating hero image', error: error.message });
  }
});

module.exports = router;
