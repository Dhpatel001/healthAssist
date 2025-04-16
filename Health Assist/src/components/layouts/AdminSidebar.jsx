import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Drawer, List, ListItem, ListItemText, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleHomePage = () => {
    navigate("/admin/home");
  }; 
  const handleMainHomePage = () => {
    navigate("/");
  }; 

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

   const navItems = [
      { text: "Home", path: "/admin/home" },
      // { text: "Appointments", path: "/doctor/appointments" },?
      // { text: "EHR", path: "/doctor/ehr" },?
      { text: "Contact", path: "/contact" },
      // { text: "Chat", path: "/doctor/chat" }?
    ];
  
    const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
        <Typography variant="h6" sx={{ my: 2, textAlign: "center" }} onClick={handleMainHomePage}>
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
                <Button color="inherit">Services</Button>
         
              </Box>

              <Button color="inherit">Contact</Button>
            </Box>
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
          keepMounted: true, // Better open performance on mobile.
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


