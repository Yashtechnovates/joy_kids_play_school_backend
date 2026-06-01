const Staff = require('../models/Staff');

const getStaff = async (req, res) => {
  try {
    console.log('Fetching all staff...');
    const staff = await Staff.find();
    console.log(`Found ${staff.length} staff members`);
    
    // Group by category for frontend compatibility
    const teachers = staff.filter(s => s.category === 'teachers');
    const support = staff.filter(s => s.category === 'support');
    
    console.log(`Teachers: ${teachers.length}, Support: ${support.length}`);
    
    res.status(200).json({ teachers, support });
  } catch (error) {
    console.error('Error in getStaff:', error);
    res.status(500).json({ message: error.message });
  }
};

const getStaffByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching staff by category: ${category}`);
    const staff = await Staff.find({ category });
    console.log(`Found ${staff.length} staff members in category ${category}`);
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error in getStaffByCategory:', error);
    res.status(500).json({ message: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    console.log('Creating new staff member:', req.body);
    const staff = await Staff.create(req.body);
    console.log('Staff created successfully:', staff.name);
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    console.log(`Updating staff with ID: ${req.params.id}`);
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    console.log('Staff updated successfully:', staff.name);
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    console.log(`Deleting staff with ID: ${req.params.id}`);
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    console.log('Staff deleted successfully:', staff.name);
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaff,
  getStaffByCategory,
  createStaff,
  updateStaff,
  deleteStaff
};