
const routes = require('express').Router();
const cityController = require('../controllers/CityController');
routes.post("/addcity", cityController.addCity);    
routes.get("/getallcities", cityController.getCities);
routes.delete("/city/:id",cityController.deleteCity);
routes.get("/city/:id",cityController.getCityById)
routes.get("/getcitybystate/:stateId",cityController.getCityByStateId)


module.exports = routes;
