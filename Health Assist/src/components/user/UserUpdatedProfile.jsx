import { Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify'

export const UserUpdatedProfile = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const userId = localStorage.getItem("id");

    useEffect(() => {
      // getAllStates();
    }, []);

    console.log("User ID from localStorage:", userId);
    
    if (!userId) {
      console.error("User ID not found in localStorage!");
      return;
    }
    
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const res = await axios.get(`/userbyid/${userId}`);
          if (res.data && res.data.data) {
            const userData = res.data.data;
            Object.keys(userData).forEach((key) => {
              setValue(key, userData[key]); // Set default values
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      if (userId) fetchUserData();
    }, [userId, setValue]);

    const submitHandler = async (data) => {
      try {
          if (!userId) {
              toast.error("User ID not found. Please log in again.");
              return;
          }
  
          data.userId = userId;
          delete data._id;
  
          console.log("Sending data:", data);
  
          const res = await axios.put(`/updateduser/${userId}`, data); 
          console.log("Response from server:", res);
  
          if (res.status === 200) {
              toast.success('🦄 Profile updated successfully!', {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "dark",
                  transition: Bounce,
              });
              navigate("/user/profile");
          }
      } catch (error) {
          console.error("Error updating user:", error);
          toast.error("Failed to update profile. Please try again.");
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
        <h3 className="card-title">Update Profile</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("Firstname")}
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("Lastname")}
                />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register("email")}
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("PhoneNumber")}
                />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("Age")}
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label>Date of Birth (Timestamp)</label>
                <input
                  type="date"
                  className="form-control"
                  {...register("dateOfBirth")}
                />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  {...register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  {...register("Status")}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-12">
              <div className="form-group">
                <label>Medical History (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("mediacalHistory")}
                  placeholder="Enter conditions separated by commas"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <Button type="submit" variant="contained" color="primary">
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </>
  )
}