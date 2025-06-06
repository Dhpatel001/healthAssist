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

export const Login = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);
      
      if (res.status === 200) {
        toast.success('Login Successfully!');
        
        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);
        
        setTimeout(() => {
          if(res.data.data.roleId.name === "USER") {
            navigate("/user/profile");
          }
        }, 1500);
      }
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  const validationSchema = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters"
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
          Welcome Back!
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary'
          }}
        >
          Please log in to continue
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
              'Login'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink 
              component={Link} 
              to="/forgotpassword" 
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              Forgot Password?
            </MuiLink>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              mt: 3,
              color: 'text.secondary'
            }}
          >
            Don't have an account?{' '}
            <MuiLink 
              component={Link} 
              to="/signup" 
              sx={{ fontWeight: 600 }}
            >
              Sign up here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};