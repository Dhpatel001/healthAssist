//database 
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ehrSchema = new Schema({
    //fileds /// get

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "doctors"
    },
    diagnosis:{
        type:String,
    },
    prescription:{
        type:String,
    },
    tretmentPlan:{
        type:String,
    }

},{timestamps: true})

module.exports = mongoose.model("EHRS",ehrSchema)

//roles[roleSchema]