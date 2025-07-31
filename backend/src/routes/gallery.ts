import express from 'express';
import { Gallery } from '../models/Gallery';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter: any = { status: 'active' };
    
    if (category) {
      filter.category = category;
    }

    const images = await Gallery.find(filter)
      .sort({ order: 1, created_at: -1 })
      .limit(parseInt(req.query.limit as string) || 100);
    
    res.json(images);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get gallery categories (public)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Gallery.distinct('category', { status: 'active' });
    res.json(categories.filter(cat => cat)); // Filter out null/undefined
  } catch (error) {
    console.error('Get gallery categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get gallery image by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Get gallery image by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload gallery image (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, category, tags, order, status } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Title and image URL are required' });
    }

    const image = new Gallery({
      title,
      description,
      image_url,
      category: category || 'general',
      tags: tags || [],
      order: order || 0,
      status: status || 'active'
    });

    await image.save();
    res.status(201).json(image);

  } catch (error) {
    console.error('Create gallery image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update gallery image (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, category, tags, order, status } = req.body;

    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image_url,
        category,
        tags,
        order,
        status,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }

    res.json(image);

  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete gallery image (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }

    res.json({ message: 'Gallery image deleted successfully' });

  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
