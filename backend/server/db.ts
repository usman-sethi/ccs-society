import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const hasPlaceholderMongoUri = (uri: string) => /cluster0\.dcs1kuc\.mongodb\.net|admin:password112/i.test(uri);

let isConnected = false;
let lastConnectionAttempt = 0;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  if (isConnected) {
    return true;
  }

  if (Date.now() - lastConnectionAttempt < 30000) {
    return false;
  }

  if (!MONGODB_URI || hasPlaceholderMongoUri(MONGODB_URI)) {
    console.warn('MONGODB_URI is not configured for this environment. Skipping MongoDB connection.');
    return false;
  }

  lastConnectionAttempt = Date.now();

  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    if (isConnected) {
      console.log('MongoDB connected successfully');
    }

    return isConnected;
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection error. Please ensure your IP is whitelisted on MongoDB Atlas and credentials are correct:', error);
    return false;
  }
};
