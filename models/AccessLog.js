const mongoose = require('mongoose');

const AccessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AccessLog = mongoose.model('AccessLog', AccessLogSchema);
module.exports = AccessLog;