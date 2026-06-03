const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// In-memory storage for pending requests
let pendingRequests = [];

// Helper function to generate sequential roll number
const generateRollNumber = async (className, existingStudents = null) => {
  // Map class to prefix
  const prefixMap = {
    'PKG': 'PKG',
    'LKG': 'LKG',
    'UKG': 'UKG',
    'Pre-KG': 'PKG'
  };
  
  const prefix = prefixMap[className] || 'STU';
  
  // If existing students not provided, fetch from database
  let students = existingStudents;
  if (!students) {
    students = await Student.find({ class: className });
  }
  
  // Extract numbers from existing roll numbers for this class
  let maxNumber = 0;
  students.forEach(student => {
    if (student.rollNumber && student.rollNumber.startsWith(prefix)) {
      const numPart = student.rollNumber.replace(prefix, '');
      const num = parseInt(numPart, 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  // Also check pending requests for this class
  const pendingForClass = pendingRequests.filter(r => 
    r.status === 'pending' && 
    (r.class === className || r.class === prefix) &&
    r.id // ensure it's a valid request
  );
  
  pendingForClass.forEach(request => {
    // Check if request already has a roll number assigned (for already approved but not saved)
    if (request.generatedRollNumber && request.generatedRollNumber.startsWith(prefix)) {
      const numPart = request.generatedRollNumber.replace(prefix, '');
      const num = parseInt(numPart, 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  // Generate next number (start from 1 if none exist)
  const nextNumber = maxNumber + 1;
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  
  return `${prefix}${formattedNumber}`;
};

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

// Approve enrollment - Saves to Student database with sequential roll number
router.put('/:id/approve', async (req, res) => {
  try {
    const index = pendingRequests.findIndex(r => r.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    const request = pendingRequests[index];
    const fullName = `${request.firstName} ${request.lastName}`;
    
    // Map class to backend format
    const classMapping = {
      'PKG': 'PKG',
      'LKG': 'LKG', 
      'UKG': 'UKG',
      'Pre-KG': 'PKG'
    };
    const backendClass = classMapping[request.class] || request.class;
    
    // Get existing students to generate proper roll number
    const existingStudents = await Student.find({ class: backendClass });
    
    // Generate sequential roll number
    const rollNumber = await generateRollNumber(backendClass, existingStudents);
    
    console.log('Creating student with data:', {
      name: fullName,
      rollNumber: rollNumber,
      class: backendClass,
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
      class: backendClass,
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
    
    // Update request status with generated roll number
    pendingRequests[index].status = 'approved';
    pendingRequests[index].reviewedAt = new Date().toISOString();
    pendingRequests[index].studentId = newStudent._id;
    pendingRequests[index].generatedRollNumber = rollNumber;
    
    console.log(`✅ Student saved to database with ID: ${newStudent._id}`);
    console.log(`   Name: ${fullName}, Roll: ${rollNumber}`);
    
    res.json({
      success: true,
      message: `Enrollment approved! Roll Number: ${rollNumber}`,
      student: newStudent,
      rollNumber: rollNumber
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