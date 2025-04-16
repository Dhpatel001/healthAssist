import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Avatar, Button, Tooltip } from "@mui/material";
import "../../../public/css/adminlte.min.css";
import HospitalBanner from '../../assets/images/hospital.jpg';
import DoctorPro from '../../assets/images/defaultDoctor.jpg';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const DoctorDetail = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [doctor, setDoctor] = useState({});
  const fileInputRef = useRef(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [completedAppointments, setcompletedAppointments] = useState(0)
  // Add this near the top of your component
const [verificationStatus, setVerificationStatus] = useState('');

  // Fetch doctor details
  // useEffect(() => {
  //   if (!userId) {
  //     console.error("No User ID found in localStorage");
  //     return;
  //   }

  //   axios.get(`/doctorbyid/${userId}`)
  //     .then(res => setDoctor(res.data.data))
  //     .catch(error => {
  //       console.error("Error fetching doctor details:", error);
  //       setDoctor({});
  //     });
  // }, [userId]);


  useEffect(() => {
    if (!userId) {
      console.error("No User ID found in localStorage");
      return;
    }
  
    axios.get(`/doctorbyid/${userId}`)
      .then(res => {
        setDoctor(res.data.data);
        setVerificationStatus(res.data.data.verificationStatus);
      })
      .catch(error => {
        console.error("Error fetching doctor details:", error);
        setDoctor({});
      });
  }, [userId]);
  // Fetch total and pending appointments
  useEffect(() => {
    axios.get(`/appointment/appointments/doctor/${userId}`)
      .then(res => {
        const appointments = res.data.data;
        setTotalAppointments(appointments.length);
        setPendingAppointments(appointments.filter(appointment => appointment.status === "Pending").length);
        setcompletedAppointments(appointments.filter(appointment => appointment.status === "Completed").length);
      })
      .catch(error => console.error("Error fetching appointments:", error));
  }, [userId]);

  const handleUpdateClick = () => navigate(`/doctor/updateprofile/${userId}`);
  const handleUpdateClickPic = () => fileInputRef.current && fileInputRef.current.click();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    try {
      const res = await axios.put(`/updatedoctorphoto/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        console.log("Profile picture updated successfully.", res.data);
        setDoctor((prev) => ({ ...prev, profilePic: res.data.data.profilePic }));
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };
  const handleappointments  = () => {
    navigate(`/doctor/pendingappointment`); // Change this to your actual update profile route
    // Navigate(`/user/userform/${userId}`); // Change this to your actual update profile route
  };

  return (
    <div className="container mt-4">


{verificationStatus === 'pending' && (
  <div className="alert alert-warning mt-3">
    Your account is pending admin approval. You'll have full access once approved.
  </div>
)}

{verificationStatus === 'rejected' && (
  <div className="alert alert-danger mt-3">
    Your account has been rejected. Please contact admin for more information.
  </div>
)}

      {/* Hospital Banner */}
      <CardMedia component="img" height="200" image={HospitalBanner} alt="Hospital Banner" />
     

      {/* Doctor Info Card */}
      <Card className="mt-3 p-3 shadow-sm">
        <Grid container spacing={3} alignItems="center">
          <Grid item md={3} sm={12} className="text-center">
            <Tooltip title="Update Profile Picture" placement="top">
              <Avatar
                src={doctor.profilePic || DoctorPro}
                sx={{ width: 120, height: 120 }}
                onClick={handleUpdateClickPic}
              />
            </Tooltip>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Grid>
          <Grid item md={6} sm={12}>
            <Typography variant="h4" className="font-weight-bold">
              {doctor.Firstname} {doctor.Lastname}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {doctor.specialization || "N/A"}
            </Typography>
            <Typography variant="body1" color="textSecondary">Location: New York, NY</Typography>
            <Typography variant="body2" color="textSecondary">
              Experience: {doctor.experience} years
            </Typography>
          </Grid>
          <Grid item md={3} sm={12} className="text-center">
            <Button variant="contained" color="primary" onClick={handleUpdateClick}>
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Appointment Metrics */}
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="info-box bg-info">
            <span className="info-box-icon"><i className="fas fa-calendar"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Total Appointments</span>
              <span className="info-box-number">{totalAppointments}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-box bg-warning">
            <span className="info-box-icon"><i className="fas fa-clock"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Pending Appointments</span>
              <span className="info-box-number" onClick={handleappointments}>{pendingAppointments}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-box bg-success">
            <span className="info-box-icon"><i className="fas fa-check-circle"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Completed Appointments</span>
              <span className="info-box-number">{completedAppointments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
