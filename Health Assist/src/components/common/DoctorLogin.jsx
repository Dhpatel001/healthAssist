import React from 'react'
import "../../assets/login.css"
import { Link,  useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export const DoctorLogin = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/doctorlogin", data);
      
      if (res.status === 200) {
        // Login successful
        const toastMessage = res.data.isPending 
          ? '🦄 Login Successful! Your account is pending approval (limited access)' 
          : '🦄 Login Successfully!';
        
        toast.success(toastMessage, {
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
        
        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);
        localStorage.setItem("verificationStatus", res.data.data.verificationStatus);
        
        setTimeout(() => {
          if(res.data.data.roleId.name === "DOCTOR") {
            // Redirect pending doctors to a different page if needed
            if (res.data.isPending) {
              navigate("/doctor/pending-approval");
            } else {
              navigate("/doctor/doctordetail");
            }
          }
        }, 1500);
      }
    } catch (error) {
      // Handle different error responses from backend
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 403) {
          // Account rejected
          if (data.message.includes("rejected")) {
            toast.warning('Your account has been rejected. Please contact admin for assistance.', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else if (status === 404) {
          // Email not found
          toast.error('Email not found. Please check your email or sign up.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else if (status === 401) {
          // Invalid credentials
          toast.error('Invalid email or password', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        // Network or other errors
        toast.error('An error occurred. Please try again later.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const validationSchema = {
    emailvalidator: {
      required: {
        value: true,
        message: "Email required"
      }
    },
    passwordvalidator: {
      required: {
        value: true,
        message: "Password required"
      }
    }
  }

  return (
    <>
      <div className="custom-login-container">
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
          <h2 className="custom-login-title">Welcome Back Doctor!</h2>
          <p className="custom-login-subtitle">Please log in to continue</p>
          <form onSubmit={handleSubmit(submitHandler)} className="custom-login-form">
            <div className="custom-form-group">
              <label htmlFor="email" className="custom-label">
                Email Address
              </label>
              <input 
                type="email"
                className="custom-input"
                placeholder="Enter your email" 
                {...register("email", validationSchema.emailvalidator)}
              />
              <span style={{color:"red"}}>
                {errors.email?.message}
              </span>
            </div>
            <div className="custom-form-group">
              <label htmlFor="password" className="custom-label">
                Password
              </label>
              <input
                type="password"
                className="custom-input"
                placeholder="Enter your password"
                {...register("password", validationSchema.passwordvalidator)}
              />
              <span style={{color:"red"}}>
                {errors.password?.message}
              </span>
            </div>
            <button type="submit" className="custom-login-button">
              Login
            </button>
            <p className="custom-forgot-password">
              <a href="#">Forgot Password?</a>
            </p>
            <p className="custom-signup-link">
              Don't have an account? <Link to="/doctorsignup">Sign up here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}