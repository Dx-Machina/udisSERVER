// healthcareRoutes.js

const express = require('express');
const { protect } = require('../middlewares/userMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');
const {
  getUserHealthcareData,
  getPatientHealthcareData,
  updatePatientHealthcareData,
  getDoctorRecentPatients,
  removeRecentPatient,
  assignCareTeam,
  requestAppointment,
  getAppointmentRequests,
  updateAppointmentRequest
} = require('../controllers/healthcareController');

const router = express.Router();

router.get('/user/:udisId', protect, rbacMiddleware('healthProfile', 'read'), getUserHealthcareData);
router.get('/patient/:udisId', protect, rbacMiddleware('healthProfile', 'update'), getPatientHealthcareData);
router.put('/patient/:udisId', protect, rbacMiddleware('healthProfile', 'update'), updatePatientHealthcareData);
router.get('/recent-patients', protect, rbacMiddleware('healthProfile', 'update'), getDoctorRecentPatients);
router.delete('/recent-patients/:patientUdisId', protect, rbacMiddleware('healthProfile', 'update'), removeRecentPatient);
router.put('/patient/:udisId/care-team', protect, rbacMiddleware('healthProfile', 'update'), assignCareTeam);

router.post('/request-appointment', protect, rbacMiddleware('appointments','create'), requestAppointment);

router.get('/appointment-requests', protect, rbacMiddleware('healthProfile', 'update'), getAppointmentRequests);
router.put('/appointment-requests', protect, rbacMiddleware('healthProfile', 'update'), updateAppointmentRequest);

module.exports = router;