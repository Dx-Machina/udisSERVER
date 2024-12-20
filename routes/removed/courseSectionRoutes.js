// // routes/courseSectionRoutes.js
// const express = require('express');
// const CourseSection = require('../models/education/CourseSection');
// const Course = require('../models/education/Course');
// const { protect } = require('../middlewares/userMiddleware');
// const rbacMiddleware = require('../middlewares/rbacMiddleware');

// const router = express.Router();

// // CREATE course section (SchoolAdmin or Teacher)
// router.post('/', protect, rbacMiddleware('courseSection', 'create'), async (req, res) => {
//   try {
//     // Optional: If user is Teacher, ensure the teacher field = req.user._id
//     if (req.user.role === 'Teacher') {
//       // Teacher can only create sections they teach (teacher = themselves)
//       req.body.teacher = req.user._id;
//     }

//     const newSection = await CourseSection.create(req.body);
//     res.status(201).json(newSection);
//   } catch (error) {
//     console.error('Error creating course section:', error);
//     res.status(500).json({ message: 'Error creating course section', error: error.message });
//   }
// });

// // READ all sections (Allowed roles: multiple; Teacher should see only their sections)
// router.get('/', protect, rbacMiddleware('courseSection', 'read'), async (req, res) => {
//   let filter = {};
//   if (req.user.role === 'Teacher') {
//     // Teacher sees only their sections
//     filter.teacher = req.user._id;
//   }
  
//   const sections = await CourseSection.find(filter).populate('course').populate('teacher', 'name email');
//   res.status(200).json(sections);
// });

// // READ single section
// router.get('/:id', protect, rbacMiddleware('courseSection', 'read'), async (req, res) => {
//   const section = await CourseSection.findById(req.params.id).populate('course').populate('teacher', 'name email');
//   if (!section) return res.status(404).json({ message: 'CourseSection not found' });

//   // If Teacher, ensure they teach this section
//   if (req.user.role === 'Teacher' && String(section.teacher._id) !== String(req.user._id)) {
//     return res.status(403).json({ message: 'Not authorized to view this section' });
//   }

//   res.status(200).json(section);
// });

// // UPDATE section
// router.put('/:id', protect, rbacMiddleware('courseSection', 'update'), async (req, res) => {
//   const section = await CourseSection.findById(req.params.id);
//   if (!section) return res.status(404).json({ message: 'CourseSection not found' });

//   // If Teacher, ensure they teach this section
//   if (req.user.role === 'Teacher' && String(section.teacher) !== String(req.user._id)) {
//     return res.status(403).json({ message: 'Not authorized to update this section' });
//   }

//   Object.assign(section, req.body);
//   await section.save();
//   res.status(200).json(section);
// });

// // DELETE section
// router.delete('/:id', protect, rbacMiddleware('courseSection', 'delete'), async (req, res) => {
//   const section = await CourseSection.findById(req.params.id);
//   if (!section) return res.status(404).json({ message: 'CourseSection not found' });

//   // If Teacher, ensure they teach this section
//   if (req.user.role === 'Teacher' && String(section.teacher) !== String(req.user._id)) {
//     return res.status(403).json({ message: 'Not authorized to delete this section' });
//   }

//   await section.remove();
//   res.status(200).json({ message: 'CourseSection deleted' });
// });

// module.exports = router;