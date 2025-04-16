import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  useTheme
} from "@mui/material";
import {
  Favorite as CardiologyIcon,
  Air as PulmonaryIcon,
  Memory as NeurologyIcon,
  Accessibility as OrthopedicsIcon,
  MedicalServices as DentalIcon,
  Biotech as LabIcon
} from "@mui/icons-material";
import Navbar from "./Navbar";

const services = [
  {
    title: "Cardiology",
    description: "Heart health, circulation, vessels, diagnosis, treatment of cardiac diseases.",
    icon: <CardiologyIcon fontSize="large" />,
    color: "#1976d2" // Blue theme color
  },
  {
    title: "Pulmonary",
    description: "Lungs, respiration, airways, breathing, diagnosis of respiratory conditions.",
    icon: <PulmonaryIcon fontSize="large" />,
    color: "#2196f3" // Lighter blue
  },
  {
    title: "Neurology",
    description: "Brain, nerves, spinal cord, disorders, diagnosis, and treatment of neurological issues.",
    icon: <NeurologyIcon fontSize="large" />,
    color: "#0d47a1" // Darker blue
  },
  {
    title: "Orthopedics",
    description: "Bones, joints, muscles, ligaments, fractures, surgical and non-surgical repair.",
    icon: <OrthopedicsIcon fontSize="large" />,
    color: "#42a5f5" // Medium blue
  },
  {
    title: "Dental Surgery",
    description: "Oral cavity, teeth, gums, extractions, implants, surgical procedures.",
    icon: <DentalIcon fontSize="large" />,
    color: "#1e88e5" // Blue accent
  },
  {
    title: "Laboratory",
    description: "Analysis, tests, samples, diagnostics, pathology, medical investigations.",
    icon: <LabIcon fontSize="large" />,
    color: "#64b5f6" // Light blue
  }
];



export const Services = () => {
    const theme = useTheme();

    return (
        <>
      <Box sx={{ 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width:"99vw"
      }}>
        <Navbar />
        <Box sx={{ 
          flex: 1,
          py: 8,
          backgroundColor: "#f5f9ff",
          width: "100%"
        }}>
          <Container maxWidth="xl">
            {/* Section Header */}
            <Box textAlign="center" mb={6}>
              <Typography variant="h6" color="primary" sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: "1.25rem"
              }}>
                Services
              </Typography>
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" }
              }}>
                Health Care Solutions
              </Typography>
              <Box sx={{ 
                width: 80, 
                height: 4, 
                backgroundColor: theme.palette.primary.main, 
                margin: "16px auto",
                borderRadius: 2
              }} />
            </Box>
    
            {/* Services Grid */}
            <Grid container spacing={4}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(25, 118, 210, 0.1)",
                    borderTop: `4px solid ${service.color}`,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)"
                    }
                  }}>
                    <CardContent sx={{ 
                      flexGrow: 1,
                      textAlign: "center",
                      p: 4
                    }}>
                      <Avatar sx={{ 
                        backgroundColor: `${service.color}20`,
                        color: service.color,
                        width: 80,
                        height: 80,
                        margin: "0 auto 24px"
                      }}>
                        {service.icon}
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        color: "#1976d2"
                      }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ 
                        mb: 3,
                        fontSize: "1rem",
                        lineHeight: 1.6
                      }}>
                        {service.description}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: service.color,
                          "&:hover": {
                            backgroundColor: service.color,
                            opacity: 0.9
                          },
                          px: 4,
                          py: 1,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600
                        }}
                      >
                        LEARN MORE
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
      </>
    );
  };