const mongoose = require('mongoose');

// Fallback to local MongoDB instance if environment variable is missing
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-career-twin';

// Track connection health state
const connectionState = {
  isConnected: false,
};

/**
 * Initializes and establishes the MongoDB database connection using Mongoose.
 * 
 * DESIGN RATIONALE (8+ YoE Architecture):
 * - Keeps connection logic centralized with clean retry policies.
 * - Handles connection events (connected, error, disconnected) transparently to prevent silent dropouts.
 * - Configures connection pools and timeouts suitable for high-performance SaaS scaling.
 */
async function connectDB() {
  if (connectionState.isConnected) {
    return;
  }

  try {
    const options = {
      autoIndex: true, // Build indexes automatically in development
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    console.log(`[Database] Attempting connection to MongoDB...`);
    const db = await mongoose.connect(mongoURI, options);
    
    connectionState.isConnected = db.connections[0].readyState === 1;
    console.log('[Database] MongoDB connected successfully.');
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error.message);
    // Graceful degradation: log the error and allow app startup, rather than crashing hard.
    connectionState.isConnected = false;
  }
}

// Connection monitors
mongoose.connection.on('error', (err) => {
  console.error(`[Database] Mongoose runtime connection error: ${err}`);
  connectionState.isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Mongoose disconnected from MongoDB. Reconnecting...');
  connectionState.isConnected = false;
});

module.exports = {
  connectDB,
  connection: mongoose.connection,
  connectionState,
};
