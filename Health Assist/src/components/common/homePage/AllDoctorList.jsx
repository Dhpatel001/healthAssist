import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Grid, 
  CircularProgress, 
  Button, 
  Box, 
  Container,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const AllDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/doctor")
      .then((response) => {
        setDoctors(response.data.data);
        setFilteredDoctors(response.data.data);
        
        // Extract unique specializations from doctors
        const specs = [...new Set(response.data.data.map(doc => doc.specialization))];
        setSpecializations(specs);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = doctors;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.Firstname.toLowerCase().includes(term) || 
        doctor.Lastname.toLowerCase().includes(term) ||
        doctor.specialization.toLowerCase().includes(term)
      );
    }
    
    // Apply specialization filter
    if (specializationFilter !== "all") {
      result = result.filter(doctor => doctor.specialization === specializationFilter);
    }
    
    // Apply availability filter
    if (availabilityFilter !== "all") {
      result = result.filter(doctor => 
        availabilityFilter === "available" 
          ? doctor.availability === "Available" 
          : doctor.availability !== "Available"
      );
    }
    
    setFilteredDoctors(result);
  }, [searchTerm, specializationFilter, availabilityFilter, doctors]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", width: "100vw" }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box sx={{ 
        backgroundColor: "#1976d2",
        color: "white",
        py: 8,
        textAlign: "center",
        mb: 4
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            mb: 2 
          }}>
            Our Expert Doctors
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Qualified healthcare professionals dedicated to your well-being
          </Typography>
        </Container>
      </Box>

      {/* Filter Section */}
      <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, md: 4 } }}>
        <Paper elevation={2} sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: "12px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "stretch", md: "center" }
        }}>
          {/* Search Field */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: "8px" }
            }}
            sx={{ 
              flex: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          />
          
          {/* Specialization Filter */}
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="specialization-filter-label">Specialization</InputLabel>
            <Select
              labelId="specialization-filter-label"
              value={specializationFilter}
              label="Specialization"
              onChange={(e) => setSpecializationFilter(e.target.value)}
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="all">All Specializations</MenuItem>
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Availability Filter */}
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="availability-filter-label">Availability</InputLabel>
            <Select
              labelId="availability-filter-label"
              value={availabilityFilter}
              label="Availability"
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="all">All Availability</MenuItem>
              <MenuItem value="available">Available Only</MenuItem>
              <MenuItem value="unavailable">Unavailable Only</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Results Count */}
        <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary" }}>
          {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
        </Typography>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <Grid container spacing={4}>
            {filteredDoctors.map((doctor) => (
              <Grid item key={doctor._id} xs={12} sm={6} md={4} lg={3}>
                <Paper elevation={3} sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                  }
                }}>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    p: 3,
                    pt: 4,
                    flexGrow: 1
                  }}>
                    <Avatar
                      src={doctor.profilePic || "/default-doctor.png"}
                      alt={doctor.name}
                      sx={{ 
                        width: 140,
                        height: 140,
                        mb: 3,
                        border: "4px solid #1976d2",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        fontWeight: 600,
                        color: "text.primary",
                        textAlign: 'center',
                        mb: 1
                      }}
                    >
                      Dr. {doctor.Firstname} {doctor.Lastname}
                    </Typography>
                    
                    <Chip 
                      label={doctor.specialization}
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        fontWeight: 500,
                        borderWidth: "2px",
                        fontSize: "0.9rem",
                        padding: "4px 8px"
                      }}
                    />
                    
                    <Box sx={{ 
                      backgroundColor: doctor.availability === "Available" ? "#e3f2fd" : "#ffebee",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      mb: 2,
                      width: "100%",
                      textAlign: "center"
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {doctor.availability || "Not Available"}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: "#f5f5f5",
                    borderTop: "1px solid #e0e0e0"
                  }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={doctor.availability !== "Available"}
                      onClick={() => navigate(`/appointmentbydoctor/${doctor._id}`)}
                      sx={{
                        py: 1.5,
                        borderRadius: "8px",
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "1rem"
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ 
            p: 4, 
            textAlign: "center",
            backgroundColor: "transparent"
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No doctors found matching your criteria
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm("");
                setSpecializationFilter("all");
                setAvailabilityFilter("all");
              }}
            >
              Clear all filters
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default AllDoctorList;