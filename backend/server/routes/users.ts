import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index';
import { uploadImage } from '../../lib/cloudinary';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'private, max-age=30'); // Add a small amount of caching for quicker loads
    const users = await User.find().select('-password').sort({ created_at: -1 }).lean();
    
    const formattedUsers = users.map(user => {
      const { _id, ...rest } = user;
      return { ...rest, id: _id.toString(), _id: _id.toString() };
    });
    
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profilePicUrl = req.body.profile_pic !== undefined ? req.body.profile_pic : existingUser.profile_pic || '';
    if (profilePicUrl.startsWith('data:image')) {
      profilePicUrl = await uploadImage(profilePicUrl, 'users');
    }

    existingUser.name = req.body.name !== undefined ? req.body.name : existingUser.name;
    existingUser.email = req.body.email !== undefined ? req.body.email : existingUser.email;
    existingUser.profile_pic = profilePicUrl;
    existingUser.bio = req.body.bio !== undefined ? req.body.bio : existingUser.bio;
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(req.body.password, salt);
    }

    const emails = process.env.ADMIN_EMAILS || 'surveyuniofpesh@gmail.com';
    const adminEmails = emails.split(',').map((e) => e.trim().toLowerCase());
    if (adminEmails.includes(existingUser.email.toLowerCase())) {
       existingUser.role = 'Admin';
    } else {
       existingUser.role = req.body.role !== undefined ? req.body.role : existingUser.role;
    }

    await existingUser.save();
    
    const obj = existingUser.toObject();
    const { password, ...safeUser } = obj;
    res.json({ ...safeUser, id: obj._id.toString() });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
