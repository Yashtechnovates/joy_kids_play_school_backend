const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// In-memory storage for pending requests
let pendingRequests = [];

// Submit enrollment request
router.post('/submit', (req, res) => {
  const requestData = req.body;
  const newRequest = {
    id: Date.now(),
    ...requestData,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  pendingRequests.push(newRequest);
  
  console.log('📝 New enrollment request:');
  console.log(`   Student: ${newRequest.firstName} ${newRequest.lastName}`);
  console.log(`   Class: ${newRequest.class}`);
  
  res.status(201).json({
    success: true,
    message: 'Enrollment request submitted successfully!',
    requestId: newRequest.id
  });
});

// Get count of pending requests
router.get('/count', (req, res) => {
  const count = pendingRequests.filter(r => r.status === 'pending').length;
  res.json({ success: true, pendingCount: count });
});

// Get all requests
router.get('/requests', (req, res) => {
  const { status } = req.query;
  let filtered = pendingRequests;
  if (status && status !== 'all') {
    filtered = pendingRequests.filter(r => r.status === status);
  }
  filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json({ success: true, data: filtered });
});

// Approve enrollment - Saves to Student database
router.put('/:id/approve', async (req, res) => {
  try {
    const index = pendingRequests.findIndex(r => r.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    const request = pendingRequests[index];
    
    // Generate roll number
    const rollNumber = `STU${Date.now()}`;
    const fullName = `${request.firstName} ${request.lastName}`;
    
    // Map class
    const classMapping = {
      'PKG': 'PKG',
      'LKG': 'LKG', 
      'UKG': 'UKG'
    };
    
    console.log('Creating student with data:', {
      name: fullName,
      rollNumber: rollNumber,
      class: classMapping[request.class] || request.class,
      contact: request.phoneNumber,
      email: request.email,
      parentEmail: request.parentEmail,
      fatherName: request.fatherName,
      motherName: request.motherName,
      parentPhone: request.parentPhone || request.phoneNumber,
      gender: request.gender,
      address: request.address,
      dateOfBirth: request.dateOfBirth
    });
    
    // Create student in database
    const newStudent = await Student.create({
      name: fullName,
      rollNumber: rollNumber,
      class: classMapping[request.class] || request.class,
      contact: request.phoneNumber,
      email: request.email,
      parentEmail: request.parentEmail,
      fatherName: request.fatherName,
      motherName: request.motherName,
      parentPhone: request.parentPhone || request.phoneNumber,
      attendance: 0,
      gender: request.gender,
      address: request.address,
      dateOfBirth: request.dateOfBirth
    });
    
    // Update request status
    pendingRequests[index].status = 'approved';
    pendingRequests[index].reviewedAt = new Date().toISOString();
    pendingRequests[index].studentId = newStudent._id;
    
    console.log(`✅ Student saved to database with ID: ${newStudent._id}`);
    console.log(`   Name: ${fullName}, Roll: ${rollNumber}`);
    
    res.json({
      success: true,
      message: 'Enrollment approved and student added to database',
      student: newStudent
    });
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject enrollment
router.put('/:id/reject', (req, res) => {
  const index = pendingRequests.findIndex(r => r.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }
  
  const { rejectionReason } = req.body;
  pendingRequests[index].status = 'rejected';
  pendingRequests[index].rejectionReason = rejectionReason || 'Not specified';
  pendingRequests[index].reviewedAt = new Date().toISOString();
  
  console.log(`❌ Enrollment rejected: ${pendingRequests[index].firstName} ${pendingRequests[index].lastName}`);
  
  res.json({
    success: true,
    message: 'Enrollment rejected'
  });
});

module.exports = router;