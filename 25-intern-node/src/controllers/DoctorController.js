const doctorModel = require("../models/DoctorModel");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path =require("path")

const HealthInsight = require("../models/HealthInsightAndAlertModel");

const cloudinaryUtil = require("../utils/CloudanryUtil");



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


const addDoctor = async (req, res) => {
  try {
    const savedDoctor = await doctorModel.create(req.body);
    res.status(201).json({
      message: "doctor added successfully",
      data: savedDoctor,
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
};



const getAlldoctor = async (req, res) => {
  //await....
  //select * from userModel
try{
  const users = await doctorModel.find().populate("roleId") //[{}]

  res.json({
    message: "role fetched successfully",
    data:users
  });
}catch(err){
  res.status(500).json({message:err})
}
};



const deleteDoctor = async (req, res) => {
try{
   const deletedDoctor = await doctorModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "user deleted successfully",
    data: deletedDoctor
  })
}catch(err){
  res.status(500).json({message:err})
}

}

const getDoctorById= async(req,res)=>{
  try {
    const Doctors = await doctorModel.findById(req.params.id)//.populate("userId").populate("Id")
    if (!Doctors) {
      res.status(404).json({ message: "No Doctor found" });
    } else {
      res.status(200).json({
        message: "Doctor found successfully",
        data: Doctors,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// const signup = async (req, res) => {
    
//   try {
//     //password encrupt..
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);
//     req.body.password = hashedPassword;
//     const createdDoctor = await doctorModel.create(req.body);
//     res.status(201).json({
//       message: "user created..",
//       data: createdDoctor,
//     });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({
//       message: "error",
//       data: err,
//     });
//   }
// };


const signup = async (req, res) => {
  try {
    // Set default verification status
    req.body.verificationStatus = 'pending';
    
    // Password encryption
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;
    
    const createdDoctor = await doctorModel.create(req.body);
    
    res.status(201).json({
      message: "Doctor registration submitted for admin approval",
      data: createdDoctor,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Error in registration",
      data: err,
    });
  }
};

// const loginDoctor = async(req,res)=>{

//   const email =req.body.email;
//   const password= req.body.password;

//   // const foundUserFromEmail=doctorModel.findOne({email:req.body.email})
//   const foundDoctorFromEmail= await doctorModel.findOne({email:email}).populate("roleId");
//   console.log(foundDoctorFromEmail);
//   if (foundDoctorFromEmail != null) {
    
//   const isMatch = bcrypt.compareSync(password, foundDoctorFromEmail.password);
    
//     if (isMatch == true) {
//       res.status(200).json({
//         message: "login success",
//         data: foundDoctorFromEmail,
//       });
//     } else {
//       res.status(404).json({
//         message: "invalid cred..",
//       });
//     }
//   } else {
//     res.status(404).json({
//       message: "Email not found..",
//     });
//   }
// };




const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // 2. Find doctor by email
    const doctor = await doctorModel.findOne({ email }).populate("roleId");
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: "Email not found. Please check your email or sign up." 
      });
    }

    // 3. Verify password
    const isPasswordValid = bcrypt.compareSync(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // 4. Check verification status
    if (doctor.verificationStatus === 'rejected') {
      return res.status(403).json({ 
        success: false,
        message: "Your account has been rejected. Please contact admin for assistance." 
      });
    }

    // 5. Successful login response
    res.status(200).json({
      success: true,
      message: doctor.verificationStatus === 'pending' 
        ? "Login successful (Account pending approval - limited access)" 
        : "Login successful",
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        roleId: doctor.roleId,
        verificationStatus: doctor.verificationStatus,
        profilePic: doctor.profilePic,
        specialization: doctor.specialization
      },
      isPending: doctor.verificationStatus === 'pending'
    });

  } catch (error) {
    console.error("Doctor login error:", error);
    res.status(500).json({ 
      success: false,
      message: "An error occurred during login. Please try again later." 
    });
  }
};

// const loginDoctor = async(req, res) => {
//   const { email, password } = req.body;

//   try {
//     const foundDoctorFromEmail = await doctorModel.findOne({email}).populate("roleId");
    
//     if (!foundDoctorFromEmail) {
//       return res.status(404).json({ message: "Email not found" });
//     }

//     const isMatch = bcrypt.compareSync(password, foundDoctorFromEmail.password);
    
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (foundDoctorFromEmail.verificationStatus === 'pending') {
//       return res.status(403).json({ 
//         message: "Your account is pending admin approval" 
//       });
//     }

//     if (foundDoctorFromEmail.verificationStatus === 'rejected') {
//       return res.status(403).json({ 
//         message: "Your account has been rejected. Please contact admin." 
//       });
//     }

//     res.status(200).json({
//       message: "Login success",
//       data: foundDoctorFromEmail,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



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

      
      req.body.profilePic = cloundinaryResponse.secure_url
      const savedUser = await doctorModel.create(req.body);

      res.status(200).json({
        message: "Doctor saved successfully",
        data: savedUser
      });
    }
  });
};


const getDoctorByIdandUpdate = async (req, res) => {
  //update tablename set  ? where id = ?
  //update new data -->req.body
  //id -->req.params.id

  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Doctor Profile updated successfully",
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while update Doctor Profile",
      err: err,
    });
  }
};

const getAllDoctorByUserId = async (req, res) => {
  try {
    const doctorsid = await doctorModel
      .find({ doctorId: req.params.doctorId })
      .populate("doctorId");
    if (doctorsid.length === 0) {
      res.status(404).json({ message: "No Doctor found" });
    } else {
      res.status(200).json({
        message: " Doctor found successfully",
        data: doctorsid,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDoctorPhoto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        req.params.id,
        { profilePic: cloudinaryResponse.secure_url },
        { new: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.status(200).json({
        message: "Doctor photo updated successfully",
        data: updatedDoctor,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating doctor photo", error: error.message });
    }
  });
};

const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await doctorModel.distinct("specialization");
    res.status(200).json({ message: "Specializations fetched successfully", data: specializations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await doctorModel.find({ specialization });
    
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ 
        message: "No doctors found for this specialization" 
      });
    }

    res.status(200).json({ 
      message: "Doctors fetched successfully", 
      data: doctors 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching doctors", 
      error: err.message 
    });
  }
};

exports.createDoctorInsight = async (req, res) => {
  try {
      const { userId, title, message, alertType } = req.body;
      
      const newInsight = await HealthInsight.create({
          userId,
          doctorId: req.doctor._id, // From doctor auth
          title,
          message,
          alertType: alertType || 'Health Tip'
      });

      res.status(201).json({
          success: true,
          message: "Health insight created successfully",
          data: newInsight
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error creating health insight",
          error: err.message
      });
  }
};

// Add to getDoctorById to include insights
// const getDoctorById = async(req,res)=>{
//   try {
//       const doctor = await doctorModel.findById(req.params.id)
//           .populate({
//               path: 'insights',
//               options: { limit: 5, sort: { createdAt: -1 } }
//   });
      
//       if (!doctor) {
//           res.status(404).json({ message: "No Doctor found" });
//       } else {
//           res.status(200).json({
//               message: "Doctor found successfully",
//               data: doctor,
//           });
//       }
//   } catch (err) {
//       res.status(500).json({ message: err.message });
//   }
// }
// Add these new methods to your existing DoctorController.js

// Get all insights created by this doctor
const getDoctorInsights = async (req, res) => {
  try {
      const insights = await HealthInsight.find({ doctorId: req.params.doctorId })
          .populate('user', 'Firstname Lastname email')
          .sort({ createdAt: -1 });

      res.status(200).json({
          success: true,
          count: insights.length,
          data: insights
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error fetching doctor insights",
          error: err.message
      });
  }
};

// Create health insight for a patient
const createPatientInsight = async (req, res) => {
  try {
      const { userId, alertType, title, message, priority } = req.body;
      
      const newInsight = await HealthInsight.create({
          userId,
          doctorId: req.params.doctorId,
          alertType,
          title,
          message,
          priority: priority || 'Medium'
      });

      res.status(201).json({
          success: true,
          message: "Health insight created successfully",
          data: newInsight
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error creating health insight",
          error: err.message
      });
  }
};



module.exports = {
    getAlldoctor,addDoctor,deleteDoctor,signup,loginDoctor,addUserWithFile,getDoctorByIdandUpdate,getAllDoctorByUserId,updateDoctorPhoto,getAllSpecializations,getDoctorsBySpecialization,
    getDoctorById,
    getDoctorInsights,
    createPatientInsight,

  }