// // routes/schoolAdminRoutes.js
// const express = require('express');
// const { protect } = require('../middlewares/userMiddleware');
// const rbacMiddleware = require('../middlewares/rbacMiddleware');
// const Course = require('../models/education/Course');
// const User = require('../models/User');

// const router = express.Router();

// // Create a course
// router.post('/courses', protect, rbacMiddleware('course', 'create'), async (req, res) => {
//   try {
//     const newCourse = await Course.create(req.body);
//     res.status(201).json(newCourse);
//   } catch (error) {
//     console.error('Error creating course:', error);
//     res.status(500).json({ message: 'Failed to create course', error: error.message });
//   }
// });

// // List all courses
// router.get('/courses', protect, rbacMiddleware('course', 'read'), async (req, res) => {
//   const courses = await Course.find({});
//   res.status(200).json(courses);
// });

// // Add user (teacher or student)
// router.post('/users', protect, rbacMiddleware('users', 'create'), async (req, res) => {
//   try {
//     const { name, email, role, password, birthdate } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });
    
//     const newUser = new User({
//       name,
//       email,
//       password,
//       role: role || 'Citizen',
//       birthdate: birthdate || '01 JAN 2000'
//     });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Failed to create user', error: error.message });
//   }
// });

// // List teachers
// router.get('/teachers', protect, rbacMiddleware('users', 'read'), async (req, res) => {
//   const teachers = await User.find({ role: 'Teacher' }, 'name email role');
//   res.status(200).json(teachers);
// });

// // List students
// router.get('/students', protect, rbacMiddleware('users', 'read'), async (req, res) => {
//   const students = await User.find({ role: 'Citizen' }, 'name email role');
//   res.status(200).json(students);
// });

// module.exports = router;