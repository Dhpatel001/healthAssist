// controllers/prescriptionController.js
const Prescription = require('../models/PrescriptionModel');
const Appointment = require('../models/AppointmentModel');
const Notification = require("../models/NotificationModel");


const { default: mongoose } = require('mongoose');

// exports.createPrescription = async (req, res) => {
//   try {
//     const { appointmentId, diagnosis, medications, notes, followUpDate } = req.body;
    
//     // Validate required fields
//     if (!appointmentId || !diagnosis || !medications) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Create prescription
//     const prescription = new Prescription({
//       appointmentId: req.body.appointmentId,
//       doctorId: req.body.doctorId,
//       patientId: req.body.patientId,
//       diagnosis: req.body.diagnosis,
//       medications: req.body.medications,
//       notes: req.body.notes,
//       followUpDate: req.body.followUpDate
//     });

//     // Save prescription
//     const savedPrescription = await prescription.save();

//     // Complete the associated appointment
//     await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status: 'Completed' },
//       { new: true }
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Prescription created and appointment completed',
//       data: savedPrescription
//     });

//   } catch (error) {
//     console.error('Error creating prescription:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID'
      });
    }

    const prescriptions = await Prescription.find({ patientId })
      .populate('doctorId', 'Firstname Lastname specialization profilePic')
      .populate('appointmentId', 'appointmentDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescriptions',
      error: error.message
    });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription ID'
      });
    }

    const prescription = await Prescription.findById(id)
      .populate('doctorId', 'Firstname Lastname specialization profilePic')
      .populate('appointmentId', 'appointmentDate');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescription',
      error: error.message
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medications, notes, followUpDate } = req.body;
    
    // Validate required fields
    if (!appointmentId || !diagnosis || !medications) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create prescription
    const prescription = new Prescription({
      appointmentId: req.body.appointmentId,
      doctorId: req.body.doctorId,
      patientId: req.body.patientId,
      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      notes: req.body.notes,
      followUpDate: req.body.followUpDate
    });

    // Save prescription
    const savedPrescription = await prescription.save();

    // Complete the associated appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'Completed' },
      { new: true }
    ).populate('doctorId', 'Firstname Lastname')
     .populate('userId', 'Firstname Lastname');

    // Get the socket.io instance from the app
    const io = req.app.get('socketio');
    
    // Emit appointment completion event to all participants
    if (io) {
      io.to(`appointment_${appointmentId}`).emit('appointment_status_update', {
        appointmentId,
        status: 'Completed'
      });

      // Also emit to user and doctor specific rooms if needed
      io.to(`user_${updatedAppointment.userId._id}`).emit('appointment_completed', {
        appointmentId
      });
      
      io.to(`doctor_${updatedAppointment.doctorId._id}`).emit('appointment_completed', {
        appointmentId
      });
    }

    res.status(201).json({
      success: true,
      message: 'Prescription created and appointment completed',
      data: savedPrescription
    });

  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add to PrescriptionController.js


exports.getPrescriptionsByDoctorAndPatient = async (req, res) => {
  try {
    const prescriptions = await PrescriptionModel.find({
      doctorId: req.params.doctorId,
      patientId: req.params.patientId
    }).sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to PrescriptionController.js
exports.getPrescriptionByAppointment = async (req, res) => {
  try {
    const prescription = await PrescriptionModel.findOne({ 
      appointmentId: req.params.appointmentId 
    }).populate('doctorId patientId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPrescriptionByPatientAndAppointment = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    const prescription = await Prescription.findOne({ 
      patientId,
      appointmentId 
    })
    .populate('doctorId', 'Firstname Lastname specialization profilePic')
    .populate('patientId', 'Firstname Lastname userPic');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescription',
      error: error.message
    });
  }
};






// exports.createPrescription = async (req, res) => {
//   try {
//     const { appointmentId, diagnosis, medications, notes, followUpDate } = req.body;

//     const appointment = await Appointment.findById(appointmentId)
//       .populate('userId')
//       .populate('doctorId');

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found"
//       });
//     }

//     const prescription = new Prescription({
//       appointmentId,
//       doctorId: appointment.doctorId._id,
//       patientId: appointment.userId._id,
//       diagnosis,
//       medications,
//       notes,
//       followUpDate
//     });

//     await prescription.save();

//     // Create notification for patient
//     const notification = new Notification({
//       recipientId: appointment.userId._id,
//       recipientModel: 'users',
//       senderId: appointment.doctorId._id,
//       senderModel: 'doctors',
//       type: 'prescription',
//       title: 'New Prescription',
//       message: `You have a new prescription from Dr. ${appointment.doctorId.Firstname} ${appointment.doctorId.Lastname}`,
//       relatedEntity: prescription._id,
//       relatedEntityModel: 'prescriptions'
//     });

//     await notification.save();

//     res.status(201).json({
//       success: true,
//       message: "Prescription created successfully",
//       data: prescription
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

exports.getPrescriptionByAppointment = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;

    const prescription = await Prescription.findOne({
      patientId,
      appointmentId
    }).populate('doctorId');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId })
      .populate('doctorId')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};