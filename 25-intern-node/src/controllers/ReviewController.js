const Review = require('../models/ReviewModel');
const Appointment = require('../models/AppointmentModel');
const { default: mongoose } = require('mongoose');

exports.getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await Review.find({ doctorId })
      .populate('userId', 'Firstname Lastname profilePic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching doctor reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { appointmentId, doctorId, userId, rating, review } = req.body;
    console.log('Review submission received:', req.body);

    // Validate required fields
    if (!appointmentId || !doctorId || !userId || !rating) {
      console.log('Missing required fields:', {
        appointmentId: !appointmentId,
        doctorId: !doctorId,
        userId: !userId,
        rating: !rating
      });
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        missingFields: {
          appointmentId: !appointmentId,
          doctorId: !doctorId,
          userId: !userId,
          rating: !rating
        }
      });
    }

    // Validate IDs format
    if (!mongoose.Types.ObjectId.isValid(appointmentId) || 
        !mongoose.Types.ObjectId.isValid(doctorId) || 
        !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid ID format:', {
        appointmentId: !mongoose.Types.ObjectId.isValid(appointmentId),
        doctorId: !mongoose.Types.ObjectId.isValid(doctorId),
        userId: !mongoose.Types.ObjectId.isValid(userId)
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        invalidFields: {
          appointmentId: !mongoose.Types.ObjectId.isValid(appointmentId),
          doctorId: !mongoose.Types.ObjectId.isValid(doctorId),
          userId: !mongoose.Types.ObjectId.isValid(userId)
        }
      });
    }

    // Check if appointment exists and is completed
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', '_id');
    
    if (!appointment) {
      console.log('Appointment not found:', appointmentId);
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    if (appointment.status !== 'Completed') {
      console.log('Appointment not completed:', appointment.status);
      return res.status(400).json({ 
        success: false,
        message: 'Reviews can only be submitted for completed appointments' 
      });
    }

    // Verify the doctorId matches the appointment's doctor
    if (appointment.doctorId._id.toString() !== doctorId) {
      console.log('Doctor ID mismatch:', {
        appointmentDoctor: appointment.doctorId._id.toString(),
        providedDoctor: doctorId
      });
      return res.status(400).json({
        success: false,
        message: 'Doctor does not match appointment'
      });
    }

    // Check if review already exists for this appointment
    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      console.log('Review already exists for appointment:', appointmentId);
      return res.status(400).json({ 
        success: false,
        message: 'Review already submitted for this appointment' 
      });
    }

    // Create new review
    const newReview = new Review({
      appointmentId,
      doctorId,
      userId,
      rating,
      review: review || ''
    });

    await newReview.save();
    console.log('New review created:', newReview);

    // Update appointment with review reference
    await Appointment.findByIdAndUpdate(appointmentId, { review: newReview._id });
    console.log('Appointment updated with review reference');

    res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// const Review = require('../models/ReviewModel');
// const Appointment = require('../models/AppointmentModel');
// const Doctor = require('../models/DoctorModel');
// const { default: mongoose } = require('mongoose');

// // Get all reviews for a doctor with pagination
// exports.getDoctorReviews = async (req, res) => {
//   try {
//     const { doctorId } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const reviews = await Review.find({ doctorId })
//       .populate('userId', 'Firstname Lastname profilePic')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalReviews = await Review.countDocuments({ doctorId });
//     const doctor = await Doctor.findById(doctorId, 'averageRating totalReviews');

//     res.json({
//       success: true,
//       data: {
//         reviews,
//         averageRating: doctor.averageRating,
//         totalReviews: doctor.totalReviews,
//         currentPage: page,
//         totalPages: Math.ceil(totalReviews / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching doctor reviews:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get rating summary (count for each star)
// exports.getRatingSummary = async (req, res) => {
//   try {
//     const { doctorId } = req.params;
    
//     const summary = await Review.aggregate([
//       { $match: { doctorId: mongoose.Types.ObjectId(doctorId) } },
//       { 
//         $group: {
//           _id: '$rating',
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: -1 } }
//     ]);

//     // Format the response to include all possible ratings (1-5)
//     const formattedSummary = [1, 2, 3, 4, 5].map(rating => {
//       const found = summary.find(item => item._id === rating);
//       return {
//         rating,
//         count: found ? found.count : 0
//       };
//     });

//     res.json({
//       success: true,
//       data: formattedSummary
//     });
//   } catch (error) {
//     console.error('Error fetching rating summary:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Create review (existing implementation remains the same)
// exports.createReview = async (req, res) => {
//   // ... keep the existing createReview implementation ...
// };

// // Get top rated doctors
// exports.getTopRatedDoctors = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 5;
    
//     const topDoctors = await Doctor.aggregate([
//       { $match: { totalReviews: { $gt: 0 } } },
//       { $sort: { averageRating: -1, totalReviews: -1 } },
//       { $limit: limit },
//       {
//         $project: {
//           Firstname: 1,
//           Lastname: 1,
//           specialization: 1,
//           profilePic: 1,
//           averageRating: 1,
//           totalReviews: 1
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       data: topDoctors
//     });
//   } catch (error) {
//     console.error('Error fetching top rated doctors:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };