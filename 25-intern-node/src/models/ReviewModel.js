// const mongoose = require('mongoose');

// const ReviewSchema = new mongoose.Schema({
//   appointmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'appointments',
//     required: true
//   },
//   doctorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'doctors',
//     required: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'users',
//     required: true
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   review: {
//     type: String,
//     trim: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update doctor's average rating when a new review is added
// ReviewSchema.post('save', async function(doc) {
//   try {
//     const Doctor = require('../models/DoctorModel');
//     const reviews = await this.model('Review').find({ doctorId: doc.doctorId });
    
//     const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
//     const averageRating = totalRatings / reviews.length;
    
//     await Doctor.findByIdAndUpdate(doc.doctorId, {
//       averageRating: parseFloat(averageRating.toFixed(1)),
//       totalReviews: reviews.length
//     });
//     console.log(`Doctor ${doc.doctorId} rating updated to ${averageRating.toFixed(1)}`);
//   } catch (error) {
//     console.error('Error updating doctor rating:', error);
//   }
// });

// module.exports = mongoose.model('Review', ReviewSchema);



const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointments',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(doctorId) {
  const obj = await this.aggregate([
    {
      $match: { doctorId: doctorId }
    },
    {
      $group: {
        _id: '$doctorId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    const Doctor = require('../models/DoctorModel');
    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: obj[0] ? parseFloat(obj[0].averageRating.toFixed(1)) : 0,
      totalReviews: obj[0] ? obj[0].totalReviews : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.doctorId);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.doctorId);
});

module.exports = mongoose.model('Review', ReviewSchema);