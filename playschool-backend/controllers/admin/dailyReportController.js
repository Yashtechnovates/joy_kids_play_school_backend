const DailyReport = require('../../models/dailyreports');

const createReport = async (req, res) => {
  try {
    const report = await DailyReport.create(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { date, studentId, health, page = 1, limit = 20 } = req.query;
    let query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (studentId) query.id = studentId;
    if (health) query.health = health;
    const reports = await DailyReport.find(query).sort({ date: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await DailyReport.countDocuments(query);
    res.status(200).json({ success: true, data: reports, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createReport, getAllReports, getReportById, updateReport, deleteReport };