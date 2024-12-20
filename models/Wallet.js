const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true, // Inherited from User
  },
  email: {
    type: String,
    required: true, // Inherited from User
  },
  balance: {
    type: Number,
    default: 1000, // Default balance
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Wallet', walletSchema);