const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  profileImg: { type: String, default: '' },
  todayActivity: { type: String, required: true },
  participation: { type: Boolean, default: false },
  health: { type: String, enum: ['good', 'sick', 'average'], default: 'good' },
  behavior: { type: String, enum: ['excellent', 'good', 'average', 'needs improvement'], default: 'good' },
  teacherNote: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'DailyReport' });

module.exports = mongoose.model('DailyReport', dailyReportSchema);