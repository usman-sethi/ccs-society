import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' },
  profile_pic: { type: String, default: '' },
  bio: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, default: '' },
  registration_link: { type: String, default: '' },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const eventRegistrationSchema = new mongoose.Schema({
  event_id: { type: String, required: true },
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  full_name: { type: String },
  program: { type: String },
  section: { type: String },
  mobile_number: { type: String },
  email: { type: String },
  payment_proof: { type: String },
  status: { type: String, default: 'registered' },
  registered_at: { type: Date, default: Date.now }
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team_name: { type: String },
  description: { type: String, required: true },
  lead_id: { type: String },
  created_at: { type: Date, default: Date.now }
});

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  team_id: { type: String, required: true },
  user_id: { type: String },
  image: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  bio: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'info' },
  image: { type: String, default: '' },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const developerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  image: { type: String, default: '' },
  skills: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorEmail: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  approved_at: { type: Date }
});

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Event = mongoose.model('Event', eventSchema);
export const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Member = mongoose.model('Member', memberSchema);
export const Query = mongoose.model('Query', querySchema);
export const Announcement = mongoose.model('Announcement', announcementSchema);
export const Developer = mongoose.model('Developer', developerSchema);
export const Feedback = mongoose.model('Feedback', feedbackSchema);
export const Otp = mongoose.model('Otp', otpSchema);

