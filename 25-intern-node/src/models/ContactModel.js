const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "doctors"
    },
    status: {
        type: String,
        enum: ['pending', 'responded', 'spam'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("contacts", contactSchema);