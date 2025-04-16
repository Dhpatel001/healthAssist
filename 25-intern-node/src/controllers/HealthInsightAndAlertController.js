const HealthInsight = require("../models/HealthInsightAndAlertModel");
const Appointment = require("../models/AppointmentModel");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");

// Enhanced createInsight with doctor/appointment linking
exports.createInsight = async (req, res) => {
    try {
        const { userId, alertType, title, message, priority, appointmentId, isRead, scheduledDate } = req.body;
        
        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        let doctorId;
        if (appointmentId) {
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ 
                    success: false,
                    message: "Appointment not found" 
                });
            }
            doctorId = appointment.doctorId;
        }

        const newInsight = await HealthInsight.create({
            userId,
            doctorId,
            appointmentId,
            alertType,
            title,
            message,
            priority: priority || 'Medium',
            isRead: isRead || false,
            scheduledDate: scheduledDate || new Date()
        });

        // Emit socket event
        if (req.io) {
            req.io.emit('newInsight', newInsight);
        }
        
        res.status(201).json({
            success: true,
            message: "Health insight created successfully",
            data: newInsight
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating health insight",
            error: err.message
        });
    }
};

// Enhanced getUserInsights with filtering
exports.getUserInsights = async (req, res) => {
    try {
        const { userId } = req.params;
        const { alertType, isRead, priority } = req.query;

        let query = { userId };
        if (alertType) query.alertType = alertType;
        if (isRead) query.isRead = isRead === 'true';
        if (priority) query.priority = priority;

        const insights = await HealthInsight.find(query)
            .populate('doctor', 'Firstname Lastname specialization profilePic')
            .populate('appointment', 'appointmentDate status')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: insights.length,
            data: insights
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching user insights",
            error: err.message
        });
    }
};

// Get insight by ID
exports.getInsightById = async (req, res) => {
    try {
        const insight = await HealthInsight.findById(req.params.id)
            .populate('doctor', 'Firstname Lastname specialization')
            .populate('user', 'Firstname Lastname email');

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: "Health insight not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Insight fetched successfully",
            data: insight
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching insight",
            error: err.message
        });
    }
};

// Update insight
exports.updateInsight = async (req, res) => {
    try {
        const { alertType, title, message, isRead, priority, scheduledDate } = req.body;
        
        const updatedInsight = await HealthInsight.findByIdAndUpdate(
            req.params.id,
            {
                alertType,
                title,
                message,
                isRead,
                priority,
                scheduledDate
            },
            { new: true }
        ).populate('user doctor appointment');
        
        if (!updatedInsight) {
            return res.status(404).json({
                success: false,
                message: "Health insight not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Insight updated successfully",
            data: updatedInsight
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating insight",
            error: err.message
        });
    }
};

// Delete insight
exports.deleteInsight = async (req, res) => {
    try {
        const deletedInsight = await HealthInsight.findByIdAndDelete(req.params.id);
        
        if (!deletedInsight) {
            return res.status(404).json({
                success: false,
                message: "Health insight not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Insight deleted successfully",
            data: deletedInsight
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting insight",
            error: err.message
        });
    }
};

// Mark insight as read
exports.markAsRead = async (req, res) => {
    try {
        const updatedInsight = await HealthInsight.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        
        if (!updatedInsight) {
            return res.status(404).json({
                success: false,
                message: "Health insight not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Insight marked as read",
            data: updatedInsight
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error marking insight as read",
            error: err.message
        });
    }
};

// Get unread insights count for a user
exports.getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const count = await HealthInsight.countDocuments({
            userId,
            isRead: false
        });
        
        res.status(200).json({
            success: true,
            message: "Unread insights count fetched",
            count
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching unread count",
            error: err.message
        });
    }
};

// Get insights by type for a user
exports.getInsightsByType = async (req, res) => {
    try {
        const { userId, alertType } = req.params;
        
        const insights = await HealthInsight.find({
            userId,
            alertType
        })
        .populate('doctor', 'Firstname Lastname')
        .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: `User ${alertType} insights fetched`,
            data: insights
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching insights by type",
            error: err.message
        });
    }
};

// Get insights related to an appointment
exports.getInsightsByAppointment = async (req, res) => {
    try {
        const insights = await HealthInsight.find({
            appointmentId: req.params.appointmentId
        })
        .populate('user doctor');
        
        res.status(200).json({
            success: true,
            message: "Appointment insights fetched",
            data: insights
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching appointment insights",
            error: err.message
        });
    }
};

// Get insights created by a doctor
exports.getInsightsByDoctor = async (req, res) => {
    try {
        const insights = await HealthInsight.find({
            doctorId: req.params.doctorId
        })
        .populate('user', 'Firstname Lastname email')
        .populate('appointment', 'appointmentDate status')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Doctor insights fetched",
            data: insights
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching doctor insights",
            error: err.message
        });
    }
};

// Get insights created by a doctor (for doctor dashboard)
exports.getDoctorCreatedInsights = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        const insights = await HealthInsight.find({ doctorId })
            .populate('user', 'Firstname Lastname email')
            .populate('appointment')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: insights.length,
            data: insights
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching doctor insights",
            error: err.message
        });
    }
};

// Get all unread insights for a user
exports.getAllUnreadInsights = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const insights = await HealthInsight.find({
            userId,
            isRead: false
        })
        .populate('doctor', 'Firstname Lastname specialization')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: insights.length,
            data: insights
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching unread insights",
            error: err.message
        });
    }
};


// HealthInsightAndAlertController.js
// ... (keep all existing methods)

// Create health goal
exports.createHealthGoal = async (req, res) => {
    try {
        const { userId, title, message, category, target, current, unit } = req.body;
        
        const newGoal = await HealthInsight.create({
            userId,
            alertType: 'Goal',
            category,
            title,
            message,
            goalDetails: {
                target,
                current: current || 0,
                unit
            }
        });
        
        res.status(201).json({
            success: true,
            message: "Health goal created successfully",
            data: newGoal
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating health goal",
            error: err.message
        });
    }
};

// Update goal progress
exports.updateGoalProgress = async (req, res) => {
    try {
        const { current } = req.body;
        
        const updatedGoal = await HealthInsight.findByIdAndUpdate(
            req.params.id,
            { 
                $set: { 
                    "goalDetails.current": current 
                } 
            },
            { new: true }
        );
        
        if (!updatedGoal) {
            return res.status(404).json({
                success: false,
                message: "Health goal not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Goal progress updated",
            data: updatedGoal
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating goal progress",
            error: err.message
        });
    }
};

// Get goals by category
exports.getGoalsByCategory = async (req, res) => {
    try {
        const { userId, category } = req.params;
        
        const goals = await HealthInsight.find({
            userId,
            alertType: 'Goal',
            category
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching goals by category",
            error: err.message
        });
    }
};