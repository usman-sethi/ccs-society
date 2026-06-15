import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password112@cluster0.dcs1kuc.mongodb.net/society?appName=Cluster0';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  
  try {
    mongoose.set('strictQuery', false);
    // mongoose.connect will wait for connection if already connecting,
    // or initiate a new connection if disconnected
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
      bufferCommands: false, // Don't buffer if connection is down
    });
    console.log('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error. Please ensure your IP is whitelisted on MongoDB Atlas and credentials are correct:', error);
    throw error;
  }
};
