const express = require('express');
const router = express.Router();
const News = require('../models/News');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/news/')
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET all news
router.get('/', async (req, res) => {
  try {
    console.log('📰 API: Fetching all news from database...');
    const allNews = await News.find().sort({ createdAt: -1 });
    console.log(`📰 API: Found ${allNews.length} news items`);
    console.log('📰 API: First item:', allNews[0] ? allNews[0].title : 'No items');
    
    // Log all categories to help debug
    if (allNews.length > 0) {
      const categories = allNews.map(n => n.category).filter(Boolean);
      const uniqueCategories = [...new Set(categories)];
      console.log('📰 API: Categories found:', uniqueCategories);
    }
    
    res.json(allNews);
  } catch (error) {
    console.error('❌ API: Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// GET single news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// POST create new news
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newsData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || null,
      imageUrl: req.file ? `/uploads/news/${req.file.filename}` : null
    };
    
    const news = new News(newsData);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Error creating news', error: error.message });
  }
});

// PUT update news
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || null,
      updatedAt: Date.now()
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/news/${req.file.filename}`;
    }
    
    const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: 'Error updating news', error: error.message });
  }
});

// DELETE news
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
});

module.exports = router;
