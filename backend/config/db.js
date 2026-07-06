const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolution issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('🌐 Configured Google DNS (8.8.8.8, 8.8.4.4) for MongoDB SRV resolution');
} catch (e) {
  console.warn('⚠️ Failed to set custom DNS servers:', e.message);
}

let isConnected = false;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const connectDB = async (attempt = 1) => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 — fixes many SRV/DNS issues on Windows
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    const isRetryable =
      error.message.includes('querySrv') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ServerSelectionError');

    if (isRetryable && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt;
      console.warn(`⚠️  MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${delay / 1000}s...`);
      console.warn(`   Error: ${error.message}`);
      await sleep(delay);
      return connectDB(attempt + 1);
    }

    console.error('❌ MongoDB connection failed after all retries.');
    console.error('   ➡  Make sure your IP is whitelisted in MongoDB Atlas:');
    console.error('      https://cloud.mongodb.com → Network Access → + Add IP Address → Add Current IP');
    throw error;
  }
};

// Auto-reconnect on disconnect
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Reconnecting...');
  isConnected = false;
  connectDB().catch(err => console.error('Reconnect failed:', err.message));
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
  isConnected = false;
});

module.exports = connectDB;
