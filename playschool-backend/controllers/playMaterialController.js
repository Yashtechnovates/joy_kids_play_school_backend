const PlayMaterial = require('../models/PlayMaterial');

const getPlayMaterials = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const materials = await PlayMaterial.find(query).sort({ createdAt: -1 });
    console.log(`Found ${materials.length} materials${category ? ` for category: ${category}` : ''}`);
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlayMaterialById = async (req, res) => {
  try {
    const material = await PlayMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Play material not found' });
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlayMaterial = async (req, res) => {
  try {
    const material = await PlayMaterial.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePlayMaterial = async (req, res) => {
  try {
    const material = await PlayMaterial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!material) return res.status(404).json({ message: 'Play material not found' });
    res.status(200).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePlayMaterial = async (req, res) => {
  try {
    const material = await PlayMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Play material not found' });
    res.status(200).json({ message: 'Play material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlayMaterials,
  getPlayMaterialById,
  createPlayMaterial,
  updatePlayMaterial,
  deletePlayMaterial
};  