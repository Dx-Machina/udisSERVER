//===================================================================
// Healthcare service
//===================================================================
const User = require('../models/User');

const getHealthcareData = async (query) => {
  const user = await User.findOne(query, 'healthcare name email avatarPicture udisId');
  if (!user) throw new Error('User not found');
  return user;
};

const updateHealthcareData = async (udisId, healthcareUpdate) => {
  const user = await User.findOne({ udisId });
  if (!user) throw new Error('User not found');

  user.healthcare = healthcareUpdate;
  await user.save();
  return user;
};

const addRecentHealthcareInteraction = async (doctorUdisId, patient) => {
  const doctor = await User.findOne({ udisId: doctorUdisId });
  if (!doctor) throw new Error('Doctor not found');

  if (!doctor.recentInteractions) {
    doctor.recentInteractions = { healthcare: [], education: [], finance: [] };
  }

  let arr = doctor.recentInteractions.healthcare || [];
  
  arr = arr.filter(p => p.udisId !== patient.udisId);
  // Add user to front
  arr.unshift({
    udisId: patient.udisId,
    name: patient.name,
    avatarPicture: patient.avatarPicture || ''
  });
 
  arr = arr.slice(0, 10); // Keep last 10

  doctor.recentInteractions.healthcare = arr;
  await doctor.save();

  return doctor.recentInteractions.healthcare;
};

const getRecentPatientsForDoctor = async (doctorUdisId) => {
  const doctor = await User.findOne({ udisId: doctorUdisId }, 'recentInteractions');
  if (!doctor) throw new Error('Doctor not found');

  if (!doctor.recentInteractions || !doctor.recentInteractions.healthcare) {
    return [];
  }

  return doctor.recentInteractions.healthcare;
};

const removeRecentPatientForDoctor = async (doctorUdisId, patientUdisId) => {
  const doctor = await User.findOne({ udisId: doctorUdisId }, 'recentInteractions');
  if (!doctor) throw new Error('Doctor not found');

  if (!doctor.recentInteractions || !doctor.recentInteractions.healthcare) return;

  doctor.recentInteractions.healthcare = doctor.recentInteractions.healthcare.filter(s => s.udisId !== patientUdisId);
  await doctor.save();
};

// Update patient's care team
const updatePatientCareTeam = async (patientUdisId, careTeam) => {
  const user = await User.findOne({ udisId: patientUdisId });
  if (!user) throw new Error('User not found');

  if (!Array.isArray(careTeam)) {
    throw new Error('Care team must be an array');
  }

  // Validate care team entries have udisId and name
  careTeam.forEach(member => {
    if (!member.udisId || !member.name) {
      throw new Error('Each care team member must have a udisId and name');
    }
  });

  user.healthcare.careTeam = careTeam;
  await user.save();
  return user;
};

// Appointment requests
const requestAppointment = async (patientUdisId, doctorUdisId, description) => {
  const doctor = await User.findOne({ udisId: doctorUdisId });
  const patient = await User.findOne({ udisId: patientUdisId });
  if (!doctor) throw new Error('Doctor not found');
  if (!patient) throw new Error('Patient not found');

  patient.healthcare.appointmentRequests.push({
    patientUdisId,
    doctorUdisId,
    description: description || '',
    status: 'Pending',
    date: new Date()
  });

  await patient.save();
  return { message: 'Appointment requested successfully' };
};

const getAppointmentRequestsForDoctor = async (doctorUdisId) => {
  // Find all patients who have a request for this doctor
  const patients = await User.find({ 'healthcare.appointmentRequests.doctorUdisId': doctorUdisId }, 'udisId name healthcare.appointmentRequests');
  
  // Filter requests for this specific doctor
  let requests = [];
  for (const p of patients) {
    const filtered = p.healthcare.appointmentRequests.filter(r => r.doctorUdisId === doctorUdisId);
    filtered.forEach(req => {
      requests.push({
        patientUdisId: req.patientUdisId,
        doctorUdisId: req.doctorUdisId,
        description: req.description,
        status: req.status,
        date: req.date,
        patientName: p.name,
        patientUdisId: p.udisId
      });
    });
  }
  return requests;
};

const updateAppointmentRequestStatus = async (doctorUdisId, patientUdisId, status, date) => {
  const patient = await User.findOne({ udisId: patientUdisId });
  if (!patient) throw new Error('Patient not found');

  const request = patient.healthcare.appointmentRequests.find(r => r.doctorUdisId === doctorUdisId && r.patientUdisId === patientUdisId);
  if (!request) throw new Error('Appointment request not found');
  
  request.status = status;
  if (status === 'Approved' && date) {
    // Create an appointment
    patient.healthcare.appointments.push({
      date: new Date(date),
      type: 'Checkup',
      status: 'Scheduled',
      doctorId: doctorUdisId
    });
  }

  await patient.save();
  return { message: `Appointment request ${status}` };
};

module.exports = {
  getHealthcareData,
  updateHealthcareData,
  addRecentHealthcareInteraction,
  getRecentPatientsForDoctor,
  removeRecentPatientForDoctor,
  updatePatientCareTeam,
  requestAppointment,
  getAppointmentRequestsForDoctor,
  updateAppointmentRequestStatus
};