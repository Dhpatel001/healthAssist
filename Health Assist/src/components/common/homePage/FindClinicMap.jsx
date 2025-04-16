import React from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
// import "admin-lte/dist/css/adminlte.min.css"; // AdminLTE styling
import "../../../assets/home/FindClinicMap.css";


const FindClinicMap = () => {
  return (
    <Box className="find-clinic-map-section">
      {/* Section Header */}
      <Box className="header" style={{textAlign:"center"}}>
        <Typography variant="h4" className="title">
          Find Clinics on Map
        </Typography>
        <Typography variant="body1" className="subtitle">
          Locate nearby clinics and healthcare facilities easily.
        </Typography>
      </Box>

      {/* Search and Map Section */}
      <Grid container spacing={4} className="content-grid" style={{alignItems:"center"}}>
        {/* Search Input */}
        <Grid item xs={12} md={4}>
          <Box className="search-box">
            <Typography variant="h6" className="search-title">
              Search Clinics
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Enter location or clinic name"
              fullWidth
              className="search-input"
            />
            <Button variant="contained" className="search-btn">
              Search
            </Button>
          </Box>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={8}>
          <Box className="map-container">
            <iframe
              title="clinic-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.6430133879235!2d100.492065315332!3d13.724600901689515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29932e432d9e7%3A0x4749dc21d7f27ba9!2sBangkok!5e0!3m2!1sen!2sth!4v1649097261568!5m2!1sen!2sth"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FindClinicMap;
