const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentByRoll,
  addStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// GET all students
router.get('/', getAllStudents);

// GET student by roll number
router.get('/:roll', getStudentByRoll);

// POST add new student
router.post('/', addStudent);

// PUT update student
router.put('/:roll', updateStudent);

// DELETE student
router.delete('/:roll', deleteStudent);

module.exports = router;
