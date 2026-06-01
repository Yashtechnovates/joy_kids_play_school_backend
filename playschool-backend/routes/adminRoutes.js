// const express = require('express');
// const router = express.Router();

// const studentController = require('../controllers/admin/studentController');
// const staffController = require('../controllers/admin/staffController');
// const eventController = require('../controllers/admin/culturalEventController');
// const materialController = require('../controllers/admin/playMaterialController');
// const infrastructureController = require('../controllers/admin/infrastructureController');
// const reportController = require('../controllers/admin/dailyReportController');

// // Student routes
// router.post('/students', studentController.createStudent);
// router.get('/students', studentController.getAllStudents);
// router.get('/students/:id', studentController.getStudentById);
// router.put('/students/:id', studentController.updateStudent);
// router.delete('/students/:id', studentController.deleteStudent);

// // Staff routes
// router.post('/staff', staffController.createStaff);
// router.get('/staff', staffController.getAllStaff);
// router.get('/staff/:id', staffController.getStaffById);
// router.put('/staff/:id', staffController.updateStaff);
// router.delete('/staff/:id', staffController.deleteStaff);

// // Event routes
// router.post('/events', eventController.createEvent);
// router.get('/events', eventController.getAllEvents);
// router.get('/events/:id', eventController.getEventById);
// router.put('/events/:id', eventController.updateEvent);
// router.delete('/events/:id', eventController.deleteEvent);

// // Material routes
// router.post('/materials', materialController.createMaterial);
// router.get('/materials', materialController.getAllMaterials);
// router.get('/materials/:id', materialController.getMaterialById);
// router.put('/materials/:id', materialController.updateMaterial);
// router.delete('/materials/:id', materialController.deleteMaterial);

// // Infrastructure routes
// router.post('/infrastructure', infrastructureController.createFacility);
// router.get('/infrastructure', infrastructureController.getAllFacilities);
// router.get('/infrastructure/:id', infrastructureController.getFacilityById);
// router.put('/infrastructure/:id', infrastructureController.updateFacility);
// router.delete('/infrastructure/:id', infrastructureController.deleteFacility);

// // Report routes
// router.post('/reports', reportController.createReport);
// router.get('/reports', reportController.getAllReports);
// router.get('/reports/:id', reportController.getReportById);
// router.put('/reports/:id', reportController.updateReport);
// router.delete('/reports/:id', reportController.deleteReport);

// module.exports = router;/

const express = require('express');
const router = express.Router();

// Import models
const Student = require('../models/student');
const Staff = require('../models/staff');
const CulturalEvent = require('../models/culturalEvent');
const PlayMaterial = require('../models/playmaterial');
const Infrastructure = require('../models/infrastructure');
const DailyReport = require('../models/dailyreports');

// ============= STUDENT CRUD OPERATIONS =============

// Create Student
router.post('/students', async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this roll number already exists' });
    }
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get All Students (with filters)
router.get('/students', async (req, res) => {
  try {
    const { class: className, search, gender, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (className) query.class = className;
    if (gender) query.gender = gender;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Student.countDocuments(query);
    
    res.json({ 
      success: true, 
      data: students, 
      total, 
      page: parseInt(page), 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get Single Student
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update Student
router.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete Student
router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============= STAFF CRUD OPERATIONS =============

router.post('/staff', async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/staff', async (req, res) => {
  try {
    const { category, role, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (role) query.role = role;
    if (search) query.name = { $regex: search, $options: 'i' };
    const staff = await Staff.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/staff/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/staff/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/staff/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============= EVENTS CRUD OPERATIONS =============

router.post('/events', async (req, res) => {
  try {
    const event = await CulturalEvent.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = {};
    if (tag) query.tag = tag;
    if (search) query.title = { $regex: search, $options: 'i' };
    const events = await CulturalEvent.find(query).sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await CulturalEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const event = await CulturalEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const event = await CulturalEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============= MATERIALS CRUD OPERATIONS =============

router.post('/materials', async (req, res) => {
  try {
    const material = await PlayMaterial.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/materials', async (req, res) => {
  try {
    const materials = await PlayMaterial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/materials/:id', async (req, res) => {
  try {
    const material = await PlayMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/materials/:id', async (req, res) => {
  try {
    const material = await PlayMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/materials/:id', async (req, res) => {
  try {
    const material = await PlayMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============= INFRASTRUCTURE CRUD OPERATIONS =============

router.post('/infrastructure', async (req, res) => {
  try {
    const facility = await Infrastructure.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/infrastructure', async (req, res) => {
  try {
    const facilities = await Infrastructure.find().sort({ createdAt: -1 });
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/infrastructure/:id', async (req, res) => {
  try {
    const facility = await Infrastructure.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/infrastructure/:id', async (req, res) => {
  try {
    const facility = await Infrastructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/infrastructure/:id', async (req, res) => {
  try {
    const facility = await Infrastructure.findByIdAndDelete(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============= REPORTS CRUD OPERATIONS =============

router.post('/reports', async (req, res) => {
  try {
    const report = await DailyReport.create(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const { date, studentId, health, page = 1, limit = 20 } = req.query;
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (studentId) query.id = studentId;
    if (health) query.health = health;
    
    const reports = await DailyReport.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await DailyReport.countDocuments(query);
    
    res.json({ 
      success: true, 
      data: reports, 
      total, 
      page: parseInt(page), 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/reports/:id', async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/reports/:id', async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/reports/:id', async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;