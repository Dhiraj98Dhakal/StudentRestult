const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');

const app = express();

// CORS configuration for Netlify frontend
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://your-netlify-site.netlify.app', // Will update after deployment
  'https://*.netlify.app', // Allow all Netlify subdomains
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder (for local development)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/students', studentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Student Result API is running',
    mongodb:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root route - redirect to API docs
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdb';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connected to MongoDB');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit - Render will restart the container
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Health: http://localhost:${PORT}/api/health`);
  });
};

startServer();

module.exports = app; // For testing
