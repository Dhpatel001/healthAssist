const AppointmentModel = require("../models/AppointmentModel");
const DoctorModel = require("../models/DoctorModel");
const HealthInsight = require("../models/HealthInsightAndAlertModel");
const Notification = require("../models/NotificationModel");
const Payment = require('../models/PaymentModel'); // Add this line
const mongoose = require('mongoose');



//AppointmentModel == roles
// const getAllAppointment = async (req, res) => {
//   try {
//     const appointments = await AppointmentModel.find().populate("doctorId", "Firstname Lastname specialization");
//     res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// const addAppointment = async (req, res) => {

//   const saveAppointments = await AppointmentModel.create(req.body)
//   res.json({
//     message: "appointment created..",
//     data: saveAppointments
//   })

// }

//old 2  


const deleteAppointment = async (req, res) => {

  //delete from role where id =?
  //req.params
  //console.log(req.paramas.id) 
  const deletedAppointment = await AppointmentModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "appointment deleted successfully",
    data: deletedAppointment
  })
}
const getAppointmentById = async (req, res) => {
  const FoundAppointment = await AppointmentModel.findById(req.params.id)
  res.json({
    message: "appointment fetched",
    data: FoundAppointment

  })
}


// const getAppointmentsByDoctor = async (req, res) => {
//   try {
//     const doctorId = req.params.doctorId;
//     if (!doctorId) {
//       return res.status(400).json({ message: "Doctor ID is required" });
//     }

//     const appointments = await AppointmentModel
//       .find({ doctorId })
//       .populate("userId", "Firstname Lastname phoneNumber dateOfBirth");

//     if (!appointments.length) {
//       return res.status(404).json({ message: "No appointments found" });
//     }

//     res.status(200).json({ message: "Appointments fetched", data: appointments });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const getAppointmentsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await AppointmentModel.find({ doctorId }).populate("userId", "firstName phoneNumber");
    
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments", error: err.message });
  }
};
// const  getAppointmentsByUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const appointments = await AppointmentModel.find({ userId })
//       .populate("doctorId", "Firstname Lastname specialization");

//     if (!appointments || appointments.length === 0) {
//       return res.status(404).json({ message: "No appointments found for this user" });
//     }

//     res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching appointments", error: err.message });
//   }
// }; 

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// const confirmAppointment = async (req, res) => {
//   try {
//     const appointmentId = req.params.id;
//     const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
//       appointmentId,
//       { status: "Confirmed" },
//       { new: true }
//     );
//     res.status(200).json({ message: "Appointment confirmed", data: updatedAppointment });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const cancelAppointment = async (req, res) => {
//   try {
//     const { cancelReason } = req.body;
//     const appointmentId = req.params.id;
//     const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
//       appointmentId,
//       { status: "Cancelled", cancelReason },
//       { new: true }
//     );
//     res.status(200).json({ message: "Appointment cancelled", data: updatedAppointment });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Update getAppointmentsByUser to include better population

const confirmAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "Confirmed" },
      { new: true }
    ).populate('doctorId', 'Firstname Lastname');

    if (!updatedAppointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      });
    }

    // Create confirmation insight
    try {
      await HealthInsight.create({
        userId: updatedAppointment.userId,
        doctorId: updatedAppointment.doctorId._id,
        appointmentId: updatedAppointment._id,
        alertType: 'Appointment Confirmation',
        title: 'Appointment Confirmed',
        message: `Your appointment with Dr. ${updatedAppointment.doctorId.Lastname} has been confirmed`,
        priority: 'Medium'
      });
    } catch (insightError) {
      console.error("Error creating confirmation insight:", insightError);
    }

    res.status(200).json({ 
      success: true,
      message: "Appointment confirmed", 
      data: updatedAppointment 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

const getAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await AppointmentModel.find({ userId })
      .populate({
        path: 'doctorId',
        select: 'Firstname Lastname specialization profilePic'
      })
      .sort({ appointmentDate: -1 }); // Sort by most recent first

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ 
        message: "No appointments found for this user" 
      });
    }

    res.status(200).json({ 
      message: "Appointments fetched successfully", 
      data: appointments 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching appointments", 
      error: err.message 
    });
  }
};

// Enhance cancelAppointment
const cancelAppointment = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const appointmentId = req.params.id;
    
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { 
        status: "Cancelled", 
        cancelReason,
        cancelledAt: new Date() // Add cancellation timestamp
      },
      { new: true }
    ).populate('doctorId', 'Firstname Lastname');

    if (!updatedAppointment) {
      return res.status(404).json({ 
        message: "Appointment not found" 
      });
    }

    // Optionally: Send cancellation notification
    // await sendCancellationEmail(updatedAppointment);

    res.status(200).json({ 
      message: "Appointment cancelled successfully", 
      data: updatedAppointment 
    });
  } catch (err) {
    res.status(500).json({ 
      message: err.message 
    });
  }
};

// Add this to addAppointment function after creating appointment
const createAppointmentReminder = async (appointment) => {
  try {
      const doctor = await DoctorModel.findById(appointment.doctorId);
      
      await HealthInsight.create({
          userId: appointment.userId,
          doctorId: appointment.doctorId,
          appointmentId: appointment._id,
          alertType: 'Appointment Reminder',
          title: `Appointment with Dr. ${doctor.Lastname}`,
          message: `Your appointment is scheduled for ${appointment.appointmentDate}`,
          priority: 'High',
          scheduledDate: new Date(appointment.appointmentDate.getTime() - 24 * 60 * 60 * 1000) // 1 day before
      });
  } catch (err) {
      console.error("Error creating appointment reminder:", err);
  }
};

// Add to confirmAppointment function
const createAppointmentConfirmation = async (appointment) => {
  try {
      await HealthInsight.create({
          userId: appointment.userId,
          doctorId: appointment.doctorId,
          appointmentId: appointment._id,
          alertType: 'Appointment Confirmation',
          title: 'Appointment Confirmed',
          message: `Your appointment with Dr. ${appointment.doctorId.Lastname} has been confirmed`,
          priority: 'Medium'
      });
  } catch (err) {
      console.error("Error creating confirmation:", err);
  }
};

// In AppointmentController.js
// const completeAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const appointment = await AppointmentModel.findById(id);
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     if (appointment.status !== 'Confirmed') {
//       return res.status(400).json({
//         message: `Cannot complete appointment with status: ${appointment.status}`
//       });
//     }

//     const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
//       id,
//       { 
//         status: "Completed",
//         completedAt: new Date()
//       },
//       { new: true }
//     ).populate('doctorId', 'Firstname Lastname')
//      .populate('userId', 'firstName lastName');

//     // Create health insight with valid alertType
//     try {
//       await HealthInsight.create({
//         userId: updatedAppointment.userId._id,
//         doctorId: updatedAppointment.doctorId._id,
//         appointmentId: updatedAppointment._id,
//         alertType: 'Appointment', // Use a valid enum value
//         title: 'Appointment Completed',
//         message: `Your appointment with Dr. ${updatedAppointment.doctorId.Lastname} has been completed`,
//         priority: 'Medium'
//       });
//     } catch (healthInsightError) {
//       console.error("Failed to create health insight:", healthInsightError);
//     }

//     res.status(200).json({ 
//       message: "Appointment completed successfully",
//       data: updatedAppointment
//     });

//   } catch (err) {
//     console.error("Error in completeAppointment:", err);
//     res.status(500).json({ 
//       message: "Failed to complete appointment",
//       error: err.message
//     });
//   }
// };  


const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentModel.findById(id)
      .populate('doctorId', 'Firstname Lastname')
      .populate('userId', 'Firstname Lastname');

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      });
    }

    if (appointment.status !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete appointment with status: ${appointment.status}`
      });
    }

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { 
        status: "Completed",
        completedAt: new Date()
      },
      { new: true }
    );

    // Create completion insight
    try {
      await HealthInsight.create({
        userId: appointment.userId._id,
        doctorId: appointment.doctorId._id,
        appointmentId: appointment._id,
        alertType: 'Appointment',
        title: 'Appointment Completed',
        message: `Your appointment with Dr. ${appointment.doctorId.Lastname} has been completed`,
        priority: 'Medium'
      });
    } catch (insightError) {
      console.error("Error creating completion insight:", insightError);
    }

    res.status(200).json({ 
      success: true,
      message: "Appointment completed successfully",
      data: updatedAppointment
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Failed to complete appointment",
      error: err.message
    });
  }
};

    

const startAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      req.params.id,
      { status: 'Started' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'Completed' },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getAllAppointment = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate("doctorId", "Firstname Lastname specialization profilePic")
      .populate("userId", "Firstname Lastname");
    res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new appointment with availability check
// const addAppointment = async (req, res) => {
//   try {
//     const { doctorId, appointmentDate, appointmentTime } = req.body;
    
//     // Check if slot is available
//     const existing = await AppointmentModel.findOne({
//       doctorId,
//       appointmentDate,
//       appointmentTime,
//       status: { $ne: 'Cancelled' }
//     });

//     if (existing) {
//       return res.status(400).json({ message: 'This time slot is already booked' });
//     }

//     const newAppointment = await AppointmentModel.create(req.body);
    
//     // Create appointment reminder
//     await createAppointmentReminder(newAppointment);
    
//     res.status(201).json({
//       message: "Appointment created successfully",
//       data: newAppointment
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const addAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, userId } = req.body;
    
    // Check slot availability
    const existing = await AppointmentModel.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'Cancelled' }
    });

    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'This time slot is already booked' 
      });
    }

    // Create the appointment
    const newAppointment = await AppointmentModel.create({
      ...req.body,
      status: 'Pending'
    });

    // Create appointment reminder
    try {
      const doctor = await DoctorModel.findById(doctorId);
      await HealthInsight.create({
        userId,
        doctorId,
        appointmentId: newAppointment._id,
        alertType: 'Appointment Reminder',
        title: `Appointment with Dr. ${doctor.Lastname}`,
        message: `Your appointment is scheduled for ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}`,
        priority: 'High',
        scheduledDate: new Date(new Date(appointmentDate).getTime() - 24 * 60 * 60 * 1000) // 1 day before
      });
    } catch (insightError) {
      console.error("Error creating reminder:", insightError);
    }

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Get doctor's availability
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    const appointments = await AppointmentModel.find({
      doctorId,
      appointmentDate: new Date(date),
      status: { $ne: 'Cancelled' }
    });

    const bookedSlots = appointments.map(app => app.appointmentTime);
    
    res.status(200).json({ 
      message: "Availability fetched successfully",
      data: { bookedSlots }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update all your existing functions (getAppointmentsByDoctor, getAppointmentsByUser, etc.)
// ... [keep all your existing controller functions exactly as you have them] ...

// Add this new function to check availability
const checkAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    
    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor ID and date are required" });
    }

    const appointments = await AppointmentModel.find({
      doctorId,
      appointmentDate: new Date(date),
      status: { $ne: 'Cancelled' }
    });

    const bookedSlots = appointments.map(app => app.appointmentTime);
    
    res.status(200).json({
      message: "Availability checked successfully",
      data: { bookedSlots }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const rescheduleAppointment = async (req, res) => {
  try {
    const { newDate, newTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if the new slot is available
    const conflictingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      appointmentDate: newDate,
      appointmentTime: newTime,
      status: { $ne: 'Cancelled' }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: "The selected time slot is already booked"
      });
    }

    // Save original details before rescheduling
    appointment.rescheduledFrom = {
      originalDate: appointment.appointmentDate,
      originalTime: appointment.appointmentTime,
      rescheduledAt: new Date(),
      rescheduledBy: req.user.id
    };

    // Update with new details
    appointment.appointmentDate = newDate;
    appointment.appointmentTime = newTime;
    appointment.status = 'Confirmed'; // Reset status to confirmed

    await appointment.save();

    // Create notification for patient
    const notification = new Notification({
      recipientId: appointment.userId,
      recipientModel: 'users',
      senderId: req.user.id,
      senderModel: 'doctors',
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: `Your appointment has been rescheduled to ${newDate} at ${newTime}`,
      relatedEntity: appointment._id,
      relatedEntityModel: 'appointments'
    });

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addPatientNotes = async (req, res) => {
  try {
    const { content } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    appointment.notes.push({
      content,
      createdBy: req.user.id
    });

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: appointment.notes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// const getDoctorAnalytics = async (req, res) => {
//   try {
//     const { range } = req.query;
//     const doctorId = req.params.doctorId;

//     let startDate;
//     const endDate = new Date();

//     if (range === 'weekly') {
//       startDate = new Date();
//       startDate.setDate(startDate.getDate() - 7);
//     } else if (range === 'monthly') {
//       startDate = new Date();
//       startDate.setMonth(startDate.getMonth() - 1);
//     } else {
//       // Default to monthly
//       startDate = new Date();
//       startDate.setMonth(startDate.getMonth() - 1);
//     }

//     const appointments = await Appointment.aggregate([
//       {
//         $match: {
//           doctorId: mongoose.Types.ObjectId(doctorId),
//           createdAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     const statusStats = await Appointment.aggregate([
//       {
//         $match: {
//           doctorId: mongoose.Types.ObjectId(doctorId),
//           createdAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         appointmentsOverTime: appointments,
//         statusStats
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// In your AppointmentController.js


// const getDoctorAnalytics = async (req, res) => {
//   try {
//     const { doctorId } = req.params;
//     const { range } = req.query;
    
//     // Implement your analytics logic here
//     const analyticsData = await calculateAnalytics(doctorId, range);
    
//     res.status(200).json({
//       success: true,
//       data: analyticsData
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };




// Add to AppointmentController.js

// const confirmPayment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { paymentId, paymentStatus } = req.body;

//     const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
//       id,
//       { 
//         status: "Confirmed",
//         paymentId,
//         paymentStatus,
//         paymentDate: new Date()
//       },
//       { new: true }
//     );

//     if (!updatedAppointment) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Appointment not found" 
//       });
//     }

//     // Create confirmation notification - using the valid 'Payment' alertType
//     await HealthInsight.create({
//       userId: updatedAppointment.userId,
//       doctorId: updatedAppointment.doctorId,
//       appointmentId: updatedAppointment._id,
//       alertType: 'Payment', // Now this is a valid enum value
//       title: 'Payment Received',
//       message: `Your payment of ₹${updatedAppointment.consultationFee} for appointment has been received`,
//       priority: 'High'
//     });

//     res.status(200).json({ 
//       success: true,
//       message: "Appointment confirmed successfully",
//       data: updatedAppointment
//     });

//   } catch (err) {
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to confirm appointment",
//       error: err.message
//     });
//   }
// };

const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId, paymentStatus, orderId, signature, amount } = req.body;

    // Get appointment first to get the amount
    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      });
    }

    // Use amount from request body or fall back to consultationFee or default
    const paymentAmount = amount || appointment.consultationFee || 0;

    // Update appointment
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { 
        status: "Confirmed",
        paymentId,
        paymentStatus: paymentStatus || "Completed",
        paymentDate: new Date(),
        orderId,
        signature
      },
      { new: true }
    );

    // Create payment record
    let paymentRecord = null;
    try {
      paymentRecord = new Payment({
        appointmentId: appointment._id,
        doctorId: appointment.doctorId,
        userId: appointment.userId,
        amount: paymentAmount, // Use the calculated amount
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
        status: 'captured',
        paymentMethod: 'razorpay',
        currency: 'INR',
        capturedAt: new Date()
      });
      await paymentRecord.save();
    } catch (paymentError) {
      console.error("Error saving payment record:", paymentError);
      return res.status(500).json({
        success: false,
        message: "Payment recorded but failed to save payment details",
        error: paymentError.message
      });
    }

    // Create confirmation notification
    try {
      await HealthInsight.create({
        userId: appointment.userId,
        doctorId: appointment.doctorId,
        appointmentId: appointment._id,
        alertType: 'Payment',
        title: 'Payment Received',
        message: `Your payment of ₹${paymentAmount} for appointment has been received`,
        priority: 'High'
      });
    } catch (insightError) {
      console.error("Error creating confirmation insight:", insightError);
    }

    res.status(200).json({ 
      success: true,
      message: "Appointment confirmed successfully",
      data: {
        appointment: updatedAppointment,
        payment: paymentRecord
      }
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Failed to confirm appointment",
      error: err.message
    });
  }
};

// const getDoctorAnalytics = async (req, res) => {
//   try {
//     const { doctorId } = req.params;
//     const { range = 'monthly' } = req.query;

//     // Date ranges
//     const now = new Date();
//     let startDate;
    
//     if (range === 'daily') {
//       startDate = new Date(now);
//       startDate.setDate(now.getDate() - 1); // Last 24 hours
//     } else if (range === 'weekly') {
//       startDate = new Date(now);
//       startDate.setDate(now.getDate() - 7); // Last 7 days
//     } else { // monthly
//       startDate = new Date(now);
//       startDate.setMonth(now.getMonth() - 1); // Last 30 days
//     }

//     // Get appointment counts by status
//     const statusStats = await AppointmentModel.aggregate([
//       {
//         $match: {
//           doctorId: new mongoose.Types.ObjectId(doctorId),
//           appointmentDate: { $gte: startDate, $lte: now }
//         }        
//       },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Get daily appointment counts
//     const dailyStats = await AppointmentModel.aggregate([
//       {
//         $match: {
//           doctorId: new mongoose.Types.ObjectId(doctorId),
//           appointmentDate: { $gte: startDate, $lte: now }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         statusStats,
//         dailyStats,
//         range
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching analytics:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


const getDoctorAnalytics = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { range = 'monthly' } = req.query;

    // Date ranges
    const now = new Date();
    let startDate;
    
    if (range === 'daily') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
    } else if (range === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else { // monthly
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    }

    // Get appointment counts by status
    const statusStats = await AppointmentModel.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId),
          appointmentDate: { $gte: startDate, $lte: now }
        }        
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get daily appointment counts
    const dailyStats = await AppointmentModel.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId),
          appointmentDate: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get payment analytics
    const paymentStats = await AppointmentModel.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId),
          paymentStatus: "Completed",
          appointmentDate: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$consultationFee" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats,
        dailyStats,
        paymentStats: paymentStats[0] || { totalEarnings: 0, count: 0 },
        range
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getPaymentHistory = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate, status } = req.query;

    // Build query object
    const query = { 
      doctorId: new mongoose.Types.ObjectId(doctorId),
      paymentStatus: { $exists: true } // Only appointments with payments
    };

    // Add date filter if provided
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add status filter if provided
    if (status) {
      query.paymentStatus = status;
    }

    // Get payment history
    const payments = await AppointmentModel.find(query)
      .populate('userId', 'Firstname Lastname phoneNumber')
      .sort({ paymentDate: -1 }); // Newest first

    // Calculate totals
    const stats = await AppointmentModel.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$consultationFee" },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        payments,
        stats: stats[0] || { totalEarnings: 0, totalPayments: 0 }
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: err.message
    });
  }
};

module.exports = {
  getAllAppointment, addAppointment, deleteAppointment, getAppointmentById,getAppointmentsByDoctor,getAppointmentsByUser,updateAppointmentStatus,confirmAppointment,cancelAppointment ,createAppointmentConfirmation,createAppointmentReminder,completeAppointment,startAppointment,getDoctorAvailability,checkAvailability,rescheduleAppointment,addPatientNotes,getDoctorAnalytics,confirmPayment,getPaymentHistory
}