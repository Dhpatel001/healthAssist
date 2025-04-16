const routes = require("express").Router()
const ElectronicHealthReacordController= require("../controllers/ElectronicHealthReacordController")
routes.get("/allehr",ElectronicHealthReacordController.getAllEHR)
routes.post("/addehr",ElectronicHealthReacordController.addEHR)
routes.delete("/delehr/:id",ElectronicHealthReacordController.deleteEHR)
routes.get("/ehrfind/:id",ElectronicHealthReacordController.getEHRById)
//v-imp
module.exports = routes