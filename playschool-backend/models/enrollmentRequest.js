const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true,
    enum: ['PKG', 'LKG', 'UKG']
  },
  contact: String,
  email: String,
  parentEmail: String,
  fatherName: String,
  motherName: String,
  parentPhone: String,
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  gender: {
    type: String,
    enum: ['Boy', 'Girl']
  },
  image: String,
  address: String,
  dateOfBirth: String
}, {
  timestamps: true,
  collection: 'Student'
});

module.exports = mongoose.model('Student', studentSchema);