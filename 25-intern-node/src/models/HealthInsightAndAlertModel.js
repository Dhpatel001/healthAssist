// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const healthInsightSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: "users",
//         required: true
//     },
//     doctorId: {
//         type: Schema.Types.ObjectId,
//         ref: "doctors"
//     },
//     appointmentId: {
//         type: Schema.Types.ObjectId,
//         ref: "appointments"
//     },
//     alertType: {
//         type: String,
//         enum: ['Checkup Reminder', 'Vaccination Alert', 'Medication Refill', 
//                'Health Tip', 'Test Result', 'Appointment Reminder', 'Follow-up', 'Appointment', 
//                'Reminder', 
//                'Alert', 
//                'Notification',
//                'Prescription',
//                'TestResult'],
//         // required: true
//     },
//     title: {
//         type: String,
//         // required: true
//     },
//     message: {
//         type: String,
//         // required: true
//     },
//     isRead: {
//         type: Boolean,
//         default: false
//     },
//     priority: {
//         type: String,
//         enum: ['Low', 'Medium', 'High'],
//         default: 'Medium'
//     },
//     scheduledDate: {
//         type: Date
//     },
//     metadata: {
//         type: Schema.Types.Mixed
//     }
// }, { 
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Virtual population
// healthInsightSchema.virtual('user', {
//     ref: 'users',
//     localField: 'userId',
//     foreignField: '_id',
//     justOne: true
// });

// healthInsightSchema.virtual('doctor', {
//     ref: 'doctors',
//     localField: 'doctorId',
//     foreignField: '_id',
//     justOne: true
// });

// healthInsightSchema.virtual('appointment', {
//     ref: 'appointments',
//     localField: 'appointmentId',
//     foreignField: '_id',
//     justOne: true
// });

// module.exports = mongoose.model("health_insights", healthInsightSchema);




// HealthInsightAndAlertModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthInsightSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "doctors"
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "appointments"
    },
    alertType: {
        type: String,
        enum: ['Checkup Reminder', 'Vaccination Alert', 'Medication Refill', 
               'Health Tip', 'Test Result', 'Appointment Reminder', 'Follow-up', 
               'Prescription', 'TestResult', 'Goal','Payment'],
      
    },
    category: {
        type: String,
        enum: ['Diet', 'Exercise', 'Medication', 'General', 'Vital', 'Appointment', 'Other'],
        default: 'General'
    },
    title: {
        type: String,
     
    },
    message: {
        type: String,
      
    },
    isRead: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    scheduledDate: {
        type: Date
    },
    goalDetails: {
        target: Number,
        current: Number,
        unit: String
    },
    metadata: {
        type: Schema.Types.Mixed
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual population
healthInsightSchema.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

healthInsightSchema.virtual('doctor', {
    ref: 'doctors',
    localField: 'doctorId',
    foreignField: '_id',
    justOne: true
});

healthInsightSchema.virtual('appointment', {
    ref: 'appointments',
    localField: 'appointmentId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model("health_insights", healthInsightSchema);