const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/projects/')
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

// GET all projects
router.get('/', async (req, res) => {
  try {
    console.log('🚀 API: Fetching all projects from database...');
    const { status } = req.query;
    const filter = status ? { status } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    console.log(`🚀 API: Found ${projects.length} projects`);
    console.log('🚀 API: First item:', projects[0] ? projects[0].title : 'No items');
    
    // Transform projects to include both formats for frontend compatibility
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      title_en: project.title,
      description_en: project.description,
      created_at: project.createdAt
    }));
    
    res.json(transformedProjects);
  } catch (error) {
    console.error('❌ API: Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// GET single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// POST create new project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const projectData = {
      title: req.body.title || req.body.title_en,
      description: req.body.description || req.body.description_en,
      status: req.body.status || 'active',
      imageUrl: req.file ? `/uploads/projects/${req.file.filename}` : null,
      category: req.body.category || null,
      location: req.body.location || null
    };
    
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error: error.message });
  }
});

// PUT update project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      category: req.body.category,
      location: req.body.location,
      updatedAt: Date.now()
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/projects/${req.file.filename}`;
    }
    
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;
