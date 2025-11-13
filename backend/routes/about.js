const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for about image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/about');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// About Image Schema (stored in memory for simplicity, could use MongoDB)
let aboutImageData = null;

// GET current about image
router.get('/', (req, res) => {
  if (!aboutImageData) {
    return res.status(404).json({ message: 'No about image set' });
  }
  res.json(aboutImageData);
});

// POST new about image
router.post('/', upload.single('aboutImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Delete old about image if exists
    if (aboutImageData && aboutImageData.fileName) {
      const oldImagePath = path.join(__dirname, '../uploads/about', aboutImageData.fileName);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('🗑️ Deleted old about image:', aboutImageData.fileName);
      }
    }

    // Get image dimensions
    const sizeOf = require('image-size');
    const imagePath = req.file.path;
    let dimensions = { width: 0, height: 0 };
    try {
      dimensions = sizeOf(imagePath);
    } catch (err) {
      console.warn('Could not get image dimensions:', err.message);
    }

    // Create new about image data
    aboutImageData = {
      url: `/uploads/about/${req.file.filename}`,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      dimensions: {
        width: dimensions.width,
        height: dimensions.height
      },
      uploadedBy: 'admin',
      uploadedAt: new Date(),
      isActive: true
    };

    console.log('✅ About image uploaded:', aboutImageData);

    res.status(200).json({
      message: 'About image uploaded successfully',
      image: aboutImageData
    });

  } catch (error) {
    console.error('❌ Error uploading about image:', error);
    res.status(500).json({ 
      message: 'Failed to upload about image',
      error: error.message 
    });
  }
});

// DELETE about image
router.delete('/', (req, res) => {
  try {
    if (!aboutImageData) {
      return res.status(404).json({ message: 'No about image to delete' });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '../uploads/about', aboutImageData.fileName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('🗑️ Deleted about image file:', aboutImageData.fileName);
    }

    aboutImageData = null;

    res.json({ message: 'About image deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting about image:', error);
    res.status(500).json({ 
      message: 'Failed to delete about image',
      error: error.message 
    });
  }
});

module.exports = router;
