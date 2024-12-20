// // models/Assignment.js
// const mongoose = require('mongoose');

// const SubmissionSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   grade: { type: Number },
//   submissionLink: { type: String }
// }, { timestamps: true });

// const AssignmentSchema = new mongoose.Schema({
//   section: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
//   title: { type: String, required: true },
//   description: { type: String },
//   dueDate: { type: Date },
//   maxPoints: { type: Number, default: 100 },
//   submissions: [SubmissionSchema]
// }, { timestamps: true });

// module.exports = mongoose.model('Assignment', AssignmentSchema);