// routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/PrescriptionController');

// Doctor routes
router.post('/create', prescriptionController.createPrescription);

// Patient routes
router.get('/patient/:patientId', prescriptionController.getPrescriptionsByPatient);
router.get('/:id',prescriptionController.getPrescriptionById);

// Add to PrescriptionRoutes.js
router.get('/doctor/:doctorId/patient/:patientId', prescriptionController.getPrescriptionsByDoctorAndPatient);


// Add this route to PrescriptionRoutes.js
router.get('/appointment/:appointmentId', prescriptionController.getPrescriptionByAppointment);


router.get('/patient/:patientId/appointment/:appointmentId', prescriptionController.getPrescriptionByPatientAndAppointment);


// Prescription routes
router.post("/prescriptions", prescriptionController.createPrescription);
router.get("/prescriptions/:patientId/:appointmentId", prescriptionController.getPrescriptionByAppointment);
router.get("/prescriptions/:patientId",prescriptionController.getPatientPrescriptions);

module.exports = router;