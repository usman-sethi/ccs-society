import express from 'express';
import { Event } from '../models/index';
import { uploadImage } from '../../lib/cloudinary';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const events = await Event.find().sort({ created_at: -1 }).lean();
    
    // Map _id to id for frontend compatibility
    const formattedEvents = events.map(event => {
      const { _id, ...rest } = event;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/', async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'events');
    }

    const newEvent = new Event({
      title: req.body.title || '',
      description: req.body.description || '',
      date: req.body.date || '',
      image: imageUrl,
      registration_link: req.body.registration_link || '',
      created_by: req.body.created_by || 'Admin'
    });
    
    await newEvent.save();
    
    const obj = newEvent.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error: any) {
    console.error('Failed to add event. Detailed error:', error);
    res.status(500).json({ error: `Failed to add event: ${error.message || 'Unknown error'}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingEvent = await Event.findById(id);
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    let imageUrl = req.body.image !== undefined ? req.body.image : existingEvent.image || '';
    if (imageUrl.startsWith('data:image')) {
      imageUrl = await uploadImage(imageUrl, 'events');
    }

    existingEvent.title = req.body.title !== undefined ? req.body.title : existingEvent.title;
    existingEvent.description = req.body.description !== undefined ? req.body.description : existingEvent.description;
    existingEvent.date = req.body.date !== undefined ? req.body.date : existingEvent.date;
    existingEvent.image = imageUrl;
    existingEvent.registration_link = req.body.registration_link !== undefined ? req.body.registration_link : existingEvent.registration_link;

    await existingEvent.save();
    
    const obj = existingEvent.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    console.error('Failed to update event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
