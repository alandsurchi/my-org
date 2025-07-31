import express from 'express';
import { Staff } from '../models/Staff';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all staff (public)
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({ status: 'active' })
      .sort({ order: 1, created_at: -1 })
      .limit(parseInt(req.query.limit as string) || 50);
    
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get staff by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const staffMember = await Staff.findById(req.params.id);
    
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staffMember);
  } catch (error) {
    console.error('Get staff by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create staff member (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, position, bio, image_url, email, phone, social_links, order, status } = req.body;

    if (!name || !position) {
      return res.status(400).json({ error: 'Name and position are required' });
    }

    const staff = new Staff({
      name,
      position,
      bio,
      image_url,
      email,
      phone,
      social_links: social_links || {},
      order: order || 0,
      status: status || 'active'
    });

    await staff.save();
    res.status(201).json(staff);

  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update staff member (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, position, bio, image_url, email, phone, social_links, order, status } = req.body;

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        name,
        position,
        bio,
        image_url,
        email,
        phone,
        social_links,
        order,
        status,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);

  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete staff member (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ message: 'Staff member deleted successfully' });

  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
