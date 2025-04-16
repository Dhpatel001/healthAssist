//database 
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const telemedicineSchema = new Schema({
    //fileds /// get

    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "appointments"
    },
    
    videoLink:{
        type:String,
    },
    notes:{
        type:String,
    }

},{timestamps: true})

module.exports = mongoose.model("TelemedicineS",telemedicineSchema)

//roles[roleSchema]