import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link as MuiLink,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Bounce } from 'react-toastify';

export const DoctorSignup = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      data.roleId = "67c5ac9939278f26668be180"; // Hardcoded role ID - consider making this configurable
      const res = await axios.post("/doctor", data);
      
      if (res.status === 201) {
        toast.success('Signup Successful!', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/doctorlogin");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          toast.error(data.message || 'Validation error');
        } else if (status === 409) {
          toast.error('Email already exists');
        } else {
          toast.error('An error occurred during signup');
        }
      } else {
        toast.error('Network error. Please try again later.');
      }
    }
  };

  const validationSchema = {
    name: {
      required: "First name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters"
      }
    },
    phoneNumber: {
      required: "Phone number is required",
      pattern: {
        value: /[6-9]{1}[0-9]{9}/,
        message: "Phone number is not valid"
      }
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
    password: {
      required: "Password is required",
      pattern: {
        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        message: "Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: "100vw",
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <ToastContainer />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            textAlign: 'center',
            color: 'primary.main'
          }}
        >
          Create Your Doctor Account
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary'
          }}
        >
          Join our platform to start helping patients
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          sx={{ mt: 2 }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            variant="outlined"
            {...register("name", validationSchema.name)}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            variant="outlined"
            {...register("phoneNumber", validationSchema.phoneNumber)}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            variant="outlined"
            {...register("email", validationSchema.email)}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            {...register("password", validationSchema.password)}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              mt: 3,
              color: 'text.secondary'
            }}
          >
            Already have an account?{' '}
            <MuiLink 
              component={Link} 
              to="/doctorlogin" 
              sx={{ fontWeight: 600 }}
            >
              Login here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};