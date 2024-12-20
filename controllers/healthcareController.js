//========================================================================================================================
// Healthcare Controller
//========================================================================================================================
const { 
  getHealthcareData, 
  updateHealthcareData, 
  getRecentPatientsForDoctor, 
  addRecentHealthcareInteraction,
  removeRecentPatientForDoctor,
  updatePatientCareTeam,
  requestAppointment,
  getAppointmentRequestsForDoctor,
  updateAppointmentRequestStatus
} = require('../services/healthcareService');

//========================================================================================================================
exports.getUserHealthcareData = async (req, res) => {
  try {
    const { udisId } = req.params;
    if (req.user.udisId !== udisId && req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'You can only view your own healthcare data.' });
    }

    const patient = await getHealthcareData({ udisId });
    res.json(patient);
  } catch (error) {
    console.error('[getUserHealthcareData] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.getPatientHealthcareData = async (req, res) => {
  try {
    const { udisId } = req.params;
    const patient = await getHealthcareData({ udisId });

    if (req.user && req.user.role === 'Doctor' && patient.udisId) {
      await addRecentHealthcareInteraction(req.user.udisId, {
        udisId: patient.udisId,
        name: patient.name,
        avatarPicture: patient.avatarPicture || ''
      });
    }

    res.json(patient);
  } catch (error) {
    console.error('[getPatientHealthcareData] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.updatePatientHealthcareData = async (req, res) => {
  try {
    const { udisId } = req.params;
    const healthcareUpdate = req.body.healthcare;

    const updatedPatient = await updateHealthcareData(udisId, healthcareUpdate);

    if (req.user && req.user.role === 'Doctor' && updatedPatient.udisId) {
      await addRecentHealthcareInteraction(req.user.udisId, {
        udisId: updatedPatient.udisId,
        name: updatedPatient.name,
        avatarPicture: updatedPatient.avatarPicture || ''
      });
    }

    res.json({
      message: 'Patient healthcare updated successfully',
      healthcare: updatedPatient.healthcare
    });
  } catch (error) {
    console.error('[updatePatientHealthcareData] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.getDoctorRecentPatients = async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Only doctors can access this endpoint.' });
    }

    const recentPatients = await getRecentPatientsForDoctor(req.user.udisId);
    res.json(recentPatients);
  } catch (error) {
    console.error('[getDoctorRecentPatients] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.removeRecentPatient = async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Only doctors can access this endpoint.' });
    }

    const { patientUdisId } = req.params;
    if (!patientUdisId || !patientUdisId.trim()) {
      return res.status(400).json({ message: 'Invalid UDIS ID' });
    }

    await removeRecentPatientForDoctor(req.user.udisId, patientUdisId);
    res.status(200).json({ message: 'Patient removed from recent interactions' });
  } catch (error) {
    console.error('Error removing recent patient:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.assignCareTeam = async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Only doctors can assign a care team.' });
    }

    const { udisId } = req.params; // Patient UDIS
    const { careTeam } = req.body;
    const updatedPatient = await updatePatientCareTeam(udisId, careTeam);
    res.status(200).json({ message: 'Care team updated', careTeam: updatedPatient.healthcare.careTeam });
  } catch (error) {
    console.error('Error updating care team:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.requestAppointment = async (req, res) => {
  try {
    const { doctorUdisId, description } = req.body;
    if (!req.user.udisId) {
      return res.status(403).json({ message: 'Not logged in or invalid token.' });
    }
    const patientUdisId = req.user.udisId;
    const result = await requestAppointment(patientUdisId, doctorUdisId, description);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error requesting appointment:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.getAppointmentRequests = async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Only doctors/care team members can view appointment requests.' });
    }

    const requests = await getAppointmentRequestsForDoctor(req.user.udisId);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching appointment requests:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//========================================================================================================================

//========================================================================================================================
exports.updateAppointmentRequest = async (req, res) => {
  try {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Only doctors/care team members can update appointment requests.' });
    }

    const { patientUdisId, status, date } = req.body;
    const result = await updateAppointmentRequestStatus(req.user.udisId, patientUdisId, status, date);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating appointment request:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//========================================================================================================================