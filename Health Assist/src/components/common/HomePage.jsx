// import React from "react";
// import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Avatar, Paper, AppBar, Toolbar } from "@mui/material";
// // import "bootstrap/dist/css/bootstrap.min.css";
// import "../../assets/HomePage.css";
// import Healthcare from '../../assets/images/Healthcare.jpg';
// import doctorAvtar from '../../assets/images/defaultDoctor.jpg';
// import '/css/adminlte.min.css?url';

import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent, Avatar, Paper, AppBar, Toolbar, Container } from "@mui/material";
import { Search, Event, Videocam, Person } from "@mui/icons-material";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/HomePage.css";


import Healthcare from "../../assets/images/Healthcare.jpg";
import doctorAvatar from "../../assets/images/defaultDoctor.jpg";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate();

    const handleUpdateClick = () => navigate(`/signup`);
    return (
        <Box sx={{width:"100vw" }}>
        {/* Navbar */}
        <AppBar position="sticky" color="primary" sx={{ padding: "0 0",gap:"20px"}}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Health Assist</Typography>
                <Button variant="outlined" color="inherit" onClick={handleUpdateClick}>Sign In</Button>
            </Toolbar>
        </AppBar>
        
        {/* Hero Section */}
        <Box sx={{ backgroundImage: `url(${Healthcare})`, backgroundSize: "cover", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "white", position: "relative", padding: "50px 0" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>Your Health, Your Way</Typography>
                <Typography variant="h5" sx={{ marginBottom: 3 }}>Find top doctors, book appointments, and manage health records online.</Typography>
                <Button variant="contained" color="secondary" sx={{ marginRight: 2 }}>Find a Doctor</Button>
                <Button variant="outlined" color="secondary">For Providers</Button>
            </motion.div>
        </Box>
        
        {/* How It Works */}
        <Container sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>How It Works</Typography>
            <Grid container spacing={3} justifyContent="center">
                {[{ icon: <Search />, text: "Search Doctor" }, { icon: <Event />, text: "Book Appointment" }, { icon: <Videocam />, text: "Consult Online" }].map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ textAlign: "center", padding: 3, transition: "0.3s", '&:hover': { transform: "scale(1.05)" } }}>
                            <Avatar sx={{ backgroundColor: "primary.main", width: 60, height: 60, margin: "auto" }}>{item.icon}</Avatar>
                            <CardContent>
                                <Typography variant="h6">{item.text}</Typography>
                                <Typography variant="body2">Easily {item.text.toLowerCase()} in a few clicks.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
        
        {/* Testimonials Section */}
        <Box sx={{ py: 5, backgroundColor: "#f8f9fa", textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>What Our Users Say</Typography>
            <Container>
                <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                    {["This platform made booking a doctor so easy!", "The best way to manage my health records!"].map((testimonial, index) => (
                        <Paper key={index} sx={{ padding: 3, margin: 2 }}>
                            <Avatar src={doctorAvatar} sx={{ width: 50, height: 50, margin: "auto" }} />
                            <Typography variant="body1" sx={{ mt: 2 }}>{testimonial}</Typography>
                            <Typography variant="caption">- User {index + 1}</Typography>
                        </Paper>
                    ))}
                </Slider>
            </Container>
        </Box>
        
        {/* Call to Action */}
        <Box sx={{ textAlign: "center", py: 5, backgroundColor: "primary.main", color: "white" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Ready to Take Charge of Your Health?</Typography>
            <Button variant="contained" color="secondary" size="large">Get Started</Button>
        </Box>
        
        {/* Footer */}
        <Box sx={{ textAlign: "center", py: 2, backgroundColor: "#343a40", color: "white" }}>
            <Typography variant="body2">&copy; 2025 Health Assist. All Rights Reserved.</Typography>
        </Box>
    </Box>
);
};
