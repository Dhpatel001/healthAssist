import "../../assets/signup.css"
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

export const DoctorSignup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  console.log("errors", errors)
  const navigate = useNavigate();


  const submitHandler = async (data) => {
    //console.log(data)
    //const res = await axios.post("http://localhost:3000/user")

    //before sending data.. role bind
    data.roleId = "67c5ac9939278f26668be180"
    const res = await axios.post("/doctor", data)
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
      setTimeout(() => {
        navigate("/doctorlogin")
      }, 1500);
    }
    else {
      //user not added..
      //login..
    }
  };
  const validationSchema = {

    fnamevalidator: {
      required: {
        value: true,
        message: "First name required"
      }
    },
    numbervalidator: {
      required: {
        value: true,
        message: "Enter the Valid number"
      },
      minLength: {
        value: 9,
        message: "Min value 9"
      },
      pattern: {
        value: /[6-9]{1}[0-9]{9}/,
        message: "Phone number is not valid"
      }

    },
    lnamevalidator: {
      required: {
        value: true,
        message: "Last name required"
      }
    },
    agevalidator: {
      required: {
        value: true,
        message: "age required"
      }
    }, emailvalidator: {
      required: {
        value: true,
        message: "emial required"
      }
    }, passwordvalidator: {
      required: {
        value: true,
        message: "password required"
      },
      pattern: {
        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        message: "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
      }
    }


  }
  return (
    <div className="body-main-css">
      <div className="custom-signup-wrapper">
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
        <div className="custom-signup-card">
          <h2 className="custom-signup-title">Create Your Account</h2>
          <form onSubmit={handleSubmit(submitHandler)} className="custom-signup-form">
            <div className="custom-input-group">
              <label className="custom-input-label">Name</label>
              <input className="custom-input" type="text" {...register("name", validationSchema.fnamevalidator)}></input>
              <span style={{ color: "red" }}>
                {
                  errors.name?.message
                }
              </span>
            </div>
            {/* <div className="custom-input-group">
            <label className="custom-input-label">LastName</label>
            <input className="custom-input" type="text" {...register("Lastname",validationSchema.lnamevalidator)}></input>
            <span style={{color:"red"}}>
              {
                errors.Lastname?.message
              }
            </span>
          </div> */}
            {/* <div className="custom-input-group">
            <label className="custom-input-label">Age</label>
            <input  className="custom-input" type="number" {...register("Age",validationSchema.agevalidator)}>
            </input>
            <span style={{color:"red"}}>
              {
                errors.Age?.message
              }
            </span>
          </div> */}

            <div className="custom-input-group">
              <label className="custom-input-label">Mobile Number</label>
              <input className="custom-input" type='contect'  {...register("phoneNumber", validationSchema.numbervalidator)}></input>
              <span style={{ color: "red" }}>
                {errors.phoneNumber?.message}
              </span>
            </div>
            <div className="custom-input-group">
              <label className="custom-input-label">email</label>
              <input className="custom-input" type="text" {...register("email", validationSchema.emailvalidator)}></input>
              <span style={{ color: "red" }}>
                {
                  errors.email?.message
                }
              </span>
            </div>
            <div className="custom-input-group">
              <label className="custom-input-label">Password</label>
              <input className="custom-input" type="password" {...register("password", validationSchema.passwordvalidator)}></input>
              <span style={{ color: "red" }}>
                {
                  errors.password?.message
                }
              </span>
            </div>

            <button type="submit" className="custom-submit-button">
              Sign Up
            </button>
            <p className="custom-login-link">
              Already have an account? <Link to="/doctorlogin">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};