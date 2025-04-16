// models/PrescriptionModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicationSchema = new Schema({
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: {
    type: String
  }
});

const prescriptionSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "appointments",
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "doctors",
    required: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  medications: [medicationSchema],
  notes: {
    type: String
  },
  followUpDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("prescriptions", prescriptionSchema);