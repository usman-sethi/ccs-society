import { Router } from 'express';
import { Feedback } from '../models/index';

const router = Router();

// Create new feedback (public)
router.post('/', async (req, res) => {
  try {
    const { authorName, authorEmail, title, content } = req.body;
    if (!authorName || !title || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const feedback = new Feedback({
      authorName,
      authorEmail,
      title,
      content,
      status: 'pending'
    });
    const saved = await feedback.save();
    res.status(201).json({ success: true, feedback: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// Admin: Get all feedbacks
router.get('/admin', async (req, res) => {
  try {
    const status = req.query.status as string;
    const filter = status ? { status } : {};
    const feedbacks = await Feedback.find(filter).sort({ created_at: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// Admin: Update feedback status
router.patch('/admin/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const updateData: any = { status };
    if (status === 'approved') {
      updateData.approved_at = new Date();
    }

    const updated = await Feedback.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.json({ success: true, feedback: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// Public: Get approved feedbacks
router.get('/blog', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ status: 'approved' }).sort({ created_at: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

export default router;
