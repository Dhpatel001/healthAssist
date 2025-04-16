const adminModel = require("../models/AdminModel");
const bcrypt = require("bcrypt");
const AppointmentModel = require("../models/AppointmentModel");
const AdminModel = require("../models/AdminModel");
const DoctorModel = require("../models/DoctorModel");
const UserModel = require("../models/UserModel");


const loginAdmin = async(req,res)=>{

    const email =req.body.email;
    const password= req.body.password;

    // const foundUserFromEmail=adminModel.findOne({email:req.body.email})
    const foundAdminFromEmail= await adminModel.findOne({email:email}).populate("roleId");
    console.log(foundAdminFromEmail);
    if (foundAdminFromEmail != null) {
      
    const isMatch = bcrypt.compareSync(password, foundAdminFromEmail.password);
      
      if (isMatch == true) {
        res.status(200).json({
          message: "login success",
          data: foundAdminFromEmail,
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
    const createdAdmin = await adminModel.create(req.body);
    res.status(201).json({
      message: "user created..",
      data: createdAdmin,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "error",
      data: err,
    });
  }
};



const getAlladmin = async (req, res) => {
try{
  const users = await adminModel.find().populate("roleId") //[{}]

  res.json({
    message: "role fetched successfully",
    data:admins
  });
}catch(err){
  res.status(500).json({message:err})
}

};

const addAdmin = async (req, res) => {
try{
  const saveAdmin = await adminModel.create(req.body)
  res.json({
    message: "user created..",
    data: saveAdmin
  });
}catch(err){
  res.status(500).json({message:err});
}

}

const deleteAdmin = async (req, res) => {
try{
  const deletedAdmin = await addAdmin.findByIdAndDelete(req.params.id)
  res.json({
    message: "admin deleted successfully",
    data: deletedAdmin
  });
}catch(err){
  res.status(500).json({message:err});
}
}

// const getAdminById = async (req, res) => {
//   try{
//   const FoundAdmin = await adminModel.findById(req.params.id)
//   res.json({
//     message: "role fetched",
//     data: FoundAdmin
//   });
// }catch(err){
//   res.status(500).json({message:err})
// }
// }


// In AdminController.js
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await UserModel.find();
//     res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await DoctorModel.find();
//     res.status(200).json({ success: true, data: doctors });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   const 
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate('userId')
      .populate('doctorId');
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await AdminModel.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// In AdminController.js
const getAdminById = async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users',
      error: error.message 
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find().select('-password');
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching doctors',
      error: error.message 
    });
  }
};
module.exports = {
    getAlladmin,addAdmin,deleteAdmin,signup,loginAdmin,getAllAppointments,getAllDoctors,getAllUsers,changePassword,getAdminById
  }