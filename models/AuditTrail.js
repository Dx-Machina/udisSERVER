const mongoose = require('mongoose');

const AuditTrailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AuditTrail = mongoose.model('AuditTrail', AuditTrailSchema);
module.exports = AuditTrail;