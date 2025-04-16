const electroinchealthrecordModel = require("../models/ElectronicHealthReacordModel")
//AppointmentModel == roles


const getAllEHR = async (req, res) => {
  //await....
  //select * from userModel
try{
  const EHRS = await electroinchealthrecordModel.find()   //   .populate("roleId") //[{}]

  res.json({
    message: "EHR fetched successfully",
    data:EHRS
  });
}catch(err){
  res.status(500).json({message:err})
}
};

const addEHR = async (req, res) => {
  try {
    const savedEHR = await electroinchealthrecordModel.create(req.body);
    res.status(201).json({
      message: "EHR added successfully",
      data: savedEHR,
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
};

const deleteEHR = async (req, res) => {
try{
   const deletedEHR = await electroinchealthrecordModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "EHR deleted successfully",
    data: deletedEHR
  })
}catch(err){
  res.status(500).json({message:err})
}

}
const getEHRById = async (req, res) => {
  try{
      const FoundEHR = await electroinchealthrecordModel.findById(req.params.id)
      res.json({
        message: "EHR fetched",
        data: FoundEHR
  })
}catch(err){
  res.status(500).json({message:err})
}

}


module.exports = {
  getAllEHR, addEHR, deleteEHR, getEHRById
}