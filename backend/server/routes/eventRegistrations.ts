import express from 'express';
import { EventRegistration } from '../models/index';
import { uploadImage } from '../../lib/cloudinary';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const registrations = await EventRegistration.find().sort({ created_at: -1 }).lean();
    
    const formattedRegistrations = registrations.map(reg => {
      const { _id, ...rest } = reg;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedRegistrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event registrations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newRegistration = new EventRegistration({
      event_id: req.body.event_id || '',
      full_name: req.body.full_name || '',
      program: req.body.program || '',
      section: req.body.section || '',
      mobile_number: req.body.mobile_number || '',
      email: req.body.email || '',
      payment_proof: '',
      status: 'registered'
    });
    
    await newRegistration.save();
    
    const obj = newRegistration.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error: any) {
    console.error('Failed to add registration. Detailed error:', error);
    res.status(500).json({ error: `Failed to add registration: ${error.message || 'Unknown error'}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingRegistration = await EventRegistration.findById(id);
    
    if (!existingRegistration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    let paymentProofUrl = req.body.payment_proof !== undefined ? req.body.payment_proof : existingRegistration.payment_proof || '';
    if (paymentProofUrl.startsWith('data:image')) {
      paymentProofUrl = await uploadImage(paymentProofUrl, 'event_registrations');
    }

    existingRegistration.full_name = req.body.full_name !== undefined ? req.body.full_name : existingRegistration.full_name;
    existingRegistration.program = req.body.program !== undefined ? req.body.program : existingRegistration.program;
    existingRegistration.section = req.body.section !== undefined ? req.body.section : existingRegistration.section;
    existingRegistration.mobile_number = req.body.mobile_number !== undefined ? req.body.mobile_number : existingRegistration.mobile_number;
    existingRegistration.email = req.body.email !== undefined ? req.body.email : existingRegistration.email;
    existingRegistration.payment_proof = paymentProofUrl;
    existingRegistration.status = req.body.status !== undefined ? req.body.status : existingRegistration.status;

    await existingRegistration.save();
    
    const obj = existingRegistration.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    console.error('Failed to update registration:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRegistration = await EventRegistration.findByIdAndDelete(id);
    
    if (!deletedRegistration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

export default router;
