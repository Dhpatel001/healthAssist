const ChatMessage = require("../models/ChatModel");
const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");

const getChatMessages = async (req, res) => {
  try {
    const { appointment } = req.query;

    if (!appointment) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const messages = await ChatMessage.find({ appointment })
      .populate([
        {
          path: 'senderRef',
          select: 'Firstname Lastname profilePic'
        },
        {
          path: 'receiverRef',
          select: 'Firstname Lastname profilePic'
        }
      ])
      .sort({ timestamp: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getChatMessages:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, appointment } = req.body;
    const senderId = req.user.id;
    const senderRole = req.user.role; // 'USER' or 'DOCTOR'

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (!appointment) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    // Verify appointment status and participant
    const appointmentData = await Appointment.findOne({
      _id: appointment,
      status: 'Started',
      $or: [{ patient: senderId }, { doctor: senderId }]
    });

    if (!appointmentData) {
      return res.status(403).json({ 
        message: 'Cannot send message - appointment not started or not authorized'
      });
    }

    // Determine receiver
    const isPatient = appointmentData.patient.equals(senderId);
    const receiverId = isPatient ? appointmentData.doctor : appointmentData.patient;
    const receiverModel = isPatient ? 'Doctor' : 'User';

    const newMessage = new ChatMessage({
      sender: senderId,
      senderModel: senderRole === 'DOCTOR' ? 'Doctor' : 'User',
      receiver: receiverId,
      receiverModel: receiverModel,
      message: message.trim(),
      appointment
    });

    await newMessage.save();

    // Populate the message for response
    const populatedMessage = await ChatMessage.findById(newMessage._id)
      .populate([
        {
          path: 'senderRef',
          select: 'Firstname Lastname profilePic'
        },
        {
          path: 'receiverRef',
          select: 'Firstname Lastname profilePic'
        }
      ])
      .lean();

    // Emit socket event
    req.app.get('io').to(`appointment_${appointment}`).emit('receive_message', {
      ...populatedMessage,
      timestamp: new Date()
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

module.exports = {
  getChatMessages,
  sendMessage
};