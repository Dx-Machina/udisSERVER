//====================================================================================
// UserService 
//====================================================================================
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const createUser = async ({ name, lastName, email, password, role, birthdate, phone, pictureId, avatarPicture }) => {
  try {
    console.log('[userService][createUser] Generating UDIS ID...');
    const udisId = await generateUDISId();
    console.log('[userService][createUser] Generated UDIS ID:', udisId);

    console.log('[userService][createUser]: Creating user with extended fields...');
    const user = new User({ 
      udisId,
      name,
      lastName,
      email,
      password,
      role,
      birthdate,
      phone,
      pictureId: pictureId || '',
      avatarPicture: avatarPicture || ''
    });

    console.log('[userService][createUser]: Saving user...');
    await user.save();

    console.log('[userService][createUser]: User registration successful', udisId);
    return user;
  } catch (error) {
    console.error('[userService][createUser]: Error creating user:', error.message);
    throw new Error(error.message);
  }
};

const authenticateUser = async (email, password) => {
  try {
    console.log('[userService] Authenticating user with email:', email);
    const user = await getUser({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    console.error('[userService] Error authenticating user:', error.message);
    throw new Error(error.message);
  }
};

const getUser = async (query) => {
  console.log('[userService] Fetching user with query:', query);
  try {
    const user = await User.findOne(query);
    if (!user) throw new Error('User not found');
    console.log('[userService] User found:', user);
    return user;
  } catch (error) {
    console.error('[userService] Error fetching user:', error.message);
    throw new Error(error.message);
  }
};

const generateUDISId = async () => {
  try {
    let id;
    let exists = true;

    do {
      id = crypto.randomBytes(3).toString('hex').toUpperCase();
      console.log('[userService] checking UDIS ID:', id);
      exists = await User.exists({ udisId: id });
    } while (exists);

    console.log('[userService] Generated UDIS ID:', id);
    return id;
  } catch (error) {
    console.error('[userService] Error generating UDIS ID:', error.message);
    throw new Error(error.message);
  }
};

const generateAuthToken = async (udisId) => {
  try {
    console.log('[userService] Generating token for UDIS ID:', udisId);
    return jwt.sign({ id: udisId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    console.error('[userService] Error generating token:', error.message);
    throw new Error(error.message);
  }
};

const verifyToken = async (token) => {
  try {
    console.log('[userService] Verifying token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[userService] Token decoded:', decoded);
    const user = await getUser({ udisId: decoded.id });
    if (!user) throw new Error('User not found');
    console.log('[userService] User authenticated from token:', user);
    return user;
  } catch (error) {
    console.error('[userService] Error verifying token:', error.message);
    throw new Error(error.message);
  }
};

module.exports = { createUser, authenticateUser, getUser, generateUDISId, generateAuthToken, verifyToken };