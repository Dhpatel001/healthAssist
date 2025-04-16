
const stateModel = require("../models/StateModel");

//addState
//getAllStates.

const addState = async (req, res) => {
  try {
    const savedState = await stateModel.create(req.body);
    res.status(201).json({
      message: "State added successfully",
      data: savedState,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

const getAllStates = async (req, res) => {

    try{
        
        const states = await stateModel.find();
        res.status(200).json({
            message: "All states fetched successfully",
            data: states
        })

    }catch(err){

        res.status(500).json({
            message: err
        })

    }

}


const deleteState = async (req, res) => {

try{
  const deletedState = await stateModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "state deleted successfully",
    data: deletedState
  })
}catch(err){
  res.status(500).json({message:err});
}
}
const getStateById = async (req, res) => {
  try{
      const FoundState = await stateModel.findById(req.params.id)
      res.json({
        message: "role fetched",
        data: FoundState
  })
}catch(err){
  res.status(500).json({message:err})
}

}



module.exports = {
    addState,
    getAllStates,
    deleteState,
    getStateById
}
