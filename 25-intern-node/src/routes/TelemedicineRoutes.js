const routes = require("express").Router()
const TelemedicineController= require("../controllers/TelemedicineController")
routes.get("/alltelemedicine",TelemedicineController.getAllTelemedicine)
routes.post("/addtelemedicine",TelemedicineController.addTelemedicine)
routes.delete("/deltelemedicine/:id",TelemedicineController.deleteTelemedicine)
routes.get("/telemedicine/:id",TelemedicineController.getTelemedicineById)
//v-imp
module.exports = routes