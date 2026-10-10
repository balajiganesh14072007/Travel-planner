import mongoose from 'mongoose';

let isMongoConnected = false;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.log('ℹ️ MONGODB_URI not configured or contains placeholder. Using TravelMate persistent local DB store.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
  } catch (error) {
    console.warn('⚠️ MongoDB Atlas connection failed, falling back to local persistent store:', (error as Error).message);
    isMongoConnected = false;
  }
}

export function isConnected(): boolean {
  return isMongoConnected;
}
