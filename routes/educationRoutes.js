//===================================================================
// Education Routes
//===================================================================
const express = require('express');
const { protect } = require('../middlewares/userMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const { getUserEducationData, updateUserEducationData, getRecentStudents, removeRecentStudent } = require('../controllers/educationController');

const router = express.Router();

router.get('/user/:udisId', protect, rbacMiddleware('educationProfile', 'read'), getUserEducationData);
router.put('/user/:udisId', protect, rbacMiddleware('educationProfile', 'update'), updateUserEducationData);
router.get('/recent-students', protect, rbacMiddleware('educationProfile', 'read'), getRecentStudents);
router.delete('/recent-students/:studentUdisId', protect, rbacMiddleware('educationProfile', 'read'), removeRecentStudent);

module.exports = router;