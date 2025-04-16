import React from 'react'
import "../../assets/login.css"
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ForgetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
      console.log("errors", errors)

   
  const submitHandler = async (data) => {
        const res = await axios.post("/user/forgotpassword",data)
        console.log(res)
  }

  const validationSchema ={

    emailvalidator:{
      required:{
          value:true,
          message:"email required"
      }
    }
}
  return (
    <>
      <div className="custom-login-container">
        <div className="custom-login-card">
          <h2 className="custom-login-title">Forget Password</h2>
          
          <form onSubmit={handleSubmit(submitHandler)} className="custom-login-form">

            <div className="custom-form-group">
              <label htmlFor="email" className="custom-label">
                Email Address
              </label>
              <input type="email"
                className="custom-input"
                placeholder="Enter your email" {...register("email",validationSchema.emailvalidator)}>
              </input>
              <span style={{color:"red"}}>
              {
                errors.email?.message
              }
              </span>
            </div>
            
            <button type="submit" className="custom-login-button">
              Submit
            </button>
           <p className="custom-login-link">
                   <Link to="/login">Login here</Link>
                 </p>
          </form>

        </div>
      </div>
    </>
  )
}