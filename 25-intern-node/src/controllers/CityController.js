
const cityModel = require("../models/CityModel");

const addCity = async (req, res) => {
  try {
    const savedCity = await cityModel.create(req.body);
    res.status(201).json({
      message: "City added successfully",
      data: savedCity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCities = async (req, res) => {
  try {
    const cities = await cityModel.find().populate("stateId");
    res.status(200).json({
      message: "All cities",
      data: cities,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteCity = async (req, res) => {

try{
  const deletedCity = await cityModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "city deleted successfully",
    data: deletedCity
  })
}catch(err){
  res.status(500).json({message:err});
}
}

const getCityById = async (req, res) => {
  try{
      const FoundCity = await cityModel.findById(req.params.id)
      res.json({
        message: "role fetched",
        data: FoundCity
  })
}catch(err){
  res.status(500).json({message:err})
}

}

const getCityByStateId = async (req, res) => {
  try {
    const cities = await cityModel.find({ stateId: req.params.stateId });
    res.status(200).json({
      message: "city found",
      data: cities,
    });
  } catch (err) {
    res.status(500).json({
      message: "city  not found",
    });
  }
};






module.exports = { addCity, getCities ,deleteCity,getCityById,getCityByStateId};