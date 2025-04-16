
const routes = require('express').Router();
const stateController = require('../controllers/StateController');
routes.post("/addstate", stateController.addState);
routes.get("/getallstates", stateController.getAllStates);
routes.delete("/state/:id",stateController.deleteState);
routes.get("/state/:id",stateController.getStateById)


module.exports = routes;
