//database 
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const doctorSchema = new Schema({ 
    //fileds /// get

    Firstname: {
        type: String,
    },
    Lastname: {
        type: String,
    },
    name:{
        type: String,
    },
    Age: {
        type: Number,
    },
    qualification:{
        type:String
,    },
    specialization:{
        type:String,
    },
    experience:{
        type:String,
    },
    profilePic:{
        type:String,
    },
    about:{
        type:String,
    },
    availability:{
        enum:['morning','afternoon','evening','night','fulltime'],
        type:String,
    },
    Status: {
        type: Boolean,
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "roles"
    
    },
    
    email: {
        type: String,
        
    },
    password: {
        type: String,
    },
    phoneNumber:{
        type:Number
    },


    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      licenseNumber: {
        type: String,
        required: true
      },
      consultationFee: {
        type: Number,
        default: 0
      },
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"},

    // averageRating: {
    //         type: Number,
    //         default: 0,
    //         min: 0,
    //         max: 5
    //       },
    totalReviews: {
            type: Number,
            default: 0
          },

          averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
            set: v => parseFloat(v.toFixed(1))
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        ratingBreakdown: {
            1: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            5: { type: Number, default: 0 }
        },


licenseNumber: {
  type: String,
  
},
consultationFee: {
  type: Number,
  
},



    
    

},{timestamps: true})
module.exports = mongoose.model("doctors", doctorSchema)