// // models/Course.js
// const mongoose = require('mongoose');

// const CourseSchema = new mongoose.Schema({
//   approvalDate: { type: Date },
//   initialTerm: { type: String }, 
//   collegeType: { 
//     type: String, 
//     enum: ["California Community College", "California State University", "University of California", "Private College"], 
//     default: "California Community College" 
//   },
//   collegeName: { type: String },
//   courseId: { type: String, required: true,}, // C-ID#
//   descriptor: { type: String },
//   deptName: { type: String },
//   deptNumber: { type: String },
//   courseTitle: { type: String, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Course', CourseSchema);