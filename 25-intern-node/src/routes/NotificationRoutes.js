const routes = require('express').Router();
const notificationController = require('../controllers/NotificationController');

routes.get('/doctor/:doctorId', notificationController.getDoctorNotifications);
routes.patch('/:id/read', notificationController.markAsRead);

// Notification routes
routes.get("/notifications/:recipientId/:recipientModel", notificationController.getNotifications);
routes.patch("/notifications/:id/read",  notificationController.markAsRead);
routes.get("/notifications/:recipientId/:recipientModel/unread",notificationController.getUnreadCount);

module.exports = routes;