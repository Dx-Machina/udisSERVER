// // routes/assignmentRoutes.js
// const express = require('express');
// const Assignment = require('../models/education/Assignment');
// const CourseSection = require('../models/education/CourseSection');
// const { protect } = require('../middlewares/userMiddleware');
// const rbacMiddleware = require('../middlewares/rbacMiddleware');

// const router = express.Router();

// // CREATE assignment (Teacher or SchoolAdmin)
// router.post('/', protect, rbacMiddleware('assignment', 'create'), async (req, res) => {
//   try {
//     const { section } = req.body;
//     const sectionDoc = await CourseSection.findById(section);

//     if (!sectionDoc) return res.status(404).json({ message: 'Section not found' });

//     // If Teacher, ensure they teach this section
//     if (req.user.role === 'Teacher' && String(sectionDoc.teacher) !== String(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized to create assignments for this section' });
//     }

//     const newAssignment = await Assignment.create(req.body);
//     res.status(201).json(newAssignment);
//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     res.status(500).json({ message: 'Error creating assignment', error: error.message });
//   }
// });

// // READ all assignments (Teacher sees only assignments in their sections)
// router.get('/', protect, rbacMiddleware('assignment', 'read'), async (req, res) => {
//   let filter = {};
//   if (req.user.role === 'Teacher') {
//     // fetch sections taught by teacher
//     const teacherSections = await CourseSection.find({ teacher: req.user._id }, '_id');
//     filter.section = { $in: teacherSections.map(s => s._id) };
//   }
//   const assignments = await Assignment.find(filter).populate('section');
//   res.status(200).json(assignments);
// });

// // READ single assignment
// router.get('/:id', protect, rbacMiddleware('assignment', 'read'), async (req, res) => {
//   const assignment = await Assignment.findById(req.params.id).populate('section');
//   if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

//   // If Teacher, ensure they teach this section
//   if (req.user.role === 'Teacher') {
//     const teacherSections = await CourseSection.find({ teacher: req.user._id }, '_id');
//     const teacherSectionIds = teacherSections.map(s => String(s._id));
//     if (!teacherSectionIds.includes(String(assignment.section._id))) {
//       return res.status(403).json({ message: 'Not authorized to view this assignment' });
//     }
//   }

//   res.status(200).json(assignment);
// });

// // UPDATE assignment
// router.put('/:id', protect, rbacMiddleware('assignment', 'update'), async (req, res) => {
//   const assignment = await Assignment.findById(req.params.id);
//   if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

//   // If Teacher, ensure they teach the section for this assignment
//   if (req.user.role === 'Teacher') {
//     const sectionDoc = await CourseSection.findById(assignment.section);
//     if (String(sectionDoc.teacher) !== String(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized to update this assignment' });
//     }
//   }

//   Object.assign(assignment, req.body);
//   await assignment.save();
//   res.status(200).json(assignment);
// });

// // DELETE assignment
// router.delete('/:id', protect, rbacMiddleware('assignment', 'delete'), async (req, res) => {
//   const assignment = await Assignment.findById(req.params.id);
//   if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

//   // If Teacher, ensure they teach the section for this assignment
//   if (req.user.role === 'Teacher') {
//     const sectionDoc = await CourseSection.findById(assignment.section);
//     if (String(sectionDoc.teacher) !== String(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized to delete this assignment' });
//     }
//   }

//   await assignment.remove();
//   res.status(200).json({ message: 'Assignment deleted' });
// });

// module.exports = router;