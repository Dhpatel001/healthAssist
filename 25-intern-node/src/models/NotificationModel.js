// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const notificationSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'users'
//   },
//   doctorId: {
//     type: Schema.Types.ObjectId,
//     ref: 'doctors'
//   },
//   appointmentId: {
//     type: Schema.Types.ObjectId,
//     ref: 'appointments'
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   read: {
//     type: Boolean,
//     default: false
//   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// },{
//     timestamps: true
// });

// module.exports = mongoose.model('notifications', notificationSchema);





const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipientId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel'
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['doctors', 'users']
  },
  senderId: {
    type: Schema.Types.ObjectId,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    enum: ['doctors', 'users']
  },
  type: {
    type: String,
    required: true,
    enum: ['appointment', 'prescription', 'message', 'system']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntity: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedEntityModel'
  },
  relatedEntityModel: {
    type: String,
    enum: ['appointments', 'prescriptions', 'messages']
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("notifications", notificationSchema);