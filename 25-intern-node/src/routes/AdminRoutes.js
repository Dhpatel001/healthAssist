const routes =require("express").Router()
const AdminController =require("../controllers/AdminController")
routes.get("/admin",AdminController.getAlladmin)
routes.post("/admin/login",AdminController.loginAdmin)
routes.post("/admin",AdminController.signup)
// routes.post("/admin",AdminController.addAdmin)
routes.delete("/admin/:id",AdminController.deleteAdmin)
routes.get("/admin/:id",AdminController.getAdminById)



// In AdminRoutes.js
routes.get("/admin/users/all", AdminController.getAllUsers);
routes.get("/admin/doctors/all", AdminController.getAllDoctors);
routes.get("/admin/appointments/all", AdminController.getAllAppointments);


module.exports = routes
