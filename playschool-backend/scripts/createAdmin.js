const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/joyKidsPlaySchool';

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');
    
    const existing = await User.findOne({ email: 'admin@joyschool.com' });
    if (existing) {
      console.log('Admin already exists!');
      console.log('Email: admin@joyschool.com');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@joyschool.com',
      password: 'admin123',
      role: 'super_admin',
      isActive: true
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log('📧 Email: admin@joyschool.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Super Admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();