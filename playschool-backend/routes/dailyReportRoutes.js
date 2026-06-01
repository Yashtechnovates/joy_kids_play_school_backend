const express = require('express');
const router = express.Router();
const {
  getDailyReports,
  getReportById,
  createDailyReport,
  updateDailyReport,
  deleteDailyReport
} = require('../controllers/dailyReportController');

// Log when routes are accessed
router.use((req, res, next) => {
  console.log(`📌 DailyReport Route: ${req.method} ${req.url}`);
  next();
});

router.route('/')
  .get(getDailyReports)
  .post(createDailyReport);

router.route('/:id')
  .get(getReportById)
  .put(updateDailyReport)
  .delete(deleteDailyReport);

module.exports = router;