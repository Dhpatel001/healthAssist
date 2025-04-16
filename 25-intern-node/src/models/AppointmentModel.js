const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "doctors",
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Started'],
    default: 'Pending'
  },
  firstName: {
    type: String,
    // required: true
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: String,
    // required: true
  },
  paymentId: {
    type: String,
    // required: false 
    // Make it required if you want all appointments to have payments
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  cancelReason: {
    type: String
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'doctors'
    }
  }],
  rescheduledFrom: {
    originalDate: Date,
    originalTime: String,
    rescheduledAt: Date,
    rescheduledBy: {
      type: Schema.Types.ObjectId,
      ref: 'doctors'
    }
  }
}, { timestamps: true });

// Add compound index to prevent double booking
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 }, 
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);

module.exports = mongoose.model("appointments", appointmentSchema);