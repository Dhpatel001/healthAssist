import React, { useState, useEffect } from "react";
import { 
  AppBar, Toolbar, Typography, IconButton, Button, Box, Drawer, 
  List, ListItem, ListItemText, Avatar, Menu, MenuItem, Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

export const UserSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    navigate("/user/profile");
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleAppointments = () => {
    setAnchorEl(null);
    navigate("/user/appointment");
  };

  const handleHomePage = () => {
    setAnchorEl(null);
    navigate("/user/home");
  };

  const handleContact = () => {
    setAnchorEl(null);
    navigate("/contactus");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleEHR = () => {
    navigate("/user/ehr");
  };

  useEffect(() => {
    if (userId) {
      axios.get(`/appointment/appointments/user/${userId}`)
        .then(res => {
          const now = new Date();
          const upcoming = res.data.data.filter(appt => 
            new Date(appt.appointmentDate) > now
          );
          setUpcomingAppointments(upcoming);
        })
        .catch(err => console.error("Error fetching appointments:", err));
    }
  }, [userId]);

  const navItems = [
    { text: "Home", path: "/user/home" },
    { text: "Doctors", path: "/alldoctor" },
    { text: "Appointments", path: "/user/appointments" },
    { text: "EHR", path: "/user/ehr" },
    { text: "Contact", path: "/contactus" },
    { text: "Chat", path: "/doctor/chat" }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ my: 2, textAlign: "center" }} onClick={handleHome}>
        Health Assist
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ width: '100vw' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { sm: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }} onClick={handleHome}>
              Health Assist
            </Typography>
            <Box sx={{ display: { xs: "flex", sm: "flex" }, alignItems: "center" }}>
              <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                <Button color="inherit" onClick={handleHomePage}>Home</Button>
                <Box
                  sx={{
                    position: "relative",
                    "&:hover > .dropdown": {
                      display: "block",
                    },
                  }}
                >
                  
                </Box>
                <Button color="inherit" onClick={handleAppointments}>Appointments</Button>
                <Button color="inherit" onClick={handleEHR}>EHR</Button>
                <Button color="inherit" onClick={handleContact}>Contact</Button>
              </Box>
              
              {/* Notification Icon with Badge */}
              <IconButton
                color="inherit"
                onClick={handleNotificationClick}
                sx={{ ml: 1 }}
              >
                <Badge 
                  badgeContent={upcomingAppointments.length} 
                  color="error"
                  max={9}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              {/* Notifications Menu */}
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <MenuItem key={index} onClick={handleNotificationClose}>
                      <ListItemText
                        primary={`Dr. ${appointment.doctorId?.Firstname || ''} ${appointment.doctorId?.Lastname || ''}`}
                        secondary={`${new Date(appointment.appointmentDate).toLocaleDateString()} at ${new Date(appointment.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                      />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem onClick={handleNotificationClose}>
                    <ListItemText primary="No upcoming appointments" />
                  </MenuItem>
                )}
              </Menu>

              <Avatar
                sx={{ ml: 2, cursor: "pointer" }}
                src="/static/images/avatar/1.jpg"
                alt="User Avatar"
                onClick={handleAvatarClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
        <main className="app-main">
          <Outlet></Outlet>
        </main>
      </Box>
    </>
  );
};