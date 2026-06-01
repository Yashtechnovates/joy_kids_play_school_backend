const express = require('express');
const router = express.Router();

// In-memory storage
let students = [];
let staff = [];
let events = [];
let materials = [];
let infrastructure = [];
let reports = [];

// ============= STUDENT ROUTES =============
router.post('/students', (req, res) => {
    const newStudent = { id: Date.now(), createdAt: new Date(), ...req.body };
    students.push(newStudent);
    res.status(201).json({ success: true, data: newStudent });
});

router.get('/students', (req, res) => {
    res.json({ success: true, data: students });
});

router.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
});

router.put('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found' });
    students[index] = { ...students[index], ...req.body };
    res.json({ success: true, data: students[index] });
});

router.delete('/students/:id', (req, res) => {
    students = students.filter(s => s.id != req.params.id);
    res.json({ success: true, message: 'Student deleted successfully' });
});

// ============= STAFF ROUTES =============
router.post('/staff', (req, res) => {
    const newStaff = { id: Date.now(), createdAt: new Date(), ...req.body };
    staff.push(newStaff);
    res.status(201).json({ success: true, data: newStaff });
});

router.get('/staff', (req, res) => {
    const { category, role } = req.query;
    let filteredStaff = staff;
    if (category) filteredStaff = filteredStaff.filter(s => s.category === category);
    if (role) filteredStaff = filteredStaff.filter(s => s.role === role);
    res.json({ success: true, data: filteredStaff });
});

router.get('/staff/:id', (req, res) => {
    const member = staff.find(s => s.id == req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: member });
});

router.put('/staff/:id', (req, res) => {
    const index = staff.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Staff not found' });
    staff[index] = { ...staff[index], ...req.body };
    res.json({ success: true, data: staff[index] });
});

router.delete('/staff/:id', (req, res) => {
    staff = staff.filter(s => s.id != req.params.id);
    res.json({ success: true, message: 'Staff deleted successfully' });
});

// ============= EVENTS ROUTES =============
router.post('/events', (req, res) => {
    const newEvent = { id: Date.now(), createdAt: new Date(), ...req.body };
    events.push(newEvent);
    res.status(201).json({ success: true, data: newEvent });
});

router.get('/events', (req, res) => {
    const { tag } = req.query;
    let filteredEvents = events;
    if (tag) filteredEvents = filteredEvents.filter(e => e.tag === tag);
    res.json({ success: true, data: filteredEvents });
});

router.get('/events/:id', (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
});

router.put('/events/:id', (req, res) => {
    const index = events.findIndex(e => e.id == req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Event not found' });
    events[index] = { ...events[index], ...req.body };
    res.json({ success: true, data: events[index] });
});

router.delete('/events/:id', (req, res) => {
    events = events.filter(e => e.id != req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
});

// ============= MATERIALS ROUTES =============
router.post('/materials', (req, res) => {
    const newMaterial = { id: Date.now(), ...req.body };
    materials.push(newMaterial);
    res.status(201).json({ success: true, data: newMaterial });
});

router.get('/materials', (req, res) => {
    res.json({ success: true, data: materials });
});

router.get('/materials/:id', (req, res) => {
    const material = materials.find(m => m.id == req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, data: material });
});

router.put('/materials/:id', (req, res) => {
    const index = materials.findIndex(m => m.id == req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Material not found' });
    materials[index] = { ...materials[index], ...req.body };
    res.json({ success: true, data: materials[index] });
});

router.delete('/materials/:id', (req, res) => {
    materials = materials.filter(m => m.id != req.params.id);
    res.json({ success: true, message: 'Material deleted successfully' });
});

// ============= INFRASTRUCTURE ROUTES =============
router.post('/infrastructure', (req, res) => {
    const newFacility = { id: Date.now(), ...req.body };
    infrastructure.push(newFacility);
    res.status(201).json({ success: true, data: newFacility });
});

router.get('/infrastructure', (req, res) => {
    res.json({ success: true, data: infrastructure });
});

router.get('/infrastructure/:id', (req, res) => {
    const facility = infrastructure.find(f => f.id == req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, data: facility });
});

router.put('/infrastructure/:id', (req, res) => {
    const index = infrastructure.findIndex(f => f.id == req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Facility not found' });
    infrastructure[index] = { ...infrastructure[index], ...req.body };
    res.json({ success: true, data: infrastructure[index] });
});

router.delete('/infrastructure/:id', (req, res) => {
    infrastructure = infrastructure.filter(f => f.id != req.params.id);
    res.json({ success: true, message: 'Facility deleted successfully' });
});

// ============= REPORTS ROUTES =============
router.post('/reports', (req, res) => {
    const newReport = { id: Date.now(), date: new Date(), ...req.body };
    reports.push(newReport);
    res.status(201).json({ success: true, data: newReport });
});

router.get('/reports', (req, res) => {
    const { studentId, date } = req.query;
    let filteredReports = reports;
    if (studentId) filteredReports = filteredReports.filter(r => r.id == studentId);
    if (date) filteredReports = filteredReports.filter(r => r.date?.split('T')[0] === date);
    res.json({ success: true, data: filteredReports });
});

router.get('/reports/:id', (req, res) => {
    const report = reports.find(r => r.id == req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
});

router.put('/reports/:id', (req, res) => {
    const index = reports.findIndex(r => r.id == req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Report not found' });
    reports[index] = { ...reports[index], ...req.body };
    res.json({ success: true, data: reports[index] });
});

router.delete('/reports/:id', (req, res) => {
    reports = reports.filter(r => r.id != req.params.id);
    res.json({ success: true, message: 'Report deleted successfully' });
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Admin API is working!', endpoints: {
        students: '/api/admin/students',
        staff: '/api/admin/staff',
        events: '/api/admin/events',
        materials: '/api/admin/materials',
        infrastructure: '/api/admin/infrastructure',
        reports: '/api/admin/reports'
    }});
});

module.exports = router;
