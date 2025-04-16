import React, { useState, useEffect } from "react";
import "../../assets/home/ContactUs.css";
import Navbar from "./homePage/Navbar";
import Footer from "./homePage/Footer";
import CopyRight from "./homePage/CopyRight";
import { Box, Grid, Typography, Snackbar, Alert } from "@mui/material";
import { AccessTime, LocationOn, Phone } from "@mui/icons-material";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const userString = localStorage.getItem("id");
      const userRole = localStorage.getItem("role");

      if (userString && userRole) {
        setIsLoggedIn(true);
        setRole(userRole);
        setLoading(true);

        try {
          let apiUrl, response;
          if (userRole === "USER") {
            apiUrl = `/userbyid/${userString}`;
            response = await axios.get(apiUrl);
          } else if (userRole === "DOCTOR") {
            apiUrl = `/doctorbyid/${userString}`;
            response = await axios.get(apiUrl);
          }

          setUserData(response.data);
          setFormData(prev => ({
            ...prev,
            name: `${response.data.data.Firstname || ''} ${response.data.data.Lastname || ''}`.trim(),
            email: response.data.data.email || ''
          }));
        } catch (error) {
          console.error("Data fetch failed:", error);
          setSnackbar({
            open: true,
            message: "Failed to load user data",
            severity: "error"
          });
        } finally {
          setLoading(false);
        }
      } else {
        setIsLoggedIn(false);
        setRole(null);
        setUserData(null);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isLoggedIn) {
    setSnackbar({
      open: true,
      message: "Please login to submit the form",
      severity: "error"
    });
    return;
  }

  try {
    // Prepare submission data with only necessary fields
    const submissionData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      [role === "USER" ? "userId" : "doctorId"]: localStorage.getItem("id")
    };

    const response = await axios.post("/contact/submit", submissionData);
    
    setSnackbar({
      open: true,
      message: "Message sent successfully!",
      severity: "success"
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  } catch (error) {
    setSnackbar({
      open: true,
      message: error.response?.data?.message || "Failed to send message",
      severity: "error"
    });
  }
};
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div style={{ width: "99vw" }}>
      <section className="contactus-container">
        <Navbar></Navbar>
        {/* Hero Section */}
        <div className="contactus-hero" style={{ textAlign: "center" }}>
          <h1 className="contactus-title">Contact Us</h1>
          <p className="breadcrumb" style={{ color: "black" }}>HOME / PAGES / CONTACT</p>
        </div>

        {/* Info Cards */}
        <div className="contactus-info" style={{ justifyContent: "center" }}>
          <div className="info-card fade-in" style={{ textAlign: "center" }}>
            <i className="fas fa-map-marker-alt"></i>
            <h3>Address</h3>
            <p>123 Street, New York, USA</p>
          </div>
          <div className="info-card fade-in delay-1" style={{ textAlign: "center" }}>
            <i className="fas fa-phone-alt"></i>
            <h3>Call Us Now</h3>
            <p>+012 345 6789</p>
          </div>
          <div className="info-card fade-in delay-2" style={{ textAlign: "center" }}>
            <i className="fas fa-envelope"></i>
            <h3>Mail Us Now</h3>
            <p>info@example.com</p>
          </div>
        </div>

        {/* Contact Form & Map Section */}
        <div className="contactus-content">
          <div className="contact-form slide-in-left">
            <button className="tag-button">Contact Us</button>
            <h2>Have Any Query? Please Contact Us!</h2>
            {loading ? (
              <p>Loading user data...</p>
            ) : !isLoggedIn ? (
              <p style={{ color: "#ff6b6b", fontWeight: "bold" }}>
                Please login to submit the form. If you don't have an account, register first.
              </p>
            ) : null}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!isLoggedIn || loading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!isLoggedIn || loading}
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={!isLoggedIn || loading}
              />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={!isLoggedIn || loading}
              ></textarea>
              <button
                type="submit"
                className="send-message"
                disabled={!isLoggedIn || loading}
                style={{
                  backgroundColor: !isLoggedIn ? "#cccccc" : "",
                  cursor: (!isLoggedIn || loading) ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Processing..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Google Map */}
          <div className="map-container slide-in-right">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799147059!2d-74.25986694912435!3d40.69767006301343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20USA!5e0!3m2!1sen!2s!4v1644857631606!5m2!1sen!2s"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <section>
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }} style={{ marginTop: "-30px" }}>
          {/* Phone Section */}
          <Grid item xs={12} md={4}>
            <Box className="small-box bg-primary text-center p-4 rounded-lg shadow">
              <Phone sx={{ fontSize: 40, color: "white" }} />
              <Typography variant="h6" color="white" fontWeight="bold" mt={1}>
                +(000) 1234 56789
              </Typography>
              <Typography variant="body2" color="white">
                info@company.com
              </Typography>
            </Box>
          </Grid>

          {/* Address Section */}
          <Grid item xs={12} md={4}>
            <Box className="small-box bg-primary text-center p-4 rounded-lg shadow">
              <LocationOn sx={{ fontSize: 40, color: "white" }} />
              <Typography variant="h6" color="white" fontWeight="bold" mt={1}>
                2 Fire Brigade Road
              </Typography>
              <Typography variant="body2" color="white">
                Chittagong, Lakshmipur
              </Typography>
            </Box>
          </Grid>

          {/* Timing Section */}
          <Grid item xs={12} md={4}>
            <Box className="small-box bg-primary text-center p-4 rounded-lg shadow">
              <AccessTime sx={{ fontSize: 40, color: "white" }} />
              <Typography variant="h6" color="white" fontWeight="bold" mt={1}>
                Mon - Sat: 8am - 5pm
              </Typography>
              <Typography variant="body2" color="white">
                Sunday Closed
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </section>

      <Footer></Footer>
      <CopyRight></CopyRight>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ContactUs;
