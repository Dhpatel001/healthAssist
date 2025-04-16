import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

export const ResetPassword = () => {
    const token = useParams().token
   const { register, handleSubmit, formState: { errors } } = useForm();
     console.log("errors", errors)
    const submitHandler = async(data)=>{
        //resetpasseord api..
        const obj = {
            token:token,
            password:data.password
        }
        const res = await axios.post("/user/resetpassword",obj)
        console.log(res.data)
            

    }
    const validationSchema ={

        passwordvalidator:{
          required:{
              value:true,
              message:"password required"
          }
        }
    
      }
  return (
    <>
        <div className="custom-login-container">
        <div className="custom-login-card">
          <h2 className="custom-login-title">Reset Password</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
        <div className="custom-form-group">
              <label htmlFor="password" className="custom-label">
               Enter the new Password
              </label>
              <input
                type="password"
                className="custom-input"
                placeholder="Enter your new password"
                {...register("password",validationSchema.passwordvalidator)}
              />
              <span style={{color:"red"}}>
              {
                errors.password?.message
              }
            </span>
            </div>
            <button type="submit" className="custom-login-button">
              Submit
            </button>
        </form>
    </div>
    </div>
    </>
  )
}