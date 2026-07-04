const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('❌ FATAL ERROR: MONGO_URI environment variable is not set!');
    // Throwing error instead of process.exit so Vercel logs it but Express can still initialize 
    // and return proper 500 API responses with CORS headers.
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
