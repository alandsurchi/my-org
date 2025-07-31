import express from 'express';
import bcrypt from 'bcryptjs';
import { StaffAccount } from '../models/StaffAccount';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all staff accounts (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const accounts = await StaffAccount.find()
      .select('-password') // Exclude password field
      .sort({ created_at: -1 });
    
    res.json(accounts);
  } catch (error) {
    console.error('Get staff accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get staff account by ID (admin only)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const account = await StaffAccount.findById(req.params.id).select('-password');
    
    if (!account) {
      return res.status(404).json({ error: 'Staff account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error('Get staff account by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create staff account (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, status } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required' });
    }

    // Check if email already exists
    const existingAccount = await StaffAccount.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const account = new StaffAccount({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'viewer',
      status: status || 'active'
    });

    await account.save();
    
    // Return account without password
    const accountResponse = account.toObject();
    delete (accountResponse as any).password;
    
    res.status(201).json(accountResponse);

  } catch (error) {
    console.error('Create staff account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update staff account (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, status } = req.body;

    const updateData: any = {
      firstName,
      lastName,
      email,
      role,
      status,
      updated_at: new Date()
    };

    // If password is provided, hash it
    if (password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const account = await StaffAccount.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!account) {
      return res.status(404).json({ error: 'Staff account not found' });
    }

    res.json(account);

  } catch (error) {
    console.error('Update staff account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete staff account (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const account = await StaffAccount.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({ error: 'Staff account not found' });
    }

    res.json({ message: 'Staff account deleted successfully' });

  } catch (error) {
    console.error('Delete staff account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
