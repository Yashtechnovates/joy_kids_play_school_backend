const express = require('express');
const router = express.Router();
const {
  getInfrastructure,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/infrastructureController');

router.route('/')
  .get(getInfrastructure)
  .post(createFacility);

router.route('/:id')
  .put(updateFacility)
  .delete(deleteFacility);

module.exports = router;