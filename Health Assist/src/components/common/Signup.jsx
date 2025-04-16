// import "../../assets/signup.css"
import "../../assets/login.css"

import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

export const Signup = () => {
  const { register, handleSubmit ,formState:{errors} } = useForm();
  console.log("errors",errors)
  const navigate = useNavigate();


  const submitHandler = async (data) => {
    //console.log(data)
    //const res = await axios.post("http://localhost:3000/user")

    //before sending data.. role bind
    data.roleId = "67c52aca47be6ea7ed296d28"
    const res = await axios.post("/user", data)
    console.log(res) //axiosobjec
    console.log(res.data) //api response... 
    //tost..
    //"100" == 100 -->true
    //"100" === 100 -->false
    if (res.status === 201) {
      //user added..
      //naviget
      toast.success('🦄 Sinup Successfully!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
        setTimeout(()=>{
          navigate("/login")
        },1500);
    }
    else {
      //user not added..
      //login..
    }
  };
  const validationSchema ={

    fnamevalidator:{
      required:{
          value:true,
          message:"First name required"
      }
  },
  lnamevalidator:{
    required:{
        value:true,
        message:"Last name required"
    }
},
numbervalidator:{
  required:{
      value:true,
      message:"Enter the Valid number"
  },
  minLength:{
          value:9,
          message:"Min value 9"
  },
  pattern:{
      value:/[6-9]{1}[0-9]{9}/,
      message:"Phone number is not valid"
  }

},
  // agevalidator:{
  //     required:{
  //         value:true,
  //         message:"age required"
  //     }
  //   },
emailvalidator:{
      required:{
          value:true,
          message:"emial required"
      }
    },
passwordvalidator:{
      required:{
          value:true,
          message:"password required"
      },
      pattern:{
        value:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        message:"Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
      }
    }


  }
  return (
    <div className="custom-login-container">
    {/* <div className="custom-signup-wrapper"> */}
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            /> 
      <div className="custom-login-card">
      <h2 className="custom-login-title">Create Your Account</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="custom-login-form">
          <div className="custom-form-group">
            <label className="custom-label">FirstName</label>
            <input  className="custom-input"type="text" {...register("Firstname",validationSchema.fnamevalidator)}></input>
            <span style={{color:"red"}}>
              {
                errors.Firstname?.message
              }
            </span>
          </div>
          <div className="custom-form-group">
            <label className="custom-label">LastName</label>
            <input className="custom-input" type="text" {...register("Lastname",validationSchema.lnamevalidator)}></input>
            <span style={{color:"red"}}>
              {
                errors.Lastname?.message
              }
            </span>
          </div>
          <div className="custom-input-group">
              <label className="custom-input-label">Mobile Number</label>
              <input className="custom-input" type='contect'  {...register("PhoneNumber")}></input>
              
            </div>  
          {/* <div className="custom-form-group">
            <label className="custom-label">Age</label>
            <input  className="custom-input" type="number" {...register("Age",validationSchema.agevalidator)}>
            </input>
            <span style={{color:"red"}}>
              {
                errors.Age?.message
              }
            </span>
          </div> */}
          {/* <div className="custom-form-group">
                <label>GENDER</label><br></br>
                 MALE : <input type="radio" value="Male" name="gender" {...register("gender")}></input>                  
                 FEMALE : <input type="radio" value="Female" name="gender" {...register("gender")}></input>
          </div> */}
          <div className="custom-form-group">
            <label className="custom-label">email</label>
            <input className="custom-input" type="text" {...register("email",validationSchema.emailvalidator)}></input>
            <span style={{color:"red"}}>
              {
                errors.email?.message
              }
            </span>
          </div>
          <div className="custom-form-group">
            <label className="custom-label">Password</label>
            <input  className="custom-input" type="password" {...register("password",validationSchema.passwordvalidator)}></input>
            <span style={{color:"red"}}>
              {
                errors.password?.message
              }
            </span>
          </div>
          
          <button type="submit" className="custom-login-button">
        Sign Up
      </button>
      <p className="custom-login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
        </form>
      </div>
    {/* </div> */}
    </div>
  );
};