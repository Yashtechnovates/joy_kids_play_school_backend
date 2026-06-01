const DailyReport = require('../models/DailyReport');

// @desc    Get all daily reports
// @route   GET /api/dailyreports
const getDailyReports = async (req, res) => {
  try {
    console.log('Fetching daily reports from DailyReport collection...');
    const reports = await DailyReport.find().sort({ date: -1 });
    console.log(`✅ Found ${reports.length} reports`);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error in getDailyReports:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
};

// @desc    Get single report
// @route   GET /api/dailyreports/:id
const getReportById = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create daily report
// @route   POST /api/dailyreports
const createDailyReport = async (req, res) => {
  try {
    console.log('Received data to create:', req.body);
    const report = await DailyReport.create(req.body);
    console.log('Created report with class:', report.class);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update daily report
// @route   PUT /api/dailyreports/:id
const updateDailyReport = async (req, res) => {
  try {
    console.log('Updating report with data:', req.body);
    const report = await DailyReport.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    console.log('Updated report class:', report.class);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete daily report
// @route   DELETE /api/dailyreports/:id
const deleteDailyReport = async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDailyReports,
  getReportById,
  createDailyReport,
  updateDailyReport,
  deleteDailyReport
};