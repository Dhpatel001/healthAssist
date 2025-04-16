const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatModel');
const Appointment = require('../models/AppointmentModel');
const { upload, handleFileUpload } = require('../controllers/FileUploadController');
// const authMiddleware = require('../middleware/authMiddleware');

// Get messages for an appointment
router.get('/:appointmentId',async (req, res) => {
  try {
    // Verify user has access to this appointment
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      $or: [{ patient: req.user.id }, { doctor: req.user.id }]
    });

    if (!appointment) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }

    const messages = await ChatMessage.find({ appointment: req.params.appointmentId })
      .sort({ createdAt: 1 })
      .populate('senderRef', 'Firstname Lastname profilePic')
      .populate('receiverRef', 'Firstname Lastname profilePic');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/upload', upload.single('file'), handleFileUpload);
module.exports = router;