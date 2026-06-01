const express = require('express');
const router = express.Router();
const {
  getAllSyllabus,
  getSyllabusByGrade,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus
} = require('../controllers/syllabusController');

// ============ PUBLIC ROUTES (User Panel) ============
router.get('/', getAllSyllabus);
router.get('/grade/:grade', getSyllabusByGrade);

// ============ ADMIN ROUTES (Admin Panel) ============
// These will be accessible at /api/syllabus (POST, PUT, DELETE)
router.post('/', createSyllabus);
router.put('/:id', updateSyllabus);
router.delete('/:id', deleteSyllabus);

module.exports = router;