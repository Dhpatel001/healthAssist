const Contact = require("../models/ContactModel");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message, userId, doctorId } = req.body;
        
        // If you want to prioritize the authenticated user over the body data
        let finalUserId = userId;
        let finalDoctorId = doctorId;
        
        if (req.user) {
            if (req.user.role === 'USER') {
                finalUserId = req.user._id;
            } else if (req.user.role === 'DOCTOR') {
                finalDoctorId = req.user._id;
            }
        }

        const newContact = new Contact({
            name,
            email,
            subject,
            message,
            userId: finalUserId,
            doctorId: finalDoctorId
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully!",
            data: newContact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error submitting contact form",
            error: error.message
        });
    }
};

exports.getContactMessages = async (req, res) => {
    try {
        // Only ADMIN can access all messages
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const messages = await Contact.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'Firstname Lastname email')
            .populate('doctorId', 'Firstname Lastname email');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching contact messages",
            error: error.message
        });
    }
};