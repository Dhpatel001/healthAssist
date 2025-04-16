import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
      <div style={{width:"99vw"}}>
      <Container
      maxWidth="md"
      sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          
        }}
        >
      {/* Error Message Box */}
      <Box className="small-box bg-danger p-5 rounded-lg shadow">
        <Typography variant="h1" color="white" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h4" color="white" mt={2}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" color="white" mt={1}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </Typography>

        {/* Home Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, px: 4 }}
          onClick={() => navigate("/")}
          >
          Go to Homepage
        </Button>
      </Box>
    </Container>

            </div>
  );
};

export default Error404;
