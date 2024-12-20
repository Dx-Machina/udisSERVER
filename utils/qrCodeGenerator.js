const QRCode = require('qrcode');

/**
 * Generates a QR code as a data URL.
 * @param {String} input - Input string to encode in the QR code.
 * @returns {String} QR code as a data URL.
 */
const generateQRCode = async (input) => {
  try {
    return await QRCode.toDataURL(input);
  } catch (error) {
    throw new Error('Error generating QR code');
  }
};

module.exports = { generateQRCode };