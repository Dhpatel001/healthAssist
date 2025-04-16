import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Divider,
  Alert,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from "@mui/material";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Person as PersonIcon,
  MedicalInformation as MedicalIcon,
  CheckCircle as StatusIcon
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const fileInputRef = useRef(null);

  const handleUpdateClick = () => {
    navigate(`/user/userform/`);
  };

  useEffect(() => {
    if (!userId) return;

    axios.get(`/userbyid/${userId}`)
      .then(res => setUser(res.data.data))
      .catch(err => console.error("Error fetching user details:", err));
  }, [userId]);

  const handleUpdateClickPic = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);
    
    try {
      const res = await axios.put(`/updateuserphoto/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.status === 200) {
        console.log("Profile picture updated successfully.", res.data);
        setUser((prev) => ({ ...prev, userPic: res.data.data.userPic }));
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  if (!user) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading user profile...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh" width="99vw">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
              <Tooltip title="Update Profile Picture - Click Here" placement="top">
                <Avatar 
                  src={user?.userPic} 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mb: 3,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                      boxShadow: 3
                    }
                  }} 
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
              
              <Typography variant="h4" color="primary" gutterBottom>
                {user?.Firstname} {user?.Lastname}
              </Typography>
              
              <Chip 
                label={user?.role || "USER"} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mb: 2 }} 
              />
              
              <Button 
                variant="contained" 
                startIcon={<EditIcon />} 
                onClick={handleUpdateClick}
                sx={{ mb: 3, width: "100%" }}
              >
                Edit Profile
              </Button>
              
              <Divider sx={{ width: "100%", my: 2 }} />
              
              <List sx={{ width: "100%" }}>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user?.email || "Not provided"} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={user?.PhoneNumber || "Not provided"} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CakeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date of Birth" 
                    secondary={user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Gender" secondary={user?.gender || "Not specified"} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <StatusIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={user?.Status ? "Active" : "Inactive"} 
                        size="small" 
                        color={user?.Status ? "success" : "error"} 
                      />
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">First Name</Typography>
                  <Typography variant="body1">{user?.Firstname || "Not provided"}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Last Name</Typography>
                  <Typography variant="body1">{user?.Lastname || "Not provided"}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Age</Typography>
                  <Typography variant="body1">{user?.Age || "Not provided"}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <MedicalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Medical Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Medical History</Typography>
                  {user?.mediacalHistory?.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {user.mediacalHistory.map((item, index) => (
                        <Chip key={index} label={item} color="secondary" size="small" />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body1">No medical history recorded</Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Alert 
        severity="info" 
        sx={{ 
          mt: 3, 
          borderRadius: 3, 
          boxShadow: 2,
          "& .MuiAlert-message": {
            width: "100%"
          }
        }}
      >
        Keep your profile updated for better healthcare services.
      </Alert>
    </Box>
  );
};