const routes = require("express").Router();
const healthInsightController = require("../controllers/HealthInsightAndAlertController");

// Create a new health insight/alert
routes.post("/", healthInsightController.createInsight);

// Get all insights for a user with filtering
routes.get("/health/user/:userId", healthInsightController.getUserInsights);

// Get insight by ID
routes.get("/:id", healthInsightController.getInsightById);

// Update insight
routes.put("/:id", healthInsightController.updateInsight);

// Delete insight
routes.delete("/:id", healthInsightController.deleteInsight);

// Mark insight as read
routes.patch("/:id/mark-read", healthInsightController.markAsRead);

// Get unread insights count for a user
routes.get("/user/:userId/unread-count", healthInsightController.getUnreadCount);

// Get insights by type for a user
routes.get("/user/:userId/type/:alertType", healthInsightController.getInsightsByType);

// Get insights related to an appointment
routes.get("/appointment/:appointmentId", healthInsightController.getInsightsByAppointment);

// Get insights created by a doctor
routes.get("/doctor/:doctorId", healthInsightController.getInsightsByDoctor);

// Get insights created by a doctor (for doctor dashboard)
routes.get("/doctor/:doctorId/created", healthInsightController.getDoctorCreatedInsights);

// Get all unread insights for a user
routes.get("/user/:userId/unread", healthInsightController.getAllUnreadInsights);




// Create health goal
routes.post("/goals", healthInsightController.createHealthGoal);

// Update goal progress
routes.patch("/goals/:id/progress", healthInsightController.updateGoalProgress);

// Get goals by category
routes.get("/user/:userId/goals/:category", healthInsightController.getGoalsByCategory);


module.exports = routes;