import React from "react";
import { Box, Typography } from "@mui/material";

const CopyRight = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e0e0e0",
        textAlign: "center",
        padding: "1rem 0",
        marginTop: "0",
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="body2" sx={{ color: "#666" }}>
        © {new Date().getFullYear()} Health Assist. All rights reserved.
      </Typography>
    </Box>
  );
};

export default CopyRight;
