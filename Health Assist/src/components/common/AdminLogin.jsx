import React from 'react'
import "../../assets/login.css"
import { Link,  useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import axios from 'axios';





export const AdminLogin = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  console.log("errors", errors)
  const navigate = useNavigate();
  const submitHandler = async (data) => {
  try{
    const res = await axios.post("/admin/login", data)
    console.log(res) //axiosobjec
    console.log(res.data) //api response...
    //tost..
    //"100" == 100 -->true
    //"100" === 100 -->false
    if (res.status === 200) {
      //user added..
      //naviget
      toast.success('🦄 Login Successfully!', {
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
        
        localStorage.setItem("id",res.data.data._id)
        localStorage.setItem("role",res.data.data.roleId.name)
        setTimeout(()=>{
          if(res.data.data.roleId.name==="ADMIN"){
            navigate("/admin") 
          }
        },1500);
    }
      }
        catch (error) {
                    toast.error("Invalid email or password", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            };
  const validationSchema ={

    emailvalidator:{
      required:{
          value:true,
          message:"emial required"
      }
    },passwordvalidator:{
      required:{
          value:true,
          message:"password required"
      }
    }

  }

  return (
    <>
      <div className="custom-login-container">
      <ToastContainer
                position="top-right"
                autoClose={1500}
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
          <h2 className="custom-login-title">Welcome Back Admin!</h2>
          <p className="custom-login-subtitle">Please log in to continue</p>
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
            <div className="custom-form-group">
              <label htmlFor="password" className="custom-label">
                Password
              </label>
              <input
                type="password"
                className="custom-input"
                placeholder="Enter your password"
                {...register("password",validationSchema.passwordvalidator)}
              />
              <span style={{color:"red"}}>
              {
                errors.password?.message
              }
            </span>
            </div>
            <button type="submit" className="custom-login-button">
              Login
            </button>
            <p className="custom-forgot-password">
              <a href="#">Forgot Password?</a>
            </p>
            <p className="custom-signup-link">
              Don't have an account? <Link to="/adminsignup ">Sign up here</Link>
            </p>
          </form>

        </div>
      </div>
    </>

  )
}
