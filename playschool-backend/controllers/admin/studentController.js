// const Student = require('../../models/student');

// const createStudent = async (req, res) => {
//   try {
//     const { rollNumber } = req.body;
//     const existingStudent = await Student.findOne({ rollNumber });
//     if (existingStudent) {
//       return res.status(400).json({ success: false, message: 'Student already exists' });
//     }
//     const student = await Student.create(req.body);
//     res.status(201).json({ success: true, data: student });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const getAllStudents = async (req, res) => {
//   try {
//     const { class: className, search, page = 1, limit = 10 } = req.query;
//     let query = {};
//     if (className) query.class = className;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { rollNumber: { $regex: search, $options: 'i' } }
//       ];
//     }
//     const students = await Student.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);
//     const total = await Student.countDocuments(query);
//     res.status(200).json({ success: true, data: students, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const getStudentById = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
//     res.status(200).json({ success: true, data: student });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const updateStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
//     res.status(200).json({ success: true, data: student });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const deleteStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);
//     if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
//     res.status(200).json({ success: true, message: 'Student deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent };

const Student = require('../models/student');

// Get all students (for User Panel)
const getStudents = async (req, res) => {
  try {
    const { class: className, search } = req.query;
    let query = {};
    
    if (className) {
      query.class = className;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error in getStudents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single student
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new student (from Admin Panel OR User Panel Enrollment)
const createStudent = async (req, res) => {
  try {
    const { rollNumber } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student with this roll number already exists' 
      });
    }
    
    const student = await Student.create(req.body);
    
    console.log(`✅ New student enrolled: ${student.name} (${student.rollNumber})`);
    
    res.status(201).json({ 
      success: true, 
      data: student,
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    console.error('Error in createStudent:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};