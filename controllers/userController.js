//===================================================================
// User Controller
//===================================================================
const { createUser, getUser, generateAuthToken, authenticateUser } = require('../services/userService');
const { createWallet } = require('../services/walletService');
const { generateQRCode } = require('../utils/qrCodeGenerator');

const registerUser = async (req, res) => {
  console.log('[userController][registerUser] Payload:', req.body, req.files);
  
  const { name, email, password, role, birthdate, phone, lastName } = req.body;
  
  // Files uploaded by multer
  const files = req.files || {};
  const pictureFile = files.pictureId ? files.pictureId[0] : null;
  const avatarFile = files.avatarPicture ? files.avatarPicture[0] : null;

  try {
    console.log('[userController][registerUser]: Creating new user with additional fields...');

    const newUser = await createUser({
      name,
      lastName,
      email,
      password,
      role,
      birthdate,
      phone,
      pictureId: pictureFile ? `/uploads/${pictureFile.filename}` : '',
      avatarPicture: avatarFile ? `/uploads/${avatarFile.filename}` : ''
    });

    console.log('[userController][registerUser]: User created:', newUser);
    console.log('[userController][registerUser]: Creating wallet for user...');

    await createWallet({
      udisId: newUser.udisId,
      name: newUser.name,
      email: newUser.email,
    });

    res.status(201).json({
      udisId: newUser.udisId,
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      pictureId: newUser.pictureId,
      avatarPicture: newUser.avatarPicture,
      token: await generateAuthToken(newUser.udisId),
    });
  } catch (error) {
    console.error('[userController][registerUser]: Error registering user: ', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  console.log('[userController][loginUser]: Payload:', req.body);
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    console.log('[userController][loginUser]: User logged in:', user);
    res.status(200).json({
      udisId: user.udisId,
      name: user.name,
      email: user.email,
      role: user.role,
      token: await generateAuthToken(user.udisId),
    });
  } catch (error) {
    console.error('[userController][loginUser]: Error logging in user:', error.message);
    res.status(500).json({ message: 'Unable to log-in. Please check your credentials and try again.', error: error.message });
  }
};

const generateUserQRCode = async (req, res) => {
  try {
    const qrData = JSON.stringify({ udisId: req.user.udisId }); 
    const qrCode = await generateQRCode(qrData);
    res.status(200).json({ qrCode });
  } catch (error) {
    console.error('[userController][generateUserQRCode] Error:', error.message);
    res.status(500).json({ message: 'Error generating user QR code', error: error.message });
  }
};

const verifyUserById = async (req, res) => { // Delegate this functionality to the service layer*****
  try {
    const { udisId } = req.params;

    let query;
    if (udisId.includes('@')) {

      query = { email: udisId }; // Treat as email
    } else {
      // Otherwise, treat as UDIS ID
      query = { udisId };
    }

    const user = await getUser(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      name: user.name,
      udisId: user.udisId,
      issuingAuthority: user.issuingAuthority || 'CA DMV',
      role: user.role,
      pictureId: user.pictureId || '/images/Default_Digital_ID.svg',
      email: user.email,
      avatarPicture: user.avatarPicture || '/images/default_avatar.png'
    });
  } catch (error) {
    console.error('[userController][verifyUserById] Error:', error.message);
    res.status(500).json({ message: 'Error verifying user', error: error.message });
  }
};

module.exports = { registerUser, loginUser, generateUserQRCode, verifyUserById };