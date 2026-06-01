const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: true,
    enum: ['Pre-KG', 'LKG', 'UKG']
  },
  subjects: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'Syllabus'
});

module.exports = mongoose.model('Syllabus', syllabusSchema);