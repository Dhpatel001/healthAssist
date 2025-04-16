import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Container,
  Paper,
  Avatar,
  Divider
} from "@mui/material";
import Navbar from "./Navbar";

const AppointmentByDoctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  // State Variables
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Get userId from localStorage
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!doctorId) {
      console.error("Doctor ID is undefined!");
      setLoading(false);
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const doctorResponse = await axios.get(`/doctorbyid/${doctorId}`);
        setDoctor(doctorResponse.data.data || doctorResponse.data);

        const appointmentsResponse = await axios.get(`/appointment/appointments/doctor/${doctorId}`);
        setAppointments(appointmentsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError("Failed to load doctor data.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  const fetchUserDetails = async () => {
    if (!userId) {
      alert("Please log in to book an appointment.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`/userbyid/${userId}`);
      const userDetails = response.data.data || response.data;
      setUserData(userDetails);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to fetch user details.");
    }
  };

  const handleBookAppointment = async () => {
    if (!appointmentDate) {
      alert("Please select an appointment date and time.");
      return;
    }

    if (!userData) {
      alert("User details not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("/appointment/appointment", {
        doctorId,
        userId,
        firstName: userData.Firstname,
        lastName: userData.Lastname,
        phoneNumber: userData.PhoneNumber,
        appointmentDate,
        status: "Pending",
      });

      alert("Appointment booked successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" ,width:"100vw"}}>
      <Navbar />
      
      {/* Doctor Profile Header */}
      <Box sx={{ 
        backgroundColor: "#1976d2",
        color: "white",
        py: 4,
        mb: 4
      }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} sm={3} md={2}>
              <Avatar
                src={doctor?.profilePic || "/default-doctor.png"}
                alt={`Dr. ${doctor?.Firstname} ${doctor?.Lastname}`}
                sx={{ 
                  width: 140, 
                  height: 140, 
                  border: "4px solid white",
                  boxShadow: 3
                }}
              />
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                Dr. {doctor?.Firstname} {doctor?.Lastname}
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {doctor?.specialization || "General Practitioner"}
              </Typography>
              <Chip 
                label={doctor?.availability ? "Available" : "Not Available"} 
                color={doctor?.availability ? "success" : "error"} 
                sx={{ color: "white", fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Doctor Details Column */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                About Dr. {doctor?.Firstname}
              </Typography>
              <Typography paragraph>
                {doctor?.about || "No details available about this doctor."}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Professional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Experience:</strong></Typography>
                  <Typography>{doctor?.experience || "N/A"} years</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Language:</strong></Typography>
                  <Typography>English, Spanish</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Appointment Column */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Book an Appointment
              </Typography>
              
              {/* Appointment Stats */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ 
                    p: 2, 
                    backgroundColor: "#1976d2", 
                    color: "white",
                    textAlign: "center",
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h4">{appointments.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ 
                    p: 2, 
                    backgroundColor: "#ff9800", 
                    color: "white",
                    textAlign: "center",
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">Pending</Typography>
                    <Typography variant="h4">
                      {appointments.filter(a => a.status === "Pending").length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ 
                    p: 2, 
                    backgroundColor: "#4caf50", 
                    color: "white",
                    textAlign: "center",
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">Completed</Typography>
                    <Typography variant="h4">
                      {appointments.filter(a => a.status === "Completed").length}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Date Picker */}
              <TextField
                label="Select Date & Time"
                type="datetime-local"
                fullWidth
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={fetchUserDetails}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                Book Appointment Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Your Appointment</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Doctor:</Typography>
              <Typography>Dr. {doctor?.Firstname} {doctor?.Lastname}</Typography>
              <Typography color="text.secondary">{doctor?.specialization}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Patient:</Typography>
              <Typography>{userData?.Firstname} {userData?.Lastname}</Typography>
              <Typography color="text.secondary">{userData?.PhoneNumber}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Appointment Time:</Typography>
              <Typography>{new Date(appointmentDate).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookAppointment} 
            variant="contained" 
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentByDoctor;