// controllers/educationController.js
const { 
  getUserEducation, 
  updateUserEducation, 
  addRecentEducationInteraction,
  getRecentStudentsForTeacher,
  removeRecentStudentForTeacher
} = require('../services/educationService');

function sanitizeEducationData(education) {
  if (!education) return { major: '', classes: [] };

  const major = education.major || '';
  const classes = Array.isArray(education.classes) ? education.classes.map(cls => {
    return {
      className: cls.className || '',
      grade: cls.grade || '',
      cid: cls.cid || '',
      assignments: Array.isArray(cls.assignments) ? cls.assignments.map(a => ({
        title: a.title || 'Untitled Assignment',
        dueDate: a.dueDate || null,
        points: (typeof a.points === 'number') ? a.points : 100,
        submitted: a.submitted || false
      })) : []
    };
  }) : [];

  return { major, classes };
}

exports.getUserEducationData = async (req, res) => {
  try {
    const { udisId } = req.params;
    const result = await getUserEducation(udisId);

    // If the requester is a Teacher, update recentInteractions.education
    // Only do this if result.rawUser.udisId is defined
    if (req.user && req.user.role === 'Teacher' && result.rawUser.udisId) {
      await addRecentEducationInteraction(req.user.udisId, {
        udisId: result.rawUser.udisId, // Ensure we always pass udisId
        name: result.rawUser.name,
        avatarPicture: result.rawUser.avatarPicture || ''
      });
    }

    const sanitizedEducation = sanitizeEducationData(result.education);

    res.status(200).json({
      name: result.name || '',
      email: result.email || '',
      avatarPicture: result.avatarPicture || '',
      education: sanitizedEducation
    });
  } catch (error) {
    console.error('Error fetching user education data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUserEducationData = async (req, res) => {
  try {
    const { udisId } = req.params;
    const { education } = req.body;

    const result = await updateUserEducation(udisId, education);

    // Optionally re-add to recentInteractions if udisId is present
    if (req.user && req.user.role === 'Teacher' && result.rawUser.udisId) {
      await addRecentEducationInteraction(req.user.udisId, {
        udisId: result.rawUser.udisId,
        name: result.rawUser.name,
        avatarPicture: result.rawUser.avatarPicture || ''
      });
    }

    const sanitizedEducation = sanitizeEducationData(result.education);

    res.status(200).json({
      message: result.message,
      education: sanitizedEducation
    });
  } catch (error) {
    console.error('Error updating user education data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRecentStudents = async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Only teachers can access this endpoint.' });
    }

    const recentStudents = await getRecentStudentsForTeacher(req.user.udisId);
    res.json(recentStudents);
  } catch (error) {
    console.error('Error fetching recent students:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeRecentStudent = async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Only teachers can access this endpoint.' });
    }

    const { studentUdisId } = req.params;
    if (!studentUdisId || !studentUdisId.trim()) {
      return res.status(400).json({ message: 'Invalid UDIS ID' });
    }

    await removeRecentStudentForTeacher(req.user.udisId, studentUdisId);
    res.status(200).json({ message: 'Student removed from recent interactions' });
  } catch (error) {
    console.error('Error removing recent student:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// do the same to doctors domain 