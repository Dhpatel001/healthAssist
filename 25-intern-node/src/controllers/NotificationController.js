const Notification = require('../models/NotificationModel');

// Get doctor notifications
exports.getDoctorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      doctorId: req.params.doctorId 
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getNotifications = async (req, res) => {
  try {
    const { recipientId, recipientModel } = req.params;

    const notifications = await Notification.find({
      recipientId,
      recipientModel
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { recipientId, recipientModel } = req.params;

    const count = await Notification.countDocuments({
      recipientId,
      recipientModel,
      read: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};