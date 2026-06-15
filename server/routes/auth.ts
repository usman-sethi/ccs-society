import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Otp } from '../models/index';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

const getAdminEmails = () => {
  const emails = process.env.ADMIN_EMAILS || 'surveyuniofpesh@gmail.com, paradox@test.com';
  return emails.split(',').map((e) => e.trim().toLowerCase());
};

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Invalidate old OTPs for this email
    await Otp.deleteMany({ email: email.toLowerCase() });

    const newOtp = new Otp({
      email: email.toLowerCase(),
      code,
      expiresAt
    });
    await newOtp.save();

    console.log(`[Dev/Test] OTP for ${email}: ${code}`);
    res.json({ success: true, message: 'OTP stored successfully (email disabled)' });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message || 'Unknown error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code, name } = req.body; // Add name if registering
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), code });
    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'OTP has expired' });
    }

    // OTP is valid
    await Otp.deleteMany({ email: email.toLowerCase() }); // Cleanup

    let user = await User.findOne({ email: email.toLowerCase() });
    
    // Auto-create user if not exist
    if (!user) {
      const isAdmin = getAdminEmails().includes(email.toLowerCase());
      const role = isAdmin ? 'Admin' : 'User';
      
      // Default dummy password for OTP users just to fulfill schema requirement
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);

      user = new User({
        name: name || email.split('@')[0], // Use part of email as name if missing
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        profile_pic: '',
        bio: ''
      });
      await user.save();
    } else {
      // Check admin status for existing user
      const isAdmin = getAdminEmails().includes(email.toLowerCase());
      if (isAdmin && user.role !== 'Admin') {
         user.role = 'Admin';
         await user.save();
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_pic: user.profile_pic,
      bio: user.bio,
      created_at: user.created_at
    };

    res.json({ success: true, message: 'Login successful', data: { user: userResponse, token } });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message || 'Unknown error' });
  }
});

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

router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { name, email, password, code } = req.body;
    if (!name || !email || !password || !code) {
      return res.status(400).json({ success: false, message: 'All fields including code are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), code });
    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }
    if (otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'OTP has expired' });
    }

    // OTP is valid, create user
    await Otp.deleteMany({ email: email.toLowerCase() }); // Cleanup

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
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

    res.json({ success: true, message: 'Operation successful', data: { user: userResponse, token } });
  } catch (error: any) {
    console.error('Verify signup OTP error:', error);
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

router.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), code });
    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }
    if (otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'OTP has expired' });
    }

    // OTP is valid
    await Otp.deleteMany({ email: email.toLowerCase() }); // Cleanup

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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

    res.json({ success: true, message: 'Login successful', data: { user: userResponse, token } });
  } catch (error: any) {
    console.error('Verify login OTP error:', error);
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
