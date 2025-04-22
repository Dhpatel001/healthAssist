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

export const ForgetPassword = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/forgotpassword", data);
      if (res.status === 200) {
        toast.success('Password reset link sent to your email!');
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error('Error sending reset link. Please try again.');
    }
  };

  const validationSchema = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
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
          Forgot Password
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary'
          }}
        >
          Enter your email to receive a reset link
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          sx={{ mt: 2 }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            variant="outlined"
            {...register("email", validationSchema.email)}
            error={!!errors.email}
            helperText={errors.email?.message}
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
              'Send Reset Link'
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
            Remember your password?{' '}
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