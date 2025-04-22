import React from 'react';
import { 
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import { useNavigate } from 'react-router-dom';

export const PendingApproval = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('verificationStatus');
    navigate('/doctorlogin');
  };

  return (
    <Box width={"100vw"}>
    <Container sx={{ 
        mt: 4,          // Reduce top margin
        ml: 'auto',     // Push to right
        mr: 'auto',     // Center horizontally
        maxWidth: 'md'  // Make wider if needed
      }}>
      <Paper elevation={3} sx={{ 
  p: 4, 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: 2
}}>
        <Box
          sx={{
            backgroundColor: theme.palette.warning.light,
            color: theme.palette.warning.contrastText,
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <PendingIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Account Pending Approval
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Your doctor account is currently under review by our administration team.
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          You'll receive a notification once your account has been approved. This process typically takes 1-2 business days.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ px: 4 }}
          >
            Logout
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/contact"
            sx={{ px: 4 }}
          >
            Contact Support
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="caption">
            Checking approval status...
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Having issues? Email us at <strong>support@healthcareapp.com</strong>
        </Typography>
      </Box>
    </Container>
    </Box>
  );
};

export default PendingApproval;