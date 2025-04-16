import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Avatar,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Card,
  CardContent,
  Divider,
  Stack
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RefreshIcon from '@mui/icons-material/Refresh';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const theme = createTheme({
  palette: {
    primary: { main: '#4a6bff' },
    secondary: { main: '#ff6b6b' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 700,
      color: '#1e293b'
    },
    h5: {
      fontWeight: 600,
      color: '#1e293b'
    },
    subtitle1: {
      color: '#64748b'
    }
  },
  components: {
    MuiButton: { 
      styleOverrides: { 
        root: { 
          borderRadius: 12,
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        } 
      } 
    },
    MuiSelect: { 
      styleOverrides: { 
        root: { 
          borderRadius: 12 
        } 
      } 
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }
      }
    }
  }
});

const allTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const steps = ['Appointment Details', 'Confirmation', 'Payment'];

const RazorpayPayment = ({ appointmentData, onPaymentSuccess, onPaymentClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_BJfA9tfictA1Jg",
      amount: (appointmentData.amount || 500) * 100,
      currency: "INR",
      name: "MediCare Clinic",
      description: `Appointment with ${appointmentData.doctorName}`,
      payment_capture:1,
      handler: async function (response) {
        try {
          const updateResponse = await axios.patch(
            `/appointment/appointments/${appointmentData.appointmentId}/confirm`,
            {
              status: "Confirmed",
              paymentId: response.razorpay_payment_id,
              paymentStatus: "Completed",
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            }
          );
          
          console.log('Backend update response:', updateResponse.data);
          
          if (updateResponse.data.success) {
            console.log('Calling onPaymentSuccess');
            onPaymentSuccess(); // Make sure this is being called
          } else {
            setError("Payment successful but failed to update appointment status");
          }
        } catch (err) {
          console.error("Update error:", err);
          setError(err.response?.data?.message || "Payment successful but failed to update appointment status");
        }
      },
      prefill: {
        name: appointmentData.patientName || "Patient",
        email: localStorage.getItem("email") || "patient@example.com",
        contact: appointmentData.phoneNumber || "9999999999",
      },
      theme: {
        color: "#4a6bff",
      },
      modal: {
        ondismiss: () => {
          onPaymentClose();
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    displayRazorpay();
  }, []);

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <PaymentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Complete Your Payment
      </Typography>
      
      <Card sx={{ 
        maxWidth: 500,
        mx: 'auto',
        mb: 4,
        textAlign: 'left'
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Appointment Summary
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body1" sx={{ color: '#64748b', minWidth: 100 }}>Doctor:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{appointmentData.doctorName}</Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body1" sx={{ color: '#64748b', minWidth: 100 }}>Date:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {dayjs(appointmentData.appointmentDate).format("dddd, MMMM D, YYYY")}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body1" sx={{ color: '#64748b', minWidth: 100 }}>Time:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{appointmentData.appointmentTime}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body1" sx={{ color: '#64748b', minWidth: 100 }}>Amount:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#4a6bff' }}>
                ₹{appointmentData.amount}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={displayRazorpay}
        disabled={loading}
        sx={{ mt: 2 }}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Secure payment powered by Razorpay
      </Typography>
    </Box>
  );
};

export const AppointmentForm = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    specializations: [],
    doctors: [],
    selectedSpecialty: "",
    selectedDoctor: null,
    bookingFor: "Myself",
    patientName: "",
    phoneNumber: "",
    dob: null,
    appointmentDate: null,
    selectedTime: "",
    bookedSlots: [],
    loading: false,
    loadingSlots: false,
    error: null,
    errorDetails: null,
    success: null,
    userDetails: null,
    doctorDetails: null,
    activeStep: 0,
    appointmentDetails: null,
    paymentSuccess: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        const specsRes = await axios.get("/specializations");
        const userId = localStorage.getItem("id");
        let userRes = null;
        if (userId) {
          userRes = await axios.get(`/userbyid/${userId}`);
        }

        setState(prev => ({
          ...prev,
          specializations: specsRes.data.data,
          userDetails: userRes?.data.data,
          patientName: userRes?.data.data ? 
            `${userRes.data.data.Firstname} ${userRes.data.data.Lastname}` : "",
          phoneNumber: userRes?.data.data?.PhoneNumber || "",
          loading: false
        }));
      } catch (err) {
        handleError("Failed to load initial data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!state.selectedSpecialty) return;
      
      try {
        setState(prev => ({ ...prev, loading: true }));
        const res = await axios.get(`/doctor/specialization/${state.selectedSpecialty}`);
        setState(prev => ({
          ...prev,
          doctors: res.data.data,
          loading: false,
          selectedDoctor: null
        }));
      } catch (err) {
        handleError("Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, [state.selectedSpecialty]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!state.selectedDoctor) return;
      
      try {
        const res = await axios.get(`/doctorbyid/${state.selectedDoctor._id}`);
        setState(prev => ({
          ...prev,
          doctorDetails: res.data.data
        }));
      } catch (err) {
        console.error("Failed to fetch doctor details", err);
      }
    };

    fetchDoctorDetails();
  }, [state.selectedDoctor]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!state.selectedDoctor || !state.appointmentDate) {
        setState(prev => ({ ...prev, bookedSlots: [] }));
        return;
      }

      try {
        setState(prev => ({ ...prev, loadingSlots: true }));
        const dateStr = state.appointmentDate.format("YYYY-MM-DD");
        const res = await axios.get(
          `/appointment/availability/${state.selectedDoctor._id}/${dateStr}`
        );
        setState(prev => ({
          ...prev,
          bookedSlots: res.data.data.bookedSlots || [],
          loadingSlots: false,
          selectedTime: ""
        }));
      } catch (err) {
        handleError("Failed to fetch availability");
      }
    };

    fetchAvailability();
  }, [state.selectedDoctor, state.appointmentDate]);

  const handleError = (message, details = null) => {
    setState(prev => ({
      ...prev,
      error: message,
      errorDetails: details,
      loading: false,
      loadingSlots: false
    }));
    setTimeout(() => setState(prev => ({ ...prev, error: null, errorDetails: null })), 10000);
  };

  const handleSuccess = (message) => {
    setState(prev => ({
      ...prev,
      success: message,
      loading: false
    }));
    setTimeout(() => setState(prev => ({ ...prev, success: null })), 5000);
  };

  const handleNext = () => {
    setState(prev => ({ ...prev, activeStep: prev.activeStep + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, activeStep: prev.activeStep - 1 }));
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      activeStep: 0,
      appointmentDetails: null,
      paymentSuccess: false,
      selectedSpecialty: "",
      selectedDoctor: null,
      appointmentDate: null,
      selectedTime: ""
    }));
  };

  const createAppointment = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const appointmentData = {
        doctorId: state.selectedDoctor._id,
        userId: localStorage.getItem("id"),
        firstName: state.patientName.split(" ")[0],
        lastName: state.patientName.split(" ")[1] || "",
        phoneNumber: state.phoneNumber,
        appointmentDate: state.appointmentDate.format("YYYY-MM-DD"),
        appointmentTime: state.selectedTime,
        status: "Pending Payment",
        consultationFee: state.doctorDetails?.consultationFee || 500
      };

      const res = await axios.post("/appointment/appointment", appointmentData);
      
      setState(prev => ({
        ...prev,
        appointmentDetails: res.data.data,
        loading: false
      }));
      
      handleNext();
    } catch (err) {
      handleError("Failed to create appointment");
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment success handler called');
    setState(prev => {
      console.log('Current state before update:', prev);
      return {
        ...prev,
        paymentSuccess: true,
        activeStep: prev.activeStep + 1
      };
    });
  };


  const handlePaymentClose = () => {
    console.log("Payment modal closed");
  };

  const refreshAvailability = async () => {
    if (!state.selectedDoctor || !state.appointmentDate) return;
    
    try {
      setState(prev => ({ ...prev, loadingSlots: true }));
      const dateStr = state.appointmentDate.format("YYYY-MM-DD");
      const res = await axios.get(
        `/appointment/availability/${state.selectedDoctor._id}/${dateStr}`
      );
      setState(prev => ({
        ...prev,
        bookedSlots: res.data.data.bookedSlots || [],
        loadingSlots: false
      }));
    } catch (err) {
      handleError("Failed to refresh availability");
    }
  };

  const availableSlots = allTimeSlots.filter(
    slot => !state.bookedSlots.includes(slot)
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {state.error && (
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {state.error}
                {state.errorDetails && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {state.errorDetails}
                  </Typography>
                )}
              </Alert>
            )}
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#64748b' }}>
                <MedicalServicesIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Select Specialization
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={state.selectedSpecialty}
                  onChange={(e) => setState(prev => ({ 
                    ...prev, 
                    selectedSpecialty: e.target.value 
                  }))}
                  disabled={state.loading}
                  displayEmpty
                  sx={{ bgcolor: '#f8fafc' }}
                >
                  <MenuItem value="" disabled>
                    Choose a specialization
                  </MenuItem>
                  {state.specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#64748b' }}>
                <PersonIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Select Doctor
              </Typography>
              <Autocomplete
                options={state.doctors}
                getOptionLabel={(doctor) => 
                  `Dr. ${doctor.Firstname} ${doctor.Lastname}`
                }
                value={state.selectedDoctor}
                onChange={(_, value) => setState(prev => ({ 
                  ...prev, 
                  selectedDoctor: value 
                }))}
                loading={state.loading}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Search doctors..."
                    sx={{ bgcolor: '#f8fafc' }}
                  />
                )}
                renderOption={(props, doctor) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={doctor.profilePic} 
                        alt={`Dr. ${doctor.Firstname}`}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography fontWeight={500}>
                          Dr. {doctor.Firstname} {doctor.Lastname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.specialization}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                )}
                disabled={!state.selectedSpecialty}
              />
            </Grid>

            {state.doctorDetails && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar 
                        src={state.doctorDetails.profilePic} 
                        sx={{ width: 80, height: 80 }}
                      />
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          Dr. {state.doctorDetails.Firstname} {state.doctorDetails.Lastname}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                          {state.doctorDetails.specialization}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MedicalServicesIcon color="primary" fontSize="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {state.doctorDetails.qualification}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon color="primary" fontSize="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {state.doctorDetails.experience} years experience
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Consultation Fee
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4a6bff' }}>
                        ₹{state.doctorDetails.consultationFee || '500'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#64748b' }}>
                <PersonIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Patient Details
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Appointment For:
                  </Typography>
                  <RadioGroup
                    row
                    value={state.bookingFor}
                    onChange={(e) => setState(prev => ({ 
                      ...prev, 
                      bookingFor: e.target.value,
                      patientName: e.target.value === "Myself" && state.userDetails ? 
                        `${state.userDetails.Firstname} ${state.userDetails.Lastname}` : ""
                    }))}
                  >
                    {["Myself", "Family", "Other"].map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="primary" />}
                        label={option}
                        sx={{ mr: 3 }}
                      />
                    ))}
                  </RadioGroup>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Patient Name"
                        value={state.patientName}
                        onChange={(e) => setState(prev => ({ 
                          ...prev, 
                          patientName: e.target.value 
                        }))}
                        disabled={state.bookingFor === "Myself"}
                        sx={{ bgcolor: '#f8fafc' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={state.phoneNumber}
                        onChange={(e) => setState(prev => ({ 
                          ...prev, 
                          phoneNumber: e.target.value 
                        }))}
                        sx={{ bgcolor: '#f8fafc' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date of Birth"
                          value={state.dob}
                          onChange={(date) => setState(prev => ({ 
                            ...prev, 
                            dob: date 
                          }))}
                          maxDate={dayjs().subtract(1, 'day')}
                          sx={{ width: '100%', bgcolor: '#f8fafc' }}
                          slotProps={{ textField: { sx: { borderRadius: 12 } } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#64748b' }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Appointment Schedule
              </Typography>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Select Date"
                          value={state.appointmentDate}
                          onChange={(date) => setState(prev => ({ 
                            ...prev, 
                            appointmentDate: date,
                            selectedTime: ""
                          }))}
                          minDate={dayjs()}
                          sx={{ width: '100%', bgcolor: '#f8fafc' }}
                          slotProps={{ textField: { sx: { borderRadius: 12 } } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    
                    {state.appointmentDate && state.selectedDoctor && (
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            Available Time Slots
                          </Typography>
                          <IconButton 
                            onClick={refreshAvailability} 
                            size="small"
                            sx={{ ml: 1 }}
                            disabled={state.loadingSlots}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <FormControl fullWidth>
                          <Select
                            value={state.selectedTime}
                            onChange={(e) => setState(prev => ({ 
                              ...prev, 
                              selectedTime: e.target.value 
                            }))}
                            disabled={state.loadingSlots || availableSlots.length === 0}
                            displayEmpty
                            sx={{ bgcolor: '#f8fafc' }}
                          >
                            <MenuItem value="" disabled>
                              {state.loadingSlots ? 'Loading slots...' : 'Select a time slot'}
                            </MenuItem>
                            {availableSlots.map((slot) => (
                              <MenuItem key={slot} value={slot}>
                                {slot}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>

                  {state.bookedSlots.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Booked slots for selected date:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {state.bookedSlots.map((slot) => (
                          <Chip 
                            key={slot} 
                            label={slot} 
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!state.selectedDoctor || !state.appointmentDate || !state.selectedTime}
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue
                </Button>
              </Box>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Confirm Your Appointment
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: '#64748b' }}>
              Please review your appointment details before proceeding to payment
            </Typography>
            
            <Card sx={{ maxWidth: 500, mx: 'auto', mb: 4, textAlign: 'left' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Doctor:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Dr. {state.selectedDoctor?.Firstname} {state.selectedDoctor?.Lastname}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Specialization:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {state.selectedDoctor?.specialization}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Patient:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {state.patientName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Date:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {dayjs(state.appointmentDate).format("dddd, MMMM D, YYYY")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Time:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {state.selectedTime}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Fee:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4a6bff' }}>
                      ₹{state.doctorDetails?.consultationFee || '500'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack} 
                sx={{ px: 4 }}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={createAppointment}
                disabled={state.loading}
                sx={{ px: 4 }}
                endIcon={state.loading ? <CircularProgress size={20} /> : <PaymentIcon />}
              >
                {state.loading ? 'Processing...' : 'Confirm & Pay'}
              </Button>
            </Box>
          </Box>
        );
        case 2:
          if (state.paymentSuccess) {
            console.log('Rendering success screen');
            return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Appointment Confirmed!
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 4, color: '#64748b' }}>
                Your appointment has been successfully booked
              </Typography>
              
              <Card sx={{ maxWidth: 500, mx: 'auto', mb: 4, textAlign: 'left' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Doctor:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Dr. {state.selectedDoctor?.Firstname} {state.selectedDoctor?.Lastname}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Date:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {dayjs(state.appointmentDetails?.appointmentDate).format("dddd, MMMM D, YYYY")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Time:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {state.appointmentDetails?.appointmentTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="body1" sx={{ color: '#64748b', minWidth: 120 }}>Amount Paid:</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4a6bff' }}>
                        ₹{state.doctorDetails?.consultationFee || '500'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                A confirmation has been sent to your registered email address.
              </Typography>

              <Button 
                variant="contained" 
                onClick={handleReset}
                sx={{ px: 4 }}
              >
                Book Another Appointment
              </Button>
            </Box>
          );
        } else {
          return (
            <RazorpayPayment
              appointmentData={{
                appointmentId: state.appointmentDetails?._id,
                doctorName: `Dr. ${state.selectedDoctor?.Firstname} ${state.selectedDoctor?.Lastname}`,
                appointmentDate: state.appointmentDetails?.appointmentDate,
                appointmentTime: state.appointmentDetails?.appointmentTime,
                amount: state.doctorDetails?.consultationFee || 500,
                patientName: state.patientName,
                phoneNumber: state.phoneNumber
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentClose={handlePaymentClose}
            />
          );
        }
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Paper sx={{ 
          maxWidth: 1000, 
          mx: 'auto', 
          p: { xs: 2, md: 4 }, 
          borderRadius: 4
        }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
            Book Doctor Appointment
          </Typography>

          {state.error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {state.error}
            </Alert>
          )}

          {state.success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {state.success}
            </Alert>
          )}

          <Stepper activeStep={state.activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(state.activeStep)}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};