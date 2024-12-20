// // controllers/educationController.js
// const EducationProfile = require('../models/education/EducationProfile');
// const { getUser } = require('../services/userService');

// /**
//  * Fetch a user's entire education profile by their UDIS ID.
//  */
// exports.getEducationProfile = async (req, res) => {
//   const { udisId } = req.params;

//   try {
//     const user = await getUser({ udisId });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     let eduProfile = await EducationProfile.findOne({ user: user._id });
//     if (!eduProfile) {
//       // If the education profile doesn't exist, you could either return an empty profile
//       // or create one. Let's create a blank one for convenience.
//       eduProfile = new EducationProfile({ user: user._id, institutions: [] });
//       await eduProfile.save();
//     }

//     res.status(200).json(eduProfile);
//   } catch (error) {
//     console.error('[educationController][getEducationProfile] Error:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// /**
//  * Add a new institution or update existing institutions.
//  * Example Request Body:
//  * {
//  *   "institutions": [
//  *     {
//  *       "institutionName": "ABC University",
//  *       "institutionType": "University",
//  *       "degrees": []
//  *     }
//  *   ]
//  * }
//  */
// exports.updateInstitutions = async (req, res) => {
//   const { udisId } = req.params;

//   try {
//     const user = await getUser({ udisId });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     let eduProfile = await EducationProfile.findOne({ user: user._id });
//     if (!eduProfile) {
//       // Create if not exists
//       eduProfile = new EducationProfile({ user: user._id, institutions: [] });
//     }

//     // Replace or merge institutions. Let's assume we replace them fully in this example.
//     // For partial updates, you can iterate and merge accordingly.
//     const { institutions } = req.body;
//     if (!Array.isArray(institutions)) {
//       return res.status(400).json({ message: 'Institutions must be an array' });
//     }

//     eduProfile.institutions = institutions;
//     await eduProfile.save();
//     res.status(200).json({ message: 'Institutions updated', data: eduProfile });
//   } catch (error) {
//     console.error('[educationController][updateInstitutions] Error:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// /**
//  * Add a degree to a specific institution.
//  * Example Request Body:
//  * {
//  *   "major": "Computer Science",
//  *   "startDate": "2020-01-01",
//  *   "endDate": "2024-01-01",
//  *   "gpa": 3.5,
//  *   "honors": ["Dean's List"],
//  *   "thesisTitle": "Machine Learning",
//  *   "awards": ["Best Student Award"],
//  *   "scholarships": [
//  *     { "name": "Merit Scholarship", "awardAmount": 2000 }
//  *   ],
//  *   "courses": [
//  *     { "courseName": "Algorithms", "courseCode": "CS101", "semester": "Fall", "year": 2020, "grade": "A" }
//  *   ]
//  * }
//  */
// exports.addDegree = async (req, res) => {
//   const { udisId, institutionName } = req.params;

//   try {
//     const user = await getUser({ udisId });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     let eduProfile = await EducationProfile.findOne({ user: user._id });
//     if (!eduProfile) {
//       eduProfile = new EducationProfile({ user: user._id, institutions: [] });
//     }

//     const institution = eduProfile.institutions.find(inst => inst.institutionName === institutionName);
//     if (!institution) {
//       return res.status(404).json({ message: `Institution '${institutionName}' not found` });
//     }

//     institution.degrees.push(req.body);
//     await eduProfile.save();
//     res.status(200).json({ message: 'Degree added', data: eduProfile });
//   } catch (error) {
//     console.error('[educationController][addDegree] Error:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// /**
//  * Add a course to a specific degree in a specific institution.
//  * Example PUT body:
//  * {
//  *   "courseName": "Linear Algebra",
//  *   "courseCode": "MATH201",
//  *   "semester": "Spring",
//  *   "year": 2021,
//  *   "grade": "A"
//  * }
//  */
// exports.addCourse = async (req, res) => {
//   const { udisId, institutionName, degreeIndex } = req.params;

//   try {
//     const user = await getUser({ udisId });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     let eduProfile = await EducationProfile.findOne({ user: user._id });
//     if (!eduProfile) {
//       return res.status(404).json({ message: 'Education profile not found' });
//     }

//     const institution = eduProfile.institutions.find(inst => inst.institutionName === institutionName);
//     if (!institution) {
//       return res.status(404).json({ message: `Institution '${institutionName}' not found` });
//     }

//     const degree = institution.degrees[parseInt(degreeIndex, 10)];
//     if (!degree) {
//       return res.status(404).json({ message: `Degree at index ${degreeIndex} not found` });
//     }

//     // Validate semester and year (for example)
//     const { semester, year } = req.body;
//     const allowedSemesters = ['Spring', 'Fall', 'Winter', 'Summer'];
//     if (!allowedSemesters.includes(semester)) {
//       return res.status(400).json({ message: `Semester must be one of: ${allowedSemesters.join(', ')}` });
//     }
//     if (year < 1900 || year > new Date().getFullYear() + 10) {
//       return res.status(400).json({ message: 'Year is out of reasonable range' });
//     }

//     degree.courses.push(req.body);
//     await eduProfile.save();
//     res.status(200).json({ message: 'Course added', data: eduProfile });
//   } catch (error) {
//     console.error('[educationController][addCourse] Error:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };