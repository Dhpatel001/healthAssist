const routes = require("express").Router()
const appointmentController= require("../controllers/AppointmentController")
routes.get("/allappointment",appointmentController.getAllAppointment)
routes.post("/appointment",appointmentController.addAppointment)
routes.delete("/appointment/:id",appointmentController.deleteAppointment)
routes.get("/appointment/:id",appointmentController.getAppointmentById)
routes.get("/appointments/doctor/:doctorId", appointmentController.getAppointmentsByDoctor);
routes.get("/appointments/user/:userId", appointmentController.getAppointmentsByUser);
routes.put("/appointment/update-status/:id", appointmentController.updateAppointmentStatus);
routes.patch("/confirm/:id", appointmentController.confirmAppointment);
routes.patch("/cancel/:id", appointmentController.cancelAppointment);
// Add this new route for completing appointments
routes.patch("/complete/:id", appointmentController.completeAppointment);
routes.patch('/start/:id', appointmentController.startAppointment);


routes.get("/availability/:doctorId/:date", appointmentController.getDoctorAvailability);
routes.post("/check-availability", appointmentController.checkAvailability);



// New appointment routes
routes.patch("/reschedule/:id", appointmentController.rescheduleAppointment);
routes.post("/:id/notes", appointmentController.addPatientNotes);
routes.get("/analytics/:doctorId", appointmentController.getDoctorAnalytics);


// In your routes file
routes.patch('/appointments/:id/confirm',  appointmentController.confirmPayment);
routes.get('/payments/:doctorId', appointmentController.getPaymentHistory);

//v-imp
module.exports = routes