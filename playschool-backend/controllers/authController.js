const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check if account is locked
    if (user.isLocked()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is locked. Please try again after 30 minutes.' 
      });
    }
    
    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000;
      }
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Setup admin user (run once)
// @route   GET /api/auth/setup
const setupAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@joyschool.com' });
    if (existing) {
      return res.json({ message: 'Admin already exists! Email: admin@joyschool.com, Password: admin123' });
    }
    
    const user = await User.create({
      name: 'Super Admin',
      email: 'admin@joyschool.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'super_admin',
      isActive: true
    });
    
    res.json({ 
      message: '✅ Admin created successfully!', 
      email: 'admin@joyschool.com', 
      password: 'admin123',
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  login,
  getMe,
  setupAdmin
};