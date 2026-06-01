const PlayMaterial = require('../../models/playmaterial');

const createMaterial = async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const material = await PlayMaterial.create(req.body);
    console.log('Saved material:', material);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const materials = await PlayMaterial.find(query).sort({ createdAt: -1 });
    console.log(`Found ${materials.length} materials`);
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await PlayMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const material = await PlayMaterial.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await PlayMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createMaterial, 
  getAllMaterials, 
  getMaterialById, 
  updateMaterial, 
  deleteMaterial 
};