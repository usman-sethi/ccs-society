import express from 'express';
import { Developer } from '../models/index';
import { uploadImage } from '../../lib/cloudinary';

const router = express.Router();

// Get all developers
router.get('/', async (req, res) => {
  try {
    const developers = await Developer.find().sort({ created_at: 1 }).lean();
    res.json(developers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a developer
router.post('/', async (req, res) => {
  try {
    const { name, role, bio, github, linkedin, image, skills } = req.body;
    let imageUrl = image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'developers');
    }

    const developer = new Developer({
      name,
      role,
      bio,
      github,
      linkedin,
      image: imageUrl,
      skills
    });
    await developer.save();
    res.status(201).json(developer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a developer
router.put('/:id', async (req, res) => {
  try {
    const { name, role, bio, github, linkedin, image, skills } = req.body;
    
    const existingDeveloper = await Developer.findById(req.params.id);
    if (!existingDeveloper) {
      return res.status(404).json({ error: 'Developer not found' });
    }

    let imageUrl = image !== undefined ? image : existingDeveloper.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'developers');
    }

    const developer = await Developer.findByIdAndUpdate(
      req.params.id,
      { name, role, bio, github, linkedin, image: imageUrl, skills },
      { new: true }
    );
    res.json(developer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a developer
router.delete('/:id', async (req, res) => {
  try {
    const developer = await Developer.findByIdAndDelete(req.params.id);
    if (!developer) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    res.json({ message: 'Developer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
