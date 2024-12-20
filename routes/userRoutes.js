//===================================================================
// User routes
//===================================================================
const express = require('express');
const { registerUser, loginUser, generateUserQRCode, verifyUserById } = require('../controllers/userController');
const { getAccessLogs, getAuditTrails } = require('../controllers/logController');
const { protect } = require('../middlewares/userMiddleware');
const roleMiddleware = require('../middlewares/rbacMiddleware');
const { ADMIN_ROLES } = require('../constants/roles');
const multer = require('multer');

// Multer configuration
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Authentication routes for user registration and login
router.post('/register', upload.fields([
  { name: 'pictureId', maxCount: 1 }, 
  { name: 'avatarPicture', maxCount: 1 }
]), registerUser);

router.post('/login', loginUser);

// Fetch user profile route
router.get('/user', protect, (req, res) => {
  res.status(200).json(req.user);
});

// Generate QR code for user route
router.get('/qrcode', protect, generateUserQRCode);
router.get('/verify/:udisId', verifyUserById);

// Administrative logging routes
router.get('/logs/access-logs', protect, roleMiddleware(ADMIN_ROLES), getAccessLogs);
router.get('/logs/audit-trails', protect, roleMiddleware(ADMIN_ROLES), getAuditTrails);

module.exports = router;