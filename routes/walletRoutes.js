//====================================================================================
// Wallet routes
//====================================================================================
const express = require('express');
const { getWalletDetails, sendMoney, generateWalletQRCode } = require('../controllers/walletController');
const { protect } = require('../middlewares/userMiddleware');
const { validateTransaction } = require('../middlewares/walletMiddleware');

const router = express.Router();

// Fetch wallet details for the authenticated user
router.get("/", protect, getWalletDetails);

router.post('/send', protect, validateTransaction, sendMoney); // Send money
router.get('/qrcode', protect, generateWalletQRCode); // Generate QR code

module.exports = router;