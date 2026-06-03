const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ USER SCHEMA & AUTH ============
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  isActive: { type: Boolean, default: true }
});
const User = mongoose.model('User', userSchema);

// Auth endpoints
app.get('/api/auth/setup', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@joyschool.com' });
    if (existing) {
      return res.json({ message: 'Admin already exists!' });
    }
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Super Admin',
      email: 'admin@joyschool.com',
      password: hashed,
      role: 'super_admin'
    });
    res.json({ message: 'Admin created!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// ============ YOUR EXISTING ROUTES ============
try {
  // Student routes
  const studentRoutes = require('./routes/studentRoutes');
  app.use('/api/students', studentRoutes);
  console.log('✅ Students routes loaded');
} catch(err) {
  console.log('❌ Students routes ERROR:', err.message);
  // Fallback student route
  app.get('/api/students', (req, res) => {
    res.json({ success: true, data: [] });
  });
}

try {
  // Staff routes
  const staffRoutes = require('./routes/staffRoutes');
  app.use('/api/staff', staffRoutes);
  console.log('✅ Staff routes loaded');
} catch(err) {
  console.log('❌ Staff routes ERROR:', err.message);
  app.get('/api/staff', (req, res) => {
    res.json({ success: true, data: [] });
  });
}

try {
  // Events routes
  const eventRoutes = require('./routes/culturalEventRoutes');
  app.use('/api/events', eventRoutes);
  console.log('✅ Events routes loaded');
} catch(err) {
  console.log('❌ Events routes ERROR:', err.message);
  app.get('/api/events', (req, res) => {
    res.json({ success: true, data: [] });
  });
}

try {
  // Infrastructure routes
  const infraRoutes = require('./routes/infrastructureRoutes');
  app.use('/api/infrastructure', infraRoutes);
  console.log('✅ Infrastructure routes loaded');
} catch(err) {
  console.log('❌ Infrastructure routes ERROR:', err.message);
  app.get('/api/infrastructure', (req, res) => {
    res.json({ success: true, data: [] });
  });
}

try {
  // Play material routes
  const materialRoutes = require('./routes/playMaterialRoutes');
  app.use('/api/playmaterial', materialRoutes);
  console.log('✅ Play material routes loaded');
} catch(err) {
  console.log('❌ Play material routes ERROR:', err.message);
  app.get('/api/playmaterial', (req, res) => {
    res.json({ success: true, data: [] });
  });
}

try {
  // Daily reports routes
  const reportRoutes = require('./routes/dailyReportRoutes');
  app.use('/api/dailyreports', reportRoutes);
  console.log('✅ Daily reports routes loaded');
} catch(err) {
  console.log('❌ Daily reports routes ERROR:', err.message);
  app.get('/api/dailyreports', (req, res) => {
    res.json({ success: true, data: [] });
  });
}

try {
  // Enrollment routes
  const enrollmentRoutes = require('./routes/enrollmentRoutes');
  app.use('/api/enrollment', enrollmentRoutes);
  console.log('✅ Enrollment routes loaded');
} catch(err) {
  console.log('❌ Enrollment routes ERROR:', err.message);
}

// ============ MONGODB CONNECTION ============
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/joyKidsPlaySchool';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📚 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
  // ============ CHANGE PASSWORD ENDPOINT ============
app.put('/api/auth/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Password changed successfully! Please login with your new password.' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n🔐 AUTH:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/setup`);
  console.log(`\n📋 DATA:`);
  console.log(`   GET  http://localhost:${PORT}/api/students`);
  console.log(`   GET  http://localhost:${PORT}/api/staff`);
  console.log(`   GET  http://localhost:${PORT}/api/infrastructure`);
});

