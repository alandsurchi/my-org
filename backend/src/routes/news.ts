import express from 'express';
import { News } from '../models/News';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all news (public)
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ status: 'published' })
      .sort({ created_at: -1 })
      .limit(parseInt(req.query.limit as string) || 50);
    
    res.json(news);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get news by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create news (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, image_url, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const news = new News({
      title,
      content,
      excerpt,
      image_url,
      status: status || 'draft',
      author_id: (req as any).user.id
    });

    await news.save();
    res.status(201).json(news);

  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update news (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, image_url, status } = req.body;

    const news = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        excerpt,
        image_url,
        status,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json(news);

  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete news (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });

  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
