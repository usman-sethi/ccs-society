import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password112@cluster0.dcs1kuc.mongodb.net/society?appName=Cluster0';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });
    isConnected = !!db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error. Please ensure your IP is whitelisted on MongoDB Atlas and credentials are correct:', error);
    throw error;
  }
};
