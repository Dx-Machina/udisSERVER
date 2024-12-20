//========================================================================================================================
// Log Controller
//========================================================================================================================

const AccessLog = require('../models/AccessLog');
const AuditTrail = require('../models/AuditTrail');

// Function to log access events
const logAccessEvent = async (userId, action, resource) => {
  const logEntry = new AccessLog({ userId, action, resource });
  await logEntry.save();
};

// Function to log audit trails
const logAuditTrail = async (userId, action, resource) => {
  const auditEntry = new AuditTrail({ userId, action, resource });
  await auditEntry.save();
};

// Function to get access logs
const getAccessLogs = async (req, res) => {
  const logs = await AccessLog.find().populate('userId', 'name email');
  res.json(logs);
};

// Function to get audit trails
const getAuditTrails = async (req, res) => {
  const trails = await AuditTrail.find().populate('userId', 'name email');
  res.json(trails);
};

module.exports = {
  logAccessEvent,
  logAuditTrail,
  getAccessLogs,
  getAuditTrails,
};