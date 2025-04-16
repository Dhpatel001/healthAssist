const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    // required: true
  },
  razorpayPaymentId: {
    type: String,
    required: true
  },
  razorpayOrderId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ['created', 'captured', 'failed', 'refunded'],
    default: 'created'
  },
  paymentMethod: String,
  currency: {
    type: String,
    default: 'INR'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  capturedAt: Date
});

module.exports = mongoose.model('Payment', PaymentSchema);