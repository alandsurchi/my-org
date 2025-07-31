import express from 'express';
import { Project } from '../models/Project';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'active' })
      .sort({ created_at: -1 })
      .limit(parseInt(req.query.limit as string) || 50);
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, project_url, status, technologies } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const project = new Project({
      title,
      description,
      image_url,
      project_url,
      status: status || 'active',
      technologies: technologies || []
    });

    await project.save();
    res.status(201).json(project);

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, project_url, status, technologies } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image_url,
        project_url,
        status,
        technologies,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
