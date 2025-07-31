import express from 'express';
import mongoose from 'mongoose';
import { News } from '../models/News';
import { Project } from '../models/Project';
import { Staff } from '../models/Staff';
import { StaffAccount } from '../models/StaffAccount';
import { Gallery } from '../models/Gallery';

const router = express.Router();

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const [newsCount, projectsCount, staffCount, staffAccountsCount, galleryCount] = await Promise.all([
      News.countDocuments(),
      Project.countDocuments(),
      Staff.countDocuments(),
      StaffAccount.countDocuments(),
      Gallery.countDocuments()
    ]);

    const dbStats = mongoose.connection.db ? await mongoose.connection.db.stats() : null;

    res.json({
      database: 'org_website',
      connection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      collections: {
        news: newsCount,
        projects: projectsCount,
        staff: staffCount,
        staffAccounts: staffAccountsCount,
        gallery: galleryCount
      },
      databaseStats: dbStats ? {
        dataSize: Math.round(dbStats.dataSize / 1024) + ' KB',
        storageSize: Math.round(dbStats.storageSize / 1024) + ' KB',
        indexes: dbStats.indexes,
        collections: dbStats.collections
      } : null
    });
  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({ error: 'Failed to get database stats' });
  }
});

// Get all collections data
router.get('/data', async (req, res) => {
  try {
    const [news, projects, staff, staffAccounts, gallery] = await Promise.all([
      News.find().limit(10),
      Project.find().limit(10),
      Staff.find().limit(10),
      StaffAccount.find().select('-password').limit(10),
      Gallery.find().limit(10)
    ]);

    res.json({
      news,
      projects,
      staff,
      staffAccounts,
      gallery
    });
  } catch (error) {
    console.error('Database data error:', error);
    res.status(500).json({ error: 'Failed to get database data' });
  }
});

// Get specific collection data
router.get('/collection/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    let data;
    switch (name) {
      case 'news':
        data = await News.find().limit(limit);
        break;
      case 'projects':
        data = await Project.find().limit(limit);
        break;
      case 'staff':
        data = await Staff.find().limit(limit);
        break;
      case 'staffaccounts':
        data = await StaffAccount.find().select('-password').limit(limit);
        break;
      case 'gallery':
        data = await Gallery.find().limit(limit);
        break;
      default:
        return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      collection: name,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Collection data error:', error);
    res.status(500).json({ error: 'Failed to get collection data' });
  }
});

export default router;
