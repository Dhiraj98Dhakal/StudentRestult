const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    roll: {
      type: Number,
      required: [true, 'Roll number is required'],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    full: {
      type: Number,
      required: [true, 'Full marks are required'],
      min: [1, 'Full marks must be at least 1'],
    },
    pass: {
      type: Number,
      required: [true, 'Pass marks are required'],
      min: [0, 'Pass marks cannot be negative'],
    },
    obtain: {
      type: Number,
      required: [true, 'Obtained marks are required'],
      min: [0, 'Obtained marks cannot be negative'],
    },
    percentage: {
      type: Number,
      required: true,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100'],
    },
    result: {
      type: String,
      required: true,
      enum: ['Pass', 'Fail'],
      default: 'Fail',
    },
  },
  {
    timestamps: true,
  }
);

// Remove the pre-save hooks that are causing issues
// We'll handle validation in the controller instead

module.exports = mongoose.model('Student', studentSchema);
