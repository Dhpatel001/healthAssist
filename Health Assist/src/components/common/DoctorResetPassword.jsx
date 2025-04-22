import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export const DoctorResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/doctor/resetpassword", {
        token: token,
        password: data.password
      });
      
      if (res.status === 200) {
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate("/doctorlogin");
        }, 1500);
      }
    } catch (error) {
      toast.error('Error resetting password. Please try again.');
    }
  };

  const validationSchema = {
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      pattern: {
        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        message: "Must contain at least one number, uppercase, and lowercase letter"
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
          Reset Password
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary'
          }}
        >
          Enter your new password
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          sx={{ mt: 2 }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
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
              'Reset Password'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};