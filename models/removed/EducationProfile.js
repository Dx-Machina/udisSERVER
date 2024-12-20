// const mongoose = require('mongoose');

// const CourseSchema = new mongoose.Schema({
//   courseName: { type: String, required: true },
//   courseCode: { type: String, required: true },
//   semester: { type: String, enum: ['Spring', 'Fall', 'Winter', 'Summer'], required: true },
//   year: { type: Number, required: true },
//   grade: { type: String } 
// });

// const ScholarshipSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   awardAmount: { type: Number },
//   awardedDate: { type: Date },
// });

// const DegreeSchema = new mongoose.Schema({
//   major: { type: String, required: true },
//   startDate: { type: Date },
//   endDate: { type: Date },
//   gpa: { type: Number },
//   honors: [{ type: String }],
//   thesisTitle: { type: String },
//   awards: [{ type: String }],
//   scholarships: [ScholarshipSchema],
//   courses: [CourseSchema]
// });

// const InstitutionSchema = new mongoose.Schema({
//   institutionName: { type: String, required: true },
//   institutionType: { type: String, required: true }, // "University", "High School", etc.
//   degrees: [DegreeSchema]
// });

// const EducationProfileSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   institutions: [InstitutionSchema]
// });

// EducationProfileSchema.index({ user: 1 }, { unique: true });

// module.exports = mongoose.model('EducationProfile', EducationProfileSchema);