const express = require('express');
const router = express.Router();
const GalleryPhoto = require('../models/GalleryPhoto');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/gallery/')
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
  }
  // No file size limit - accept any size
});

// GET all gallery photos
router.get('/', async (req, res) => {
  try {
    const photos = await GalleryPhoto.find().sort({ uploadedAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery photos', error: error.message });
  }
});

// GET single photo by ID
router.get('/:id', async (req, res) => {
  try {
    const photo = await GalleryPhoto.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photo', error: error.message });
  }
});

// POST upload new photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }
    
    const photoData = {
      url: `/uploads/gallery/${req.file.filename}`,
      title: req.body.title || 'Untitled',
      description: req.body.description || '',
      caption: req.body.caption || '' // Keep for backwards compatibility
    };
    
    const photo = new GalleryPhoto(photoData);
    await photo.save();
    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ message: 'Error uploading photo', error: error.message });
  }
});

// PUT update photo caption
router.put('/:id', async (req, res) => {
  try {
    const photo = await GalleryPhoto.findByIdAndUpdate(
      req.params.id, 
      { caption: req.body.caption }, 
      { new: true }
    );
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating photo', error: error.message });
  }
});

// DELETE photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo', error: error.message });
  }
});

module.exports = router;
