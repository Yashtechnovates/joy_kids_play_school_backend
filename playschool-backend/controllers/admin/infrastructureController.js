// const Infrastructure = require('../../models/infrastructure');

// const createFacility = async (req, res) => {
//   try {
//     const facility = await Infrastructure.create(req.body);
//     res.status(201).json({ success: true, data: facility });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const getAllFacilities = async (req, res) => {
//   try {
//     const facilities = await Infrastructure.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: facilities });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const getFacilityById = async (req, res) => {
//   try {
//     const facility = await Infrastructure.findById(req.params.id);
//     if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
//     res.status(200).json({ success: true, data: facility });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const updateFacility = async (req, res) => {
//   try {
//     const facility = await Infrastructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
//     res.status(200).json({ success: true, data: facility });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const deleteFacility = async (req, res) => {
//   try {
//     const facility = await Infrastructure.findByIdAndDelete(req.params.id);
//     if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
//     res.status(200).json({ success: true, message: 'Facility deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// module.exports = { createFacility, getAllFacilities, getFacilityById, updateFacility, deleteFacility };


const Infrastructure = require('../models/infrastructure');

const getInfrastructure = async (req, res) => {
  try {
    const facilities = await Infrastructure.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFacility = async (req, res) => {
  try {
    const facility = await Infrastructure.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateFacility = async (req, res) => {
  try {
    console.log('Update request params:', req.params);
    console.log('Update request body:', req.body);
    
    const facility = await Infrastructure.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }
    
    console.log('Updated facility:', facility);
    res.status(200).json({ 
      success: true, 
      data: facility 
    });
  } catch (error) {
    console.error('Error in updateFacility:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const facility = await Infrastructure.findByIdAndDelete(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.status(200).json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInfrastructure,
  createFacility,
  updateFacility,
  deleteFacility
};