// const getUser = require('../../services/userService');

// /**
//  * Get user profile based on type.
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  */
// const getProfile = async (req, res) => {
//   const { userId, profileType } = req.params;

//   try {
//     // Use getUser to fetch the user by udisId
//     const user = await getUser({ udisId: userId });
//     if (!user[profileType]) {
//       return res.status(404).json({ message: `Profile type '${profileType}' not found` });
//     }

//     res.status(200).json(user[profileType]); // Assuming profiles are nested in the user schema
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// /**
//  * Update user profile based on type.
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  */
// const updateProfile = async (req, res) => {
//   const { userId, profileType } = req.params;

//   try {
//     // Use getUser to fetch the user by udisId
//     const user = await getUser({ udisId: userId });
//     if (!user[profileType]) {
//       return res.status(404).json({ message: `Profile type '${profileType}' not found` });
//     }

//     user[profileType] = req.body; // Update profile with request body
//     await user.save();

//     res.status(200).json({ message: `${profileType} profile updated`, profile: user[profileType] });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = { getProfile, updateProfile };