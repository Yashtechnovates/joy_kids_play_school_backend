const mongoose = require('mongoose');

const culturalEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: String,
  badge: String,
  tag: String,
  description: String,
  image: String,
  icon: String,
  imagePosition: {
    type: String,
    enum: ['left', 'right', 'center'],
    default: 'left'
  },
  eventType: {
    type: String,
    enum: ['upcoming', 'past'],
    default: 'upcoming'
  },
  venue: String,
  time: String
}, {
  timestamps: true,
  collection: 'culturalEvent'
});

module.exports = mongoose.model('CulturalEvent', culturalEventSchema);