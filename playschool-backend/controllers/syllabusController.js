const Syllabus = require('../models/syllabus');
// @desc    Get all syllabus
// @route   GET /api/syllabus
const getAllSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.find().sort({ grade: 1 });
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single syllabus by grade
// @route   GET /api/syllabus/:grade
const getSyllabusByGrade = async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({ grade: req.params.grade });
    if (!syllabus) {
      return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create syllabus
// @route   POST /api/admin/syllabus
const createSyllabus = async (req, res) => {
  try {
    const { grade, subjects, description } = req.body;
    
    // Check if syllabus already exists for this grade
    const existingSyllabus = await Syllabus.findOne({ grade });
    if (existingSyllabus) {
      return res.status(400).json({ success: false, message: `Syllabus for ${grade} already exists` });
    }
    
    const syllabus = await Syllabus.create({ grade, subjects, description });
    res.status(201).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update syllabus
// @route   PUT /api/admin/syllabus/:id
const updateSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!syllabus) {
      return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete syllabus
// @route   DELETE /api/admin/syllabus/:id
const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);
    if (!syllabus) {
      return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }
    res.status(200).json({ success: true, message: 'Syllabus deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSyllabus,
  getSyllabusByGrade,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus
};