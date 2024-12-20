// const express = require('express');
// const Course = require('../models/education/Course');
// const { protect } = require('../middlewares/userMiddleware'); 
// const rbacMiddleware = require('../middlewares/rbacMiddleware');

// const router = express.Router();

// // CREATE COURSES (Admin, SchoolAdmin, or special roles)
// router.post('/', protect, rbacMiddleware('course', 'create'), async (req, res) => {
//   try {
//     const newCourse = await Course.create(req.body);
//     res.status(201).json(newCourse);
//   } catch (error) {
//     console.error('Error creating course:', error);
//     res.status(500).json({ message: 'Error creating course', error: error.message });
//   }
// });

// // READ ALL COURSES
// router.get('/', protect, rbacMiddleware('course', 'read'), async (req, res) => {
//   const courses = await Course.find({});
//   res.status(200).json(courses);
// });

// // READ SINGLE COURSE
// router.get('/:id', protect, rbacMiddleware('course', 'read'), async (req, res) => {
//   const course = await Course.findById(req.params.id);
//   if (!course) return res.status(404).json({ message: 'Course not found' });
//   res.status(200).json(course);
// });

// // UPDATE COURSE
// router.put('/:id', protect, rbacMiddleware('course', 'update'), async (req, res) => {
//   const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   if (!updated) return res.status(404).json({ message: 'Course not found or update failed' });
//   res.status(200).json(updated);
// });

// // DELETE COURSE
// router.delete('/:id', protect, rbacMiddleware('course', 'delete'), async (req, res) => {
//   const deleted = await Course.findByIdAndDelete(req.params.id);
//   if (!deleted) return res.status(404).json({ message: 'Course not found' });
//   res.status(200).json({ message: 'Course deleted' });
// });

// module.exports = router;