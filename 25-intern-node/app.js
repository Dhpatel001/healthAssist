const express = require("express") //express....
const cors = require('cors');
const mongoose = require("mongoose")
//express object..
const app = express()
require('dotenv').config();







//socket start
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});    //soket end here




app.use(cors())
app.use(express.json())// to accept data to json






//import role routess

const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes = require("./src/routes/UserRoutes")
app.use(userRoutes)

const doctorRoutes = require("./src/routes/DoctorRoutes")
app.use( doctorRoutes)

const adminRoutes = require("./src/routes/AdminRoutes")
app.use(adminRoutes)

const stateRoutes = require("./src/routes/StateRoutes")
app.use(stateRoutes)

const cityRoutes = require("./src/routes/CityRoutes")
app.use(cityRoutes)

const appointmentRoutes = require("./src/routes/AppointmentRoutes")
app.use("/appointment",appointmentRoutes)

const electroinchealthrecordRoutes = require("./src/routes/ElectronicHealthReacordRoutes")
app.use("/ehr",electroinchealthrecordRoutes)


const telemedicineRoutes = require("./src/routes/TelemedicineRoutes")
app.use("/ehr",telemedicineRoutes)

const notificationRoutes = require("./src/routes/NotificationRoutes")
app.use("/notification",notificationRoutes)

const healthInsightRoutes = require('./src/routes/HealthInsightAndAlertRoutes');
app.use(healthInsightRoutes);

const chatRoutes = require("./src/routes/ChatRoutes")
app.use("/chat",chatRoutes)

const ReviewRoutes = require("./src/routes/ReviewRoutes")
app.use("/reviews",ReviewRoutes)

const prescriptionRoutes = require('./src/routes/PrescriptionRoutes');
app.use('/prescription', prescriptionRoutes);

const ContactRoutes = require('./src/routes/ContactRoutes');
app.use('/contact', ContactRoutes);

const PaymentRoutes = require('./src/routes/PaymentRoutes');
app.use('/payment', PaymentRoutes);


//socket connection here

// Socket.io connection handler
// io.on('connection', (socket) => {
//     console.log('a user connected:', socket.id);
  
//     // Example: Handle joining a room
//     socket.on('join_room', (room) => {
//       socket.join(room);
//       console.log(`User ${socket.id} joined room ${room}`);
//     });
  
//     // Example: Handle chat messages
//     socket.on('send_message', (data) => {
//       socket.to(data.room).emit('receive_message', data);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('user disconnected:', socket.id);
//     });
//   });

//socket connection end here




mongoose.connect("mongodb://127.0.0.1:27017/25_node_internship").then(()=>{
    console.log("database connected....")
})


//server creation...

//old port name
// const PORT = 3000
// app.listen(PORT,()=>{
//     console.log("server started on port number ",PORT)
// })


//new port name
// Change from app.listen to server.listen
const PORT = 3000
server.listen(PORT, ()=>{
    console.log(`server started on port number ${PORT}`)
    console.log(`Socket.io is running on http://localhost:${PORT}`) //socket connection
})










//socket connection on 

// Update socket.io connection handler
// Socket.io connection handler
// In app.js, update the Socket.io connection handler (remove the duplicate one)
// In app.js, update the Socket.io connection handler
// Add these imports at the top of app.js
const Appointment = require("./src/models/AppointmentModel");
const ChatMessage = require("./src/models/ChatModel");

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle joining appointment room
  socket.on('join_appointment_room', async ({ appointmentId, userId, userType }) => {
    try {
      // Validate input
      if (!appointmentId || !userId || !userType) {
        throw new Error('Missing required fields');
      }

      // Verify appointment exists
      const appointment = await Appointment.findById(appointmentId)
        .populate('doctorId', 'Firstname Lastname profilePic')
        .populate('userId', 'Firstname Lastname userPic');

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Verify user is part of appointment
      const isParticipant = 
        (userType === 'USER' && appointment.userId._id.equals(userId)) || 
        (userType === 'DOCTOR' && appointment.doctorId._id.equals(userId));
      
      if (!isParticipant) {
        throw new Error('Unauthorized access to chat');
      }

      // Join the room
      socket.join(`appointment_${appointmentId}`);
      console.log(`${userType} ${userId} joined appointment room ${appointmentId}`);

      // Load previous messages (last 50 messages)
      const messages = await ChatMessage.find({ appointment: appointmentId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('sender', 'Firstname Lastname profilePic userPic');

      // Send success message with previous messages
      socket.emit('chat_ready', { 
        status: 'success',
        appointment: {
          ...appointment.toObject(),
          userId: appointment.userId, // Maintain compatibility with frontend
          doctorId: appointment.doctorId // Maintain compatibility with frontend
        },
        previousMessages: messages.reverse()
      });

    } catch (error) {
      console.error('Error joining room:', error.message);
      socket.emit('chat_error', { 
        status: 'error',
        message: error.message 
      });
    }
  });

  // Handle appointment messages
  socket.on('send_appointment_message', async (data) => {
    try {
      // Validate message data
      if (!data.appointmentId || !data.senderId || !data.message || !data.userType) {
        throw new Error('Invalid message data');
      }

      const appointment = await Appointment.findById(data.appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Verify sender is part of appointment
      const isParticipant = 
        (data.userType === 'USER' && appointment.userId.equals(data.senderId)) || 
        (data.userType === 'DOCTOR' && appointment.doctorId.equals(data.senderId));
      
      if (!isParticipant) {
        throw new Error('Unauthorized message sender');
      }

      // Determine receiver info
      const isPatient = data.userType === 'USER';
      const receiverId = isPatient ? appointment.doctorId : appointment.userId;
      const receiverModel = isPatient ? 'doctors' : 'users';

      // Create and save message
      const newMessage = new ChatMessage({
        sender: data.senderId,
        senderModel: data.userType === 'DOCTOR' ? 'doctors' : 'users',
        receiver: receiverId,
        receiverModel: receiverModel,
        message: data.message,
        appointment: data.appointmentId
      });

      await newMessage.save();

      // Populate the message for broadcasting
      const populatedMessage = await ChatMessage.findById(newMessage._id)
        .populate('sender', 'Firstname Lastname profilePic userPic');

      // Broadcast message to room
      io.to(`appointment_${data.appointmentId}`).emit('receive_message', {
        ...populatedMessage.toObject(),
        createdAt: new Date()
      });

    } catch (error) {
      console.error('Message handling error:', error.message);
      socket.emit('chat_error', { 
        status: 'error',
        message: 'Message could not be delivered',
        originalMessage: data.message 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('typing', async ({ appointmentId, userId, userType, isTyping }) => {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) throw new Error('Appointment not found');
      
      // Verify participant
      const isParticipant = 
        (userType === 'USER' && appointment.userId.equals(userId)) || 
        (userType === 'DOCTOR' && appointment.doctorId.equals(userId));
      
      if (!isParticipant) throw new Error('Unauthorized');
      
      socket.to(`appointment_${appointmentId}`).emit('typing', { 
        userId, 
        isTyping,
        userType
      });
    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  });

  // Read receipt handler
  socket.on('mark_as_read', async ({ messageId, userId, userType }) => {
    try {
      const message = await ChatMessage.findById(messageId);
      if (!message) throw new Error('Message not found');
      
      // Verify the reader is the intended recipient
      const isRecipient = 
        (userType === 'USER' && message.receiver.equals(userId)) || 
        (userType === 'DOCTOR' && message.receiver.equals(userId));
      
      if (!isRecipient) throw new Error('Unauthorized');
      
      // Add read receipt if not already exists
      if (!message.readBy.some(r => r.userId.equals(userId))) {
        message.readBy.push({
          userId,
          readAt: new Date()
        });
        await message.save();
        
        // Notify sender that message was read
        io.to(`appointment_${message.appointment}`).emit('message_read', {
          messageId,
          readBy: userId,
          readAt: new Date()
        });
      }
    } catch (error) {
      console.error('Read receipt error:', error);
    }
  });

  // File upload handler (frontend would upload to storage first, then send metadata)
  socket.on('send_file_message', async (fileData) => {
    try {
      // Validate file data
      if (!fileData.appointmentId || !fileData.senderId || !fileData.userType || !fileData.attachments) {
        throw new Error('Invalid file data');
      }

      const appointment = await Appointment.findById(fileData.appointmentId);
      if (!appointment) throw new Error('Appointment not found');

      // Verify sender is part of appointment
      const isParticipant = 
        (fileData.userType === 'USER' && appointment.userId.equals(fileData.senderId)) || 
        (fileData.userType === 'DOCTOR' && appointment.doctorId.equals(fileData.senderId));
      
      if (!isParticipant) throw new Error('Unauthorized file sender');

      // Create and save message
      const newMessage = new ChatMessage({
        sender: fileData.senderId,
        senderModel: fileData.userType === 'DOCTOR' ? 'doctors' : 'users',
        receiver: fileData.userType === 'USER' ? appointment.doctorId : appointment.userId,
        receiverModel: fileData.userType === 'USER' ? 'doctors' : 'users',
        appointment: fileData.appointmentId,
        attachments: fileData.attachments
      });

      await newMessage.save();
      const populatedMessage = await ChatMessage.findById(newMessage._id)
        .populate('sender', 'Firstname Lastname profilePic userPic');

      // Broadcast message to room
      io.to(`appointment_${fileData.appointmentId}`).emit('receive_message', populatedMessage.toObject());
    } catch (error) {
      console.error('File message error:', error);
      socket.emit('chat_error', { 
        message: 'Failed to send file',
        error: error.message
      });
    }
  });


 // Handle joining user's health insights room
 socket.on('join_health_insights', (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined health insights room`);
  } catch (error) {
    console.error('Error joining health insights room:', error);
  }
});


});