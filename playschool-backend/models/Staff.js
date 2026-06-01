const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Principal', 'Senior Coordinator', 'Lead Teacher', 'Activity Trainer', 'Support Staff']
  },
  experience: String,
  subject: String,
  image: String,
  contact: String,
  category: {
    type: String,
    enum: ['teachers', 'support'],
    required: true
  }
}, {
  timestamps: true,
  collection: 'Staff' // Explicitly specify collection name
});

module.exports = mongoose.model('Staff', staffSchema);