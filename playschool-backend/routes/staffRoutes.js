const express = require('express');
const router = express.Router();
const {
  getStaff,
  getStaffByCategory,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');

router.route('/')
  .get(getStaff)
  .post(createStaff);

router.route('/category/:category')
  .get(getStaffByCategory);

router.route('/:id')
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;