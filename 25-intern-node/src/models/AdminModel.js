//database 
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    //fileds /// get

    Firstname: {
        type: String,
    },
    Lastname: {
        type: String,
    },
    Age: {
        type: Number,
    },
    
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "roles"
    
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    totalUsers:{
        type:Number,
    },
    totalAppointments:{
        type:Number,
    },
    activeDoctor:{
        type:Number,
    },
    
    

},{timestamps: true})
module.exports = mongoose.model("admins", adminSchema)