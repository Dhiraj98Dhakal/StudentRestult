const Student = require('../models/Student');

// 1. GET ALL STUDENTS
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ roll: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching students: ' + error.message,
    });
  }
};

// 2. GET STUDENT BY ROLL NUMBER
const getStudentByRoll = async (req, res) => {
  try {
    const student = await Student.findOne({ roll: req.params.roll });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `Student with roll ${req.params.roll} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching student: ' + error.message,
    });
  }
};

// 3. ADD NEW STUDENT
const addStudent = async (req, res) => {
  try {
    // Check if roll number already exists
    const existingStudent = await Student.findOne({ roll: req.body.roll });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: `Student with roll ${req.body.roll} already exists`,
      });
    }

    // Extract and validate required fields
    const { roll, name, subject, full, pass, obtain } = req.body;

    // Check for required fields
    if (
      !roll ||
      !name ||
      !subject ||
      full === undefined ||
      pass === undefined ||
      obtain === undefined
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields. Please provide: roll, name, subject, full, pass, obtain',
      });
    }

    // Validate marks
    if (full <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Full marks must be greater than 0',
      });
    }

    if (obtain < 0) {
      return res.status(400).json({
        success: false,
        error: 'Obtained marks cannot be negative',
      });
    }

    if (obtain > full) {
      return res.status(400).json({
        success: false,
        error: 'Obtained marks cannot exceed full marks',
      });
    }

    // Calculate percentage and result
    const percentage = (obtain / full) * 100;
    const result = obtain >= pass ? 'Pass' : 'Fail';

    // Create student data object
    const studentData = {
      roll,
      name,
      subject,
      full,
      pass,
      obtain,
      percentage: parseFloat(percentage.toFixed(2)),
      result,
    };

    // Create and save student
    const student = new Student(studentData);
    const savedStudent = await student.save();

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: savedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error adding student: ' + error.message,
    });
  }
};

// 4. UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    // Find the student first
    const student = await Student.findOne({ roll: req.params.roll });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `Student with roll ${req.params.roll} not found`,
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // If marks are being updated, recalculate percentage and result
    if (
      updateData.obtain !== undefined ||
      updateData.full !== undefined ||
      updateData.pass !== undefined
    ) {
      const full =
        updateData.full !== undefined ? updateData.full : student.full;
      const obtain =
        updateData.obtain !== undefined ? updateData.obtain : student.obtain;
      const pass =
        updateData.pass !== undefined ? updateData.pass : student.pass;

      // Validate marks
      if (full <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Full marks must be greater than 0',
        });
      }

      if (obtain < 0) {
        return res.status(400).json({
          success: false,
          error: 'Obtained marks cannot be negative',
        });
      }

      if (obtain > full) {
        return res.status(400).json({
          success: false,
          error: 'Obtained marks cannot exceed full marks',
        });
      }

      // Calculate new percentage and result
      updateData.percentage = parseFloat(((obtain / full) * 100).toFixed(2));
      updateData.result = obtain >= pass ? 'Pass' : 'Fail';
    }

    // Update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { roll: req.params.roll },
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validators
      }
    );

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error updating student: ' + error.message,
    });
  }
};

// 5. DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({
      roll: req.params.roll,
    });

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        error: `Student with roll ${req.params.roll} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting student: ' + error.message,
    });
  }
};

// Export all functions
module.exports = {
  getAllStudents,
  getStudentByRoll,
  addStudent,
  updateStudent,
  deleteStudent,
};
