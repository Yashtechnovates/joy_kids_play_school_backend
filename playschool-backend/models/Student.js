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
    enum: ['PKG', 'LKG', 'UKG', 'Nursery', 'Pre-KG']
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  parentEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: [true, 'Father name is required']
  },
  motherName: String,
  parentPhone: {
    type: String,
    required: [true, 'Parent phone is required']
  },
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  gender: {
    type: String,
    enum: ['Boy', 'Girl', 'Male', 'Female'],
    default: 'Boy'
  },
  image: String,
  address: String,
  dateOfBirth: String
}, {
  timestamps: true,
  collection: 'Student'
});

//module.exports = mongoose.model('Student', studentSchema);
const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student; 