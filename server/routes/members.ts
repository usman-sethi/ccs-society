import express from 'express';
import { Member } from '../models/index';
import { uploadImage } from '../../lib/cloudinary';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const members = await Member.find().sort({ joined_at: -1 }).lean();
    
    const formattedMembers = members.map(member => {
      const { _id, ...rest } = member;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedMembers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

router.post('/', async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'members');
    }

    const newMember = new Member({
      name: req.body.name || req.body.user_id || '',
      user_id: req.body.user_id || '',
      team_id: req.body.team_id || '',
      role: req.body.role || '',
      image: imageUrl,
      bio: req.body.bio || ''
    });
    
    await newMember.save();
    
    const obj = newMember.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    console.error('Failed to add member:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingMember = await Member.findById(id);
    
    if (!existingMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let imageUrl = req.body.image !== undefined ? req.body.image : existingMember.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'members');
    }

    existingMember.name = req.body.name !== undefined ? req.body.name : existingMember.name;
    existingMember.user_id = req.body.user_id !== undefined ? req.body.user_id : existingMember.user_id;
    existingMember.team_id = req.body.team_id !== undefined ? req.body.team_id : existingMember.team_id;
    existingMember.role = req.body.role !== undefined ? req.body.role : existingMember.role;
    existingMember.image = imageUrl;
    existingMember.bio = req.body.bio !== undefined ? req.body.bio : existingMember.bio;

    await existingMember.save();
    
    const obj = existingMember.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    console.error('Failed to update member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await Member.findByIdAndDelete(id);
    
    if (!deletedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

export default router;
