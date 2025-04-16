const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt")
const multer = require("multer");
const mailUtil = require("../utils/MailUtils")
const cloudinaryUtil = require("../utils/CloudanryUtil");
const path =require("path");
const jwt = require("jsonwebtoken");
const secret ="secret";
const UserModel = require("../models/UserModel");


const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//multer object....

const upload = multer({
  storage: storage,
  //fileFilter:
}).single("image");




const loginUser = async(req,res)=>{

    const email =req.body.email;
    const password= req.body.password;

    // const foundUserFromEmail=userModel.findOne({email:req.body.email})
    const foundUserFromEmail= await userModel.findOne({email:email}).populate("roleId");
    console.log(foundUserFromEmail);
    if (foundUserFromEmail != null) {
      
    const isMatch = bcrypt.compareSync(password, foundUserFromEmail.password);
      
      if (isMatch == true) {
        res.status(200).json({
          message: "login success",
          data: foundUserFromEmail,
        });
      } else { 
        res.status(404).json({
          message: "invalid cred..",
        });
      }
    } else {
      res.status(404).json({
        message: "Email not found..",
      });
    }
  };

const signup = async (req, res) => {
    
  try {
    //password encrupt..
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;
    const   createdUser = await userModel.create(req.body);

    //send mail to user...
    //const mailResponse = await mailUtil.sendingMail(createdUser.email,"welcome to eadvertisement","this is welcome mail")
    await mailUtil.sendingMail(createdUser.email,"welcome to Healthassist","this is welcome mail")

    res.status(201).json({
      message: "user created..",
      data: createdUser,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "error",
      data: err,
    });
  }
};



const getAlluser = async (req, res) => {
  //await....
  //select * from userModel
try{
  const users = await userModel.find().populate("roleId") //[{}]

  res.json({
    message: "role fetched successfully",
    data:users
  });
}catch(err){
  res.status(500).json({message:err})
}
};

const addUser = async (req, res) => {
try{
  const saveUSer = await userModel.create(req.body)
  res.json({
    message: "user created..",
    data: saveUSer
  })
}catch(err){
  res.status(500).json({message:err})
}

}

const deleteUser = async (req, res) => {
try{
   const deletedUser = await userModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "user deleted successfully",
    data: deletedUser
  })
}catch(err){
  res.status(500).json({message:err})
}

}

const getUserById= async(req,res)=>{
  try {
    const Users = await userModel.findById(req.params.id)//.populate("userId").populate("Id")
    if (!Users) {
      res.status(404).json({ message: "No Doctor found" });
    } else {
      res.status(200).json({
        message: "Doctor found successfully",
        data: Users,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
const addUserWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      // database data store
      //cloundinary

      const cloundinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
      console.log(cloundinaryResponse);
      console.log(req.body);

      //store data in database

      
      req.body.userPic = cloundinaryResponse.secure_url
      const savedUser = await userModel.create(req.body);

      res.status(200).json({
        message: "User saved successfully",
        data: savedUser
      });
    }
  });
};

const getUserByIdandUpdate = async (req, res) => {
  //update tablename set  ? where id = ?
  //update new data -->req.body
  //id -->req.params.id

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "User Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while update User Profile",
      err: err,
    });
  }
};
const updateUserPhoto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
      
      // Update user profile with new image URL
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        { userPic: cloudinaryResponse.secure_url },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User profile picture updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user photo", error: error.message });
    }
  });
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const foundUser = await userModel.findOne({ email: email });

  if (foundUser) {
    const token = jwt.sign(foundUser.toObject(), secret);
    console.log(token);
    const url = `http://localhost:5173/resetpassword/${token}`;
    const mailContent = `<html>
                          <a href ="${url}">rest password</a>
                          </html>`;
    //email...
    await mailUtil.sendingMail(foundUser.email, "reset password", mailContent);
    res.json({
      message: "reset password link sent to mail.",
    });
  } else {
    res.json({
      message: "user not found register first..",
    });
  }
};

const resetpassword = async (req, res) => {
  const token = req.body.token; //decode --> email | id
  const newPassword = req.body.password;

  const userFromToken = jwt.verify(token, secret);
  //object -->email,id..
  //password encrypt...
  const salt = bcrypt.genSaltSync(10);
  const hashedPasseord = bcrypt.hashSync(newPassword,salt);

  const updatedUser = await userModel.findByIdAndUpdate(userFromToken._id, {
    password: hashedPasseord,
  });
  res.json({
    message: "password updated successfully..",
  });
};

// Add these new methods to your existing UserController.js

// Get all health insights for a user
const getUserHealthInsights = async (req, res) => {
  try {
      const { alertType, isRead } = req.query;
      
      let query = { userId: req.params.userId };
      if (alertType) query.alertType = alertType;
      if (isRead) query.isRead = isRead === 'true';

      const insights = await HealthInsight.find(query)
          .populate('doctor', 'Firstname Lastname specialization')
          .sort({ createdAt: -1 });

      res.status(200).json({
          success: true,
          count: insights.length,
          data: insights
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error fetching health insights",
          error: err.message
      });
  }
};

// Get unread insights count for user
const getUnreadInsightsCount = async (req, res) => {
  try {
      const count = await HealthInsight.countDocuments({
          userId: req.params.userId,
          isRead: false
      });

      res.status(200).json({
          success: true,
          count
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error fetching unread count",
          error: err.message
      });
  }
};
module.exports = {
    getAlluser,addUser,deleteUser,getUserById,signup,loginUser,addUserWithFile,getUserByIdandUpdate,updateUserPhoto,forgotPassword,resetpassword,getUserHealthInsights,getUnreadInsightsCount
  }