// // routes/educationRoutes.js
// const express = require('express');
// const { protect } = require('../middlewares/userMiddleware');
// const rbacMiddleware = require('../middlewares/rbacMiddleware');
// const CourseSection = require('../models/education/CourseSection');
// const User = require('../models/User');

// const router = express.Router();


// // GET teacher home data
// router.get('/home', protect, rbacMiddleware('courseSection', 'read'), async (req, res) => {
//     try {
//       // Count sections and assignments:
//       const sections = await CourseSection.countDocuments({ teacher: req.user._id });
//       // If you have assignments link them to sections or just fetch them similarly:
//       const teacherSections = await CourseSection.find({ teacher: req.user._id }, '_id');
//       const assignmentCount = await Assignment.countDocuments({ section: { $in: teacherSections.map(s => s._id) } });
  
//       res.status(200).json({
//         sectionCount: sections,
//         assignmentCount,
//         // Add more summary data as needed
//       });
//     } catch (error) {
//       console.error('Error fetching teacher home data:', error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   });

// // GET all students taught by this teacher
// // This requires the teacher to have studentData: ['read'] permission
// router.get('/students', protect, rbacMiddleware('studentData', 'read'), async (req, res) => {
//   try {
//     // Only Teacher or roles that have studentData read permission should call this
//     if (req.user.role === 'Teacher') {
//       // Find all sections where teacher = req.user._id
//       const sections = await CourseSection.find({ teacher: req.user._id }, 'enrolledStudents');

//       // Extract all enrolledStudents IDs
//       let allStudentIds = [];
//       sections.forEach(sec => {
//         if (sec.enrolledStudents && sec.enrolledStudents.length > 0) {
//           allStudentIds = allStudentIds.concat(sec.enrolledStudents);
//         }
//       });

//       // Remove duplicates
//       const uniqueStudentIds = [...new Set(allStudentIds.map(id => id.toString()))];

//       if (uniqueStudentIds.length === 0) {
//         return res.status(200).json([]); // no students found
//       }

//       // Fetch user info for these students
//       const students = await User.find({ _id: { $in: uniqueStudentIds } }, 'udisId name avatarPicture');
      
//       // If you plan to store currentGrade somewhere, you need to join or compute it.
//       // For now, just return the basic info.
//       const studentData = students.map(s => ({
//         udisId: s.udisId,
//         name: s.name,
//         avatarPicture: s.avatarPicture,
//         currentGrade: 'N/A' // Placeholder until grades are implemented
//       }));
      
//       res.status(200).json(studentData);
//     } else {
//       // If another role (e.g., Advisor, SchoolAdmin) tries this, 
//       // and they have the permission (studentData:read) they can also view students.
//       // Adjust logic as needed for different roles.
//       // For now, let's just return 403 if not Teacher to keep it simple:
//       return res.status(403).json({ message: 'Only teachers can view this route for now.' });
//     }
//   } catch (error) {
//     console.error('Error fetching students for teacher:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;