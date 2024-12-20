//====================================================================================
// Education Service
//====================================================================================
const User = require('../models/User');

// Existing functions omitted for brevity

async function getUserEducation(udisId) {
  const user = await User.findOne({ udisId }, 'name email avatarPicture education');
  if (!user) throw new Error('User not found');
  return {
    name: user.name || '',
    email: user.email || '',
    avatarPicture: user.avatarPicture || '',
    education: {
      major: user.education.major || '',
      classes: user.education.classes || []
    },
    rawUser: user
  };
}

async function updateUserEducation(udisId, educationData) {
  const user = await User.findOne({ udisId });
  if (!user) throw new Error('User not found');

  const { major, classes } = educationData || {};

  if (major !== undefined) user.education.major = major;
  if (Array.isArray(classes)) user.education.classes = classes;

  await user.save();

  return {
    message: 'Education profile updated',
    education: {
      major: user.education.major,
      classes: user.education.classes
    },
    rawUser: user
  };
}

async function addRecentEducationInteraction(teacherUdisId, student) {
  const teacher = await User.findOne({ udisId: teacherUdisId });
  if (!teacher) return;

  if (!teacher.recentInteractions) {
    teacher.recentInteractions = { healthcare: [], education: [], finance: [] };
  }

  let arr = teacher.recentInteractions.education || [];
  // Remove if exists
  arr = arr.filter(p => p.udisId !== student.udisId);
  // Add to front
  arr.unshift(student);
  // Keep last 10
  arr = arr.slice(0, 10);

  teacher.recentInteractions.education = arr;
  await teacher.save();
}

async function getRecentStudentsForTeacher(teacherUdisId) {
  const teacher = await User.findOne({ udisId: teacherUdisId }, 'recentInteractions');
  if (!teacher) throw new Error('Teacher not found');

  if (!teacher.recentInteractions || !teacher.recentInteractions.education) {
    return [];
  }

  return teacher.recentInteractions.education;
}

async function removeRecentStudentForTeacher(teacherUdisId, studentUdisId) {
  const teacher = await User.findOne({ udisId: teacherUdisId }, 'recentInteractions');
  if (!teacher) throw new Error('Teacher not found');

  if (!teacher.recentInteractions || !teacher.recentInteractions.education) return;

  teacher.recentInteractions.education = teacher.recentInteractions.education.filter(s => s.udisId !== studentUdisId);
  await teacher.save();
}

module.exports = {
  getUserEducation,
  updateUserEducation,
  addRecentEducationInteraction,
  getRecentStudentsForTeacher,
  removeRecentStudentForTeacher
};