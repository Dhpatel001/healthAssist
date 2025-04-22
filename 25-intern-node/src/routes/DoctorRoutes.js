const routes =require("express").Router()
const doctorController =require("../controllers/DoctorController")
const DoctorModel = require("../models/DoctorModel")






routes.get("/doctor",doctorController.getAlldoctor)
routes.post("/doctorlogin",doctorController.loginDoctor)
routes.post("/doctor",doctorController.signup)
routes.post("/adddoctor",doctorController.addDoctor)
routes.delete("/doctor/:id",doctorController.deleteDoctor)
routes.get("/doctorbyid/:id",doctorController.getDoctorById)
routes.get("/doctorbyidfor/:doctorId",doctorController.getDoctorById)
routes.post("/adddocpic",doctorController.addUserWithFile)
routes.post("/doctor/forgotpassword",doctorController.forgotPassword)
routes.post("/doctor/resetpassword",doctorController.resetpassword)
routes.put("/updateddoctor/:id",doctorController.getDoctorByIdandUpdate)
routes.get('/getdoctorsbyuserid/:userId', doctorController.getAllDoctorByUserId);
routes.put("/updatedoctorphoto/:id", doctorController.updateDoctorPhoto);
routes.get("/specializations", doctorController.getAllSpecializations);
routes.get("/doctor/specialization/:specialization", doctorController.getDoctorsBySpecialization)


// Add these new routes to your existing DoctorRoutes.js

// Get insights created by this doctor
routes.get("/:doctorId/insights", doctorController.getDoctorInsights);

// Create insight for a patient
routes.post("/:doctorId/insights", doctorController.createPatientInsight);




// Approve doctor
routes.put('/approve-doctor/:id', async (req, res) => {
    try {
      const doctor = await DoctorModel.findByIdAndUpdate(
        req.params.id,
        { verificationStatus: 'verified' },
        { new: true }
      );
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Reject doctor
  routes.put('/reject-doctor/:id', async (req, res) => {
    try {
      const doctor = await DoctorModel.findByIdAndUpdate(
        req.params.id,
        { verificationStatus: 'rejected' },
        { new: true }
      );
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


module.exports = routes





 