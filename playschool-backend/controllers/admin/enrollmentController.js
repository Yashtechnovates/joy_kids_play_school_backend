const EnrollmentRequest = require('../models/enrollmentRequest');
const Student = require('../models/student');

// Submit enrollment request (from User Panel)
const submitEnrollment = async (req, res) => {
  try {
    const studentData = req.body;
    const fullName = `${studentData.firstName} ${studentData.lastName}`;
    
    const enrollmentRequest = await EnrollmentRequest.create({
      studentData: studentData,
      parentName: studentData.fatherName,
      studentName: fullName,
      class: studentData.class,
      status: 'pending'
    });
    
    console.log(`📝 New enrollment request from ${fullName}`);
    
    res.status(201).json({
      success: true,
      message: 'Enrollment request submitted successfully! Admin will review and approve soon.',
      requestId: enrollmentRequest._id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error submitting enrollment:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all pending requests (for Admin Panel)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await EnrollmentRequest.find({ status: 'pending' })
      .sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all requests (for Admin Panel)
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const requests = await EnrollmentRequest.find(query)
      .sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve enrollment request (from Admin Panel)
const approveEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewedBy } = req.body;
    
    const request = await EnrollmentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }
    
    const studentData = request.studentData;
    const fullName = `${studentData.firstName} ${studentData.lastName}`;
    const rollNumber = `STU${Date.now()}`;
    
    // Create actual student
    const newStudent = await Student.create({
      name: fullName,
      rollNumber: rollNumber,
      class: studentData.class,
      contact: studentData.phoneNumber,
      email: studentData.email,
      parentEmail: studentData.parentEmail,
      fatherName: studentData.fatherName,
      motherName: studentData.motherName,
      parentPhone: studentData.parentPhone,
      attendance: 0,
      gender: studentData.gender,
      address: studentData.address,
      dateOfBirth: studentData.dateOfBirth
    });
    
    // Update request status
    request.status = 'approved';
    request.reviewedAt = new Date();
    request.reviewedBy = reviewedBy || 'Admin';
    await request.save();
    
    console.log(`✅ Enrollment approved: ${fullName} (${rollNumber})`);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment approved successfully',
      student: newStudent
    });
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject enrollment request (from Admin Panel)
const rejectEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, reviewedBy } = req.body;
    
    const request = await EnrollmentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }
    
    request.status = 'rejected';
    request.rejectionReason = rejectionReason || 'Not specified';
    request.reviewedAt = new Date();
    request.reviewedBy = reviewedBy || 'Admin';
    await request.save();
    
    console.log(`❌ Enrollment rejected: ${request.studentName}`);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment rejected'
    });
  } catch (error) {
    console.error('Error rejecting enrollment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get request count for notification badge
const getRequestCount = async (req, res) => {
  try {
    const pendingCount = await EnrollmentRequest.countDocuments({ status: 'pending' });
    res.status(200).json({
      success: true,
      pendingCount: pendingCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitEnrollment,
  getPendingRequests,
  getAllRequests,
  approveEnrollment,
  rejectEnrollment,
  getRequestCount
};