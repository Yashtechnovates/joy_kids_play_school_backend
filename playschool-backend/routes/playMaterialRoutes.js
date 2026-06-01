const express = require('express');
const router = express.Router();
const {
  getPlayMaterials,
  getPlayMaterialById,
  createPlayMaterial,
  updatePlayMaterial,
  deletePlayMaterial
} = require('../controllers/playMaterialController');

router.route('/')
  .get(getPlayMaterials)
  .post(createPlayMaterial);

router.route('/:id')
  .get(getPlayMaterialById)
  .put(updatePlayMaterial)
  .delete(deletePlayMaterial);

module.exports = router;