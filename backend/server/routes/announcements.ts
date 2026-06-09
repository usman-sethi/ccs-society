import express from 'express';
import { Announcement } from '../models/index';
import { uploadImage } from '../../lib/cloudinary';

const router = express.Router();

router.get('/test-connection', async (req, res) => {
  try {
    const count = await Announcement.countDocuments();
    res.json({ success: true, count, database: 'MongoDB' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const announcements = await Announcement.find().sort({ created_at: -1 }).lean();
    
    const formattedAnnouncements = announcements.map(announcement => {
      const { _id, ...rest } = announcement;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedAnnouncements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.post('/', async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'announcements');
    }

    const newAnnouncement = new Announcement({
      title: req.body.title || '',
      content: req.body.content || '',
      created_by: req.body.created_by || 'Admin',
      type: req.body.type || 'info',
      image: imageUrl,
    });
    
    await newAnnouncement.save();
    
    const obj = newAnnouncement.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error: any) {
    console.error('Failed to add announcement. Detailed error:', error);
    res.status(500).json({ error: `Failed to add announcement: ${error.message || 'Unknown error'}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingAnnouncement = await Announcement.findById(id);
    
    if (!existingAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    let imageUrl = req.body.image !== undefined ? req.body.image : existingAnnouncement.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'announcements');
    }

    existingAnnouncement.title = req.body.title !== undefined ? req.body.title : existingAnnouncement.title;
    existingAnnouncement.content = req.body.content !== undefined ? req.body.content : existingAnnouncement.content;
    existingAnnouncement.type = req.body.type !== undefined ? req.body.type : existingAnnouncement.type;
    existingAnnouncement.image = imageUrl;

    await existingAnnouncement.save();
    
    const obj = existingAnnouncement.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    console.error('Failed to update announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    
    if (!deletedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
