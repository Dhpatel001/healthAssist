import React from "react";
import { Box, Grid, Typography, Link, List, ListItem, ListItemText } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1e293b", // Dark blue-gray background
        color: "#ffffff", // White text
        padding: "2rem",
        marginTop: "2rem",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={4}>
        {/* About Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Health Assist
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1d5db" }}>
            Your digital partner for healthcare solutions. From doctor discovery to telemedicine, we assist you in staying healthy and connected.
          </Typography>
        </Grid>

        {/* Features Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Features
          </Typography>
          <List sx={{ padding: 0 }}>
            <ListItem disableGutters>
              <ListItemText
                primary="Instant Video Consultation"
                primaryTypographyProps={{ color: "#d1d5db" }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Find Doctors Near You"
                primaryTypographyProps={{ color: "#d1d5db" }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Electronic Health Records (EHR)"
                primaryTypographyProps={{ color: "#d1d5db" }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Telemedicine Services"
                primaryTypographyProps={{ color: "#d1d5db" }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Health Insights and Analytics"
                primaryTypographyProps={{ color: "#d1d5db" }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Admin Dashboard"
                primaryTypographyProps={{ color: "#d1d5db" }}
              />
            </ListItem>
          </List>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Contact Us
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1d5db" }}>
            Email: <Link href="mailto:support@healthassist.com" color="inherit">support@healthassist.com</Link>
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1d5db" }}>
            Phone: +1 123-456-7890
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1d5db" }}>
            Address: 123 Health Street, Wellness City, USA
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
