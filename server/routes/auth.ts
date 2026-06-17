import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

const getAdminEmails = () => {
  const emails = process.env.ADMIN_EMAILS || 'surveyuniofpesh@gmail.com, paradox@test.com';
  return emails.split(',').map((e) => e.trim().toLowerCase());
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields', error: 'Name, email and password are required' });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User exists', error: 'User already exists' });
    }

    const isAdmin = getAdminEmails().includes(email.toLowerCase());
    const role = isAdmin ? 'Admin' : 'User';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      profile_pic: '',
      bio: ''
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      profile_pic: newUser.profile_pic,
      bio: newUser.bio,
      created_at: newUser.created_at
    };

    res.json({ success: true, requireOtp: false, message: 'Signup successful', data: { user: userResponse, token } });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message || 'Unknown error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials', error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Login failed', error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Login failed', error: 'Invalid credentials' });
    }

    const isAdmin = getAdminEmails().includes(email.toLowerCase());
    if (isAdmin && user.role !== 'Admin') {
       user.role = 'Admin';
       await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profile_pic: user.profile_pic,
      bio: user.bio,
      created_at: user.created_at
    };

    res.json({ success: true, requireOtp: false, message: 'Login successful', data: { user: userResponse, token } });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message || 'Unknown error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized', error: 'Missing or invalid token' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'Not found', error: 'User not found' });
    }
    
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profile_pic: user.profile_pic,
      bio: user.bio,
      created_at: user.created_at
    };
    
    res.json({ success: true, message: 'Operation successful', data: { user: userResponse } });
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid token', error: error.message || 'Unknown error' });
  }
});

export default router;
