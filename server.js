const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/lxresult'
    );
    console.log('✅ MongoDB connected successfully');
    console.log(`📁 Database: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // In development, continue running even if DB fails
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

connectDB();

// API Routes
app.use('/api/students', studentRoutes);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LX Result System API',
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '1.0.0',
  });
});

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'LX Result System API',
    version: '1.0.0',
    endpoints: {
      students: {
        getAll: 'GET /api/students',
        getOne: 'GET /api/students/:roll',
        create: 'POST /api/students',
        update: 'PUT /api/students/:roll',
        delete: 'DELETE /api/students/:roll',
      },
      health: 'GET /api/health',
    },
  });
});

// ==================== FRONTEND PAGES ====================

// Main Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/check-result', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'check-result.html'));
});

app.get('/add-student', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-student.html'));
});

app.get('/update-student', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'update-student.html'));
});

app.get('/view-students', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view-students.html'));
});

// ==================== ERROR HANDLING ====================

// 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET  /api',
      'GET  /api/health',
      'GET  /api/students',
      'POST /api/students',
      'GET  /api/students/:roll',
      'PUT  /api/students/:roll',
      'DELETE /api/students/:roll',
    ],
  });
});

// 404 for frontend routes - serve 404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);

  const statusCode = err.status || 500;
  const errorResponse = {
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
  🚀 LX Result System Started!
  ===========================================
  📍 Local:    http://localhost:${PORT}
  📍 Network:  http://0.0.0.0:${PORT}
  
  📊 API DOCUMENTATION:
  ├── API Docs:   http://localhost:${PORT}/api
  ├── Health:     http://localhost:${PORT}/api/health
  └── Students:   http://localhost:${PORT}/api/students
  
  🏠 FRONTEND PAGES:
  ├── Home:       http://localhost:${PORT}/
  ├── Check Result: http://localhost:${PORT}/check
  ├── Add Student: http://localhost:${PORT}/add-student
  ├── Update Student: http://localhost:${PORT}/update-student
  └── View Students: http://localhost:${PORT}/view-students
  
  ⚙️  Environment: ${process.env.NODE_ENV || 'development'}
  📅 Started: ${new Date().toLocaleString()}
  ===========================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
