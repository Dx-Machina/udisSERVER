// // models/CourseSection.js
// const mongoose = require('mongoose');

// const CourseSectionSchema = new mongoose.Schema({
//   course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   term: { type: String, required: true }, // e.g. "Fall 2024"
//   sectionNumber: { type: String, required: true }, // e.g. "01"
//   modality: { 
//     type: String, 
//     enum: ["Class", "Hybrid", "Online Sync", "Online Async"], 
//     required: true 
//   },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

//   schedule: {
//     days: [{ type: String }], // e.g. ["Mon", "Wed"]
//     startTime: { type: String }, // e.g. "10:00 AM"
//     endTime: { type: String }   // e.g. "11:30 AM"
//   }
// }, { timestamps: true });

// CourseSectionSchema.index({ course: 1, term: 1, sectionNumber: 1 }, { unique: true });

// module.exports = mongoose.model('CourseSection', CourseSectionSchema);