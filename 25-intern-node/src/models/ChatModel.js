const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['doctors', 'users']
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['doctors', 'users']
  },
  message: {
    type: String,
    required: false // Not required for file messages
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'appointments',
    required: true
  },
  attachments: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio']
    },
    name: String,
    size: Number
  }],
  readBy: [{
    userId: Schema.Types.ObjectId,
    readAt: Date
  }],
  isTyping: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strictPopulate: false
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);