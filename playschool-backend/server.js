const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ IMPORT ROUTES ============
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const culturalEventRoutes = require('./routes/culturalEventRoutes');
const infrastructureRoutes = require('./routes/infrastructureRoutes');
const playMaterialRoutes = require('./routes/playMaterialRoutes');
const dailyReportRoutes = require('./routes/dailyReportRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');  // ← ADD THIS
const syllabusRoutes = require('./routes/syllabusRoutes');
// ============ USE ROUTES ============
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/events', culturalEventRoutes);
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/playmaterial', playMaterialRoutes);
app.use('/api/dailyreports', dailyReportRoutes);
app.use('/api/enrollment', enrollmentRoutes);  // ← ADD THIS
app.use('/api/syllabus', syllabusRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/joyKidsPlaySchool';
console.log('🔄 Connecting to MongoDB...');

mongoose.connect(MONGO_URI, { dbName: 'joyKidsPlaySchool' })
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📚 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Enrollment API: http://localhost:${PORT}/api/enrollment/count`);
});