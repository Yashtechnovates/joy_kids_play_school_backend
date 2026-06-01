const mongoose = require('mongoose');

const infrastructureSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  color: String,
  image: { type: String, default: '' }  // Add this field for images
}, {
  timestamps: true,
  collection: 'Infrastructure'
});

module.exports = mongoose.model('Infrastructure', infrastructureSchema);