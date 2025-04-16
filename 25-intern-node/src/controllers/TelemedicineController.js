const telemedicineModel = require("../models/TelemedicineModel")
//AppointmentModel == roles


const getAllTelemedicine = async (req, res) => {
  //await....
  //select * from userModel
try{
  const telemedic = await telemedicineModel.find()   //   .populate("roleId") //[{}]

  res.json({
    message: "Telemedic fetched successfully",
    data:telemedic
  });
}catch(err){
  res.status(500).json({message:err})
}
};

const addTelemedicine = async (req, res) => {
  try {
    const savedTelemedic = await telemedicineModel.create(req.body);
    res.status(201).json({
      message: "Telemedic added successfully",
      data: savedTelemedic,
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
};

const deleteTelemedicine = async (req, res) => {
try{
   const deletedtelemedic = await telemedicineModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "telemedic deleted successfully",
    data: deletedtelemedic
  })
}catch(err){
  res.status(500).json({message:err})
}

}
const getTelemedicineById = async (req, res) => {
  try{
      const FoundTelemedic = await telemedicineModel.findById(req.params.id)
      res.json({
        message: "EHR fetched",
        data: FoundTelemedic
  })
}catch(err){
  res.status(500).json({message:err})
}

}


module.exports = {
  getAllTelemedicine, addTelemedicine, deleteTelemedicine, getTelemedicineById
}