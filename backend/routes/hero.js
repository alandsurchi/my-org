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
    const heroImage = await HeroImage.findOne({ isActive: true }).sort({ updatedAt: -1 });
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
    
    // Get image dimensions (basic implementation)
    const sizeOf = require('image-size');
    let dimensions = { width: 0, height: 0 };
    try {
      dimensions = sizeOf(req.file.path);
    } catch (err) {
      console.warn('Could not get image dimensions:', err.message);
    }
    
    const heroImageData = {
      url: `/uploads/hero/${req.file.filename}`,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      dimensions: dimensions,
      uploadedBy: req.user?.email || 'admin',
      isActive: true,
      updatedAt: Date.now()
    };
    
    // Delete old hero images (keep only the latest)
    await HeroImage.updateMany({}, { isActive: false });
    
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
    
    // Get image dimensions
    const sizeOf = require('image-size');
    let dimensions = { width: 0, height: 0 };
    try {
      dimensions = sizeOf(req.file.path);
    } catch (err) {
      console.warn('Could not get image dimensions:', err.message);
    }
    
    // Deactivate old hero images
    await HeroImage.updateMany({}, { isActive: false });
    
    const heroImageData = {
      url: `/uploads/hero/${req.file.filename}`,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      dimensions: dimensions,
      uploadedBy: req.user?.email || 'admin',
      isActive: true,
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
