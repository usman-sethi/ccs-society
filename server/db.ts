import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password112@cluster0.dcs1kuc.mongodb.net/society?appName=Cluster0';

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  
  if (!cachedPromise) {
    mongoose.set('strictQuery', false);
    cachedPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    }).then(mongooseInstance => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    }).catch(error => {
      cachedPromise = null;
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }
  
  await cachedPromise;
  return mongoose;
};
