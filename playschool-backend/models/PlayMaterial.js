const mongoose = require('mongoose');

const playMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Indoor', 'Outdoor'],
    default: 'Indoor'
  },
  icon: {
    type: String,
    default: '🎨'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  desc: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  benefits: [String]
}, {
  timestamps: true,
  collection: 'PlayMaterial'
});

module.exports = mongoose.model('PlayMaterial', playMaterialSchema);