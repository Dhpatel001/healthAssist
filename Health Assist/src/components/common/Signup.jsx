import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link as MuiLink,
  Paper,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export const Signup = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      data.roleId = "67c52aca47be6ea7ed296d28";
      const res = await axios.post("/user", data);
      
      if (res.status === 201) {
        toast.success('Signup Successfully!');
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error('Error occurred during signup. Please try again.');
    }
  };

  const validationSchema = {
    Firstname: {
      required: "First name is required"
    },
    Lastname: {
      required: "Last name is required"
    },
    PhoneNumber: {
      required: "Phone number is required",
      minLength: {
        value: 9,
        message: "Must be at least 9 characters"
      },
      pattern: {
        value: /[6-9]{1}[0-9]{9}/,
        message: "Invalid phone number format"
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
        message: "Must contain at least one number, uppercase, lowercase letter, and 8+ characters"
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
          Create Your Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          sx={{ mt: 2 }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            variant="outlined"
            {...register("Firstname", validationSchema.Firstname)}
            error={!!errors.Firstname}
            helperText={errors.Firstname?.message}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            variant="outlined"
            {...register("Lastname", validationSchema.Lastname)}
            error={!!errors.Lastname}
            helperText={errors.Lastname?.message}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            variant="outlined"
            {...register("PhoneNumber", validationSchema.PhoneNumber)}
            error={!!errors.PhoneNumber}
            helperText={errors.PhoneNumber?.message}
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
              to="/login" 
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