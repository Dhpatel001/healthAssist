//database 
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const userSchema = new Schema({
    //fileds /// get

    Firstname: {
        type: String,
    },
    Lastname: {
        type: String,
    },
    PhoneNumber:{
        type:Number,
    },
    Age: {
        type: Number,
    },
    Status: {
        type: Boolean,
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "roles"

    },
   
    role:{
        type:String,
    },
    email: {
        type: String,
        
    },       
    password: {
        type: String,
        
    },
    gender:{
        enum:['Male','Female',"Other"],
        type:String,
        
    },
    role:{
        enum:['DOCTOR','USER','ADMIN'],
        type:String,
        
    },
    dateOfBirth:{
        type:Date,
    },
    mediacalHistory:{
        type:Array,
    },
    userPic:{
        type:String,
    }
    

},{timestamps: true})
module.exports = mongoose.model("users", userSchema)