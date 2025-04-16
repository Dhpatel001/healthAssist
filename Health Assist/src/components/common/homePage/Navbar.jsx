import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user authentication 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleHome = () => {
    navigate("/");
  };
  const handleContact = () => {
    navigate("/contactus");
  };
  const handleServices = () => {
    navigate("/services");
  };
  const handleAllDoctor = () => {
    navigate("/alldoctor");
  };

  const handleAppointments = () => {
    if (isLoggedIn) {
      navigate("/user/appointment");
    } else {
      toast.warn('🦄 Please log in first!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
      // alert("Please log in first!"); // Optional: Replace with a toast notification
      // navigate("/login");
      setTimeout(()=>{
        {
          // navigate("/login") 
        }
      },1500);
    }
  };

  const drawerContent = (
    <List>
      <ListItem button>
        <ListItemText primary="Home" onClick={handleHome} />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Services" onClick={handleServices}/>
      </ListItem>
      <ListItem button>
        <ListItemText primary="Doctors" onClick={handleAllDoctor}/>
      </ListItem>
      <ListItem button>
        <ListItemText primary="Appointments" onClick={handleAppointments} />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Contact Us" onClick={handleContact} />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Login"onClick={handleLogin} />
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" color="primary">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Health Assist
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button color="inherit" onClick={handleHome}> Home</Button>
            <Button color="inherit" onClick={handleServices}>Services</Button>
            <Button color="inherit" onClick={handleAllDoctor}>Doctors</Button>
            <Button color="inherit" onClick={handleAppointments}>Appointments</Button>
            <Button color="inherit" onClick={handleContact}>Contact Us</Button>
            <Button color="inherit" style={{ marginLeft: "10px" }} onClick={handleLogin}>
          {isLoggedIn ? "Logo ut" : "Login"}
        </Button>
          </div>
        )}
        {/* <Button color="inherit" style={{ marginLeft: "10px" }} onClick={handleLogin}>
          {isLoggedIn ? "Logo ut" : "Login"}
        </Button> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
