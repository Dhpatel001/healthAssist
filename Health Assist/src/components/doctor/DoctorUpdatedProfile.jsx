import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify'

export const DoctorUpdatedProfile = () => {
    const id = useParams().id;

    useEffect(() => { 
      // getAllStates();
    }, []);      

    const { register, handleSubmit } = useForm({
      defaultValues:async()=>{
          const res = await axios.get("/doctorbyid/"+id);
          if (res.data.data.verificationStatus !== 'verified') {
            toast.error("Your account is not verified. Please wait for admin approval.");
            return;
          }
          return res.data.data;
      } 
  });

    // console.log("errors", errors)
      const Navigate = useNavigate()
  
    const submitHandler = async (data) => {

      
      // data.userId = localStorage.getItem("id");
      // console.log(data);
      // delete data._id; 
      // console.log(data);
      // const res = await axios.put("/updatedoctorphoto/"+id, data);     
      // };
      try{
        // const userId = localStorage.getItem("id")
        // data.userId = userId;
        // console.log(data);
        // console.log(data.image[0]);
  
    
        // const res = await axios.post("/adddoctor", data)
        // const res = await axios.post("/adddocpic", formData)
        // const res = await axios.put("/updatedoctorphoto/"+id, formData); 
        // console.log(res) 
        // console.log(res.data)

        data.userId = localStorage.getItem("id");
      console.log(data); 
      delete data._id; 
      console.log(data);
      const res = await axios.put("/updateddoctor/"+id, data);   
    
        if (res.status === 200) {
          //user added..
          //naviget
          toast.success('🦄 Form submitted Successfully!', {
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
            // localStorage.setItem("role",res.data.data.roleId.name)
    
            // setTimeout(() => {
            //   navigate("/doctorinfo")
            // }, 1500);
                      Navigate("/doctor/doctordetail")
    
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


  return (
    <>
    <div className="container mt-4">
    <div className="card card-primary">
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
      <div className="card-header">
        <h3 className="card-title">Doctor Updated Profile</h3>

      </div>
      <div className="card-body">

        <form onSubmit={handleSubmit(submitHandler)}>


          <div className="row">
            <div className="col-sm-6">
              {/* select */}
              <div className="form-group">
                <label >Doctor First Name</label>
                <input
                  type="text"

                  className="form-control"

                  {...register("Firstname")}
                />
                
              </div>
            </div>


            <div className="col-sm-6">
              {/* select */}
              <div className="form-group">
                <label htmlFor="inputName">Doctor Last Name</label>
                <input
                  type="text"

                  className="form-control"

                  {...register("Lastname")}
                />
                
              </div>
            </div>
          </div>




          <div className="form-group">
            <label htmlFor="inputClientCompany">Qualification</label>
            <input
              type="text"

              className="form-control"

              {...register("qualification")}
            />
            
          </div>
          <div className="form-group">
            <label >Specialties</label>
            <input
              type="text"

              className="form-control"

              {...register("specialization")}
            />
            
          </div>
          <div className="form-group">
            <label >Experience</label>
            <input
              type="text"

              className="form-control"

              {...register("experience")}
            />
            
          </div>

          <div className="row">
          <div className="col-sm-6">
            {/* select */}
            <div className="form-group">
              <label>availability</label>
              <select className="form-control" {...register("availability")}>
                <option>morning</option>
                <option>afternoon</option>
                <option>evening</option>
                <option>night</option>
                <option>fulltime</option>
              </select>
            </div>
            </div>
            
            {/* <div className="col-sm-6">
            select
            <div className="form-group">
              <label>Select</label>
              <select className="form-control">
                <option>option 1</option>
                <option>option 2</option>
                <option>option 3</option>
                <option>option 4</option>
                <option>option 5</option>
              </select>
            </div>
            </div> */}
          </div>



          <div className="form-group">
            <label >About</label>
            <textarea

              className="form-control"
              rows={4}

              {...register("about")}
            />
            
          </div>
          {/* <div className="form-group">
            <label for="customFile">Custom File</label>
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="customFile" {...register("image")} />
              <label className="custom-file-label" htmlFor="customFile">
                Choose file
              </label>
            </div>
          </div> */}

<div className="text-center mt-3">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
        </form>
      </div>
      {/* /.card-body */}
    </div>
    </div>
  </>
  )
}
