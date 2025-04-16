import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating as MuiRating,
  TextField,
  Tooltip
} from '@mui/material';
import {
  MedicalServices,
  CalendarToday,
  Person,
  LocalHospital,
  ExpandMore,
  AccessTime,
  CheckCircle,
  Cancel,
  Medication,
  Email,
  Phone,
  Cake,
  Transgender,
  Work,
  School,
  Star,
  RateReview
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  const statusColors = {
    Pending: theme.palette.warning.main,
    Confirmed: theme.palette.success.main,
    Completed: theme.palette.info.main,
    Cancelled: theme.palette.error.main,
    Started: theme.palette.primary.main
  };
  return {
    backgroundColor: statusColors[status] || theme.palette.grey[500],
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: '0.75rem',
    height: '24px'
  };
});

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    height: '4px',
    borderRadius: '2px'
  }
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: '600',
  fontSize: '0.9rem',
  minHeight: '48px',
  '&.Mui-selected': {
    color: theme.palette.primary.main
  }
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: '12px !important',
  marginBottom: '16px !important',
  overflow: 'hidden',
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: '0 0 16px 0 !important'
  }
}));

const ReviewModal = ({ open, onClose, doctorId, appointmentId, userId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await axios.post('/reviews/create', {
        doctorId,
        appointmentId,
        userId,
        rating,
        review: reviewText
      });
      onClose(true);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Rate Your Experience</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Typography variant="body1">How would you rate your experience?</Typography>
          <MuiRating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            label="Your review (optional)"
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={rating === 0 || submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DoctorRating = ({ doctorId, doctors }) => {
  const doctor = doctors[doctorId];
  if (!doctor) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          sx={{ 
            fontSize: '1rem', 
            color: star <= Math.round(doctor.averageRating) ? 'warning.main' : 'grey.300' 
          }} 
        />
      ))}
      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
        ({doctor.totalReviews} reviews)
      </Typography>
    </Box>
  );
};

export const EHRDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [userRes, appointmentsRes, prescriptionsRes] = await Promise.all([
          axios.get(`/userbyid/${userId}`),
          axios.get(`/appointment/appointments/user/${userId}`),
          axios.get(`/prescription/patient/${userId}`)
        ]);

        setUserData({
          ...userRes.data.data,
          Firstname: userRes.data.data?.Firstname || 'User',
          Lastname: userRes.data.data?.Lastname || '',
          Age: userRes.data.data?.Age || 'N/A',
          email: userRes.data.data?.email || 'N/A',
          PhoneNumber: userRes.data.data?.PhoneNumber || 'N/A',
          gender: userRes.data.data?.gender || 'N/A',
          dateOfBirth: userRes.data.data?.dateOfBirth || null,
          userPic: userRes.data.data?.userPic || ''
        });

        const appointmentsData = Array.isArray(appointmentsRes.data.data) ? appointmentsRes.data.data : [];
        const prescriptionsData = Array.isArray(prescriptionsRes.data.data) ? prescriptionsRes.data.data : [];
        setAppointments(appointmentsData);
        setPrescriptions(prescriptionsData);

        const allDoctorIds = new Set([
          ...appointmentsData.map(a => a.doctorId._id).filter(Boolean),
          ...prescriptionsData.map(p => p.doctorId._id).filter(Boolean)
        ]);

        const doctorsData = {};
        await Promise.all(
          Array.from(allDoctorIds).map(async (doctorId) => {
            try {
              const [doctorRes, reviewsRes] = await Promise.all([
                axios.get(`/doctorbyid/${doctorId}`),
                axios.get(`/reviews/doctor/${doctorId}`)
              ]);

              doctorsData[doctorId] = {
                ...doctorRes.data.data,
                Firstname: doctorRes.data.data?.Firstname || 'Doctor',
                Lastname: doctorRes.data.data?.Lastname || '',
                specialization: doctorRes.data.data?.specialization || 'General Practitioner',
                phoneNumber: doctorRes.data.data?.phoneNumber || 'N/A',
                profilePic: doctorRes.data.data?.profilePic || '',
                averageRating: doctorRes.data.data?.averageRating || 0,
                totalReviews: doctorRes.data.data?.totalReviews || 0,
                reviews: reviewsRes.data.data || []
              };
            } catch (error) {
              console.error(`Error fetching doctor ${doctorId}:`, error);
              doctorsData[doctorId] = {
                Firstname: 'Unknown',
                Lastname: 'Doctor',
                specialization: 'N/A',
                phoneNumber: 'N/A',
                averageRating: 0,
                totalReviews: 0,
                reviews: []
              };
            }
          })
        );
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching EHR data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchData();
    } else {
      setError('User ID not found. Please log in again.');
      setLoading(false);
    }
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenReview = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalOpen(true);
  };

  const handleCloseReview = (refreshed) => {
    setReviewModalOpen(false);
    if (refreshed) {
      // Optionally refresh data
      window.location.reload();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle color="success" />;
      case 'Cancelled': return <Cancel color="error" />;
      case 'Completed': return <CheckCircle color="info" />;
      case 'Started': return <AccessTime color="primary" />;
      default: return <AccessTime color="warning" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return format(new Date(`1970-01-01T${timeString}`), 'h:mm a');
    } catch {
      return 'Invalid time';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            <MedicalServices sx={{ verticalAlign: 'middle', mr: 2, color: 'primary.main' }} />
            My Health Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {userData?.Firstname || 'User'}! Here's your health summary.
          </Typography>
        </Box>
        {/* <Badge badgeContent={appointments.length} color="primary" overlap="circular">
          <Avatar 
            src={userData?.userPic} 
            sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
          >
            {userData?.Firstname?.charAt(0)}{userData?.Lastname?.charAt(0)}
          </Avatar>
        </Badge> */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Profile Summary */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3} >
              {/* <Badge badgeContent={appointments.length} color="primary" overlap="circular"> */}
                <Avatar 
                  src={userData?.userPic} 
                  sx={{ 
                    width: 96, 
                    height: 96, 
                    mr: 3,
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  {userData?.Firstname?.charAt(0)}{userData?.Lastname?.charAt(0)}
                  
                </Avatar>
                {/* </Badge> */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {userData?.Firstname} {userData?.Lastname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Patient since {userData?.createdAt ? format(new Date(userData.createdAt), 'yyyy') : 'N/A'}
                  </Typography>
                  <Chip 
                    label="Active Patient" 
                    color="success" 
                    size="small" 
                    sx={{ mt: 1, fontWeight: 600 }} 
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, fontSize: '1.1rem' }} />
                  Personal Information
                </Typography>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: '40px' }}>
                    <Email color="primary" />
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={userData?.email || 'N/A'} 
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: '40px' }}>
                    <Phone color="primary" />
                  </ListItemAvatar>
                  <ListItemText primary="Phone" secondary={userData?.PhoneNumber || 'N/A'} />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: '40px' }}>
                    <Cake color="primary" />
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Date of Birth" 
                    secondary={userData?.dateOfBirth ? formatDate(userData.dateOfBirth) : 'N/A'} 
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: '40px' }}>
                    <Transgender color="primary" />
                  </ListItemAvatar>
                  <ListItemText primary="Gender" secondary={userData?.gender || 'N/A'} />
                </ListItem>
              </Box>
              
              {/* <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 3, borderRadius: '12px', py: 1.5 }}
              >
                Edit Profile
              </Button> */}
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, borderRadius: '16px', overflow: 'hidden' }}>
            <StyledTabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{
                background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <StyledTab label="Appointments" icon={<CalendarToday />} />
              <StyledTab label="Prescriptions" icon={<Medication />} />
              <StyledTab label="My Doctors" icon={<LocalHospital />} />
            </StyledTabs>

            <Box sx={{ pt: 2, px: 3, pb: 3 }}>


            {activeTab === 0 && (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Upcoming & Past Appointments
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {appointments.length} total
      </Typography>
    </Box>
    
    {appointments.length === 0 ? (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
        borderRadius: '12px'
      }}>
        <CalendarToday sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Appointments Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', mx: 'auto' }}>
          You don't have any appointments scheduled yet. Book one to get started.
        </Typography>
        <Button variant="contained" sx={{ mt: 3, borderRadius: '12px', px: 4 }}>
          Book Appointment
        </Button>
      </Box>
    ) : (
      <Grid container spacing={2}>
        {appointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment._id}>
            <StyledCard>
              <CardContent sx={{ p: 2 }}>
                {/* Doctor Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={doctors[appointment.doctorId._id]?.profilePic}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Dr. {doctors[appointment.doctorId._id]?.Firstname} {doctors[appointment.doctorId._id]?.Lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctors[appointment.doctorId._id]?.specialization || 'General Practitioner'}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Doctor Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DoctorRating 
                    doctorId={appointment.doctorId._id} 
                    doctors={doctors} 
                  />
                </Box>
                
                {/* Contact Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {doctors[appointment.doctorId._id]?.phoneNumber || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {doctors[appointment.doctorId._id]?.email || 'N/A'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                {/* Appointment Details */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Appointment Details
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {formatDate(appointment.appointmentDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {appointment.appointmentTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(appointment.status)}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Status: <strong>{appointment.status}</strong>
                  </Typography>
                </Box>
                
                {appointment.cancelReason && (
                  <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>
                    <strong>Cancel Reason:</strong> {appointment.cancelReason}
                  </Alert>
                )}
                
                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {appointment.status === 'Completed' && !appointment.reviewed && (
                    <Button 
                      variant="outlined" 
                      startIcon={<RateReview />}
                      onClick={() => handleOpenReview(appointment)}
                      fullWidth
                      sx={{ borderRadius: '8px' }}
                    >
                      Review
                    </Button>
                  )}
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
)}



              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Prescriptions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prescriptions.length} total
                    </Typography>
                  </Box>
                  
                  {prescriptions.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 6,
                      background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
                      borderRadius: '12px'
                    }}>
                      <Medication sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Prescriptions Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', mx: 'auto' }}>
                        You don't have any prescriptions yet. Your prescriptions will appear here after visits.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {prescriptions.map((prescription) => (
                        <StyledAccordion key={prescription._id}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <ListItemAvatar>
                                <Avatar 
                                  src={doctors[prescription.doctorId._id]?.profilePic}
                                  sx={{ width: 48, height: 48 }}
                                >
                                  {doctors[prescription.doctorId._id]?.Firstname?.charAt(0)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Prescription from Dr. {doctors[prescription.doctorId._id]?.Firstname}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(prescription.createdAt)} • {prescription.medications?.length || 0} medications
                                  </Typography>
                                }
                                sx={{ ml: 2 }}
                              />
                              <Chip 
                                label={prescription.followUpDate ? 'Follow-up needed' : 'Completed'} 
                                color={prescription.followUpDate ? 'warning' : 'success'} 
                                size="small"
                                sx={{ ml: 'auto' }}
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Diagnosis & Treatment
                                </Typography>
                                <Card variant="outlined" sx={{ borderRadius: '12px', p: 2, mb: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Diagnosis:
                                  </Typography>
                                  <Typography variant="body2" paragraph>
                                    {prescription.diagnosis || 'No diagnosis provided'}
                                  </Typography>
                                  
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Additional Notes:
                                  </Typography>
                                  <Typography variant="body2">
                                    {prescription.notes || 'No additional notes provided'}
                                  </Typography>
                                </Card>
                                
                                {prescription.followUpDate && (
                                  <Alert severity="info" sx={{ borderRadius: '12px' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      Follow-up Recommended
                                    </Typography>
                                    <Typography variant="body2">
                                      Please schedule a follow-up by {formatDate(prescription.followUpDate)}
                                    </Typography>
                                  </Alert>
                                )}
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Prescribed Medications
                                </Typography>
                                {prescription.medications?.length > 0 ? (
                                  <List dense sx={{ 
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    p: 1
                                  }}>
                                    {prescription.medications.map((med, index) => (
                                      <ListItem 
                                        key={index} 
                                        sx={{ 
                                          py: 1.5,
                                          borderBottom: '1px solid',
                                          borderColor: 'divider',
                                          '&:last-child': {
                                            borderBottom: 'none'
                                          }
                                        }}
                                      >
                                        <ListItemAvatar>
                                          <Avatar sx={{ 
                                            width: 32, 
                                            height: 32,
                                            bgcolor: 'primary.light',
                                            color: 'primary.dark'
                                          }}>
                                            <Medication sx={{ fontSize: '1rem' }} />
                                          </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                              {med.medicineName || 'Unnamed medication'}
                                            </Typography>
                                          }
                                          secondary={
                                            <>
                                              <Typography variant="body2">
                                                {med.dosage || 'N/A'} • {med.frequency || 'N/A'} for {med.duration || 'N/A'}
                                              </Typography>
                                              {med.instructions && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                  <em>Instructions: {med.instructions}</em>
                                                </Typography>
                                              )}
                                            </>
                                          }
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    No medications listed in this prescription
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </StyledAccordion>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Healthcare Team
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Object.keys(doctors).length} doctors
                    </Typography>
                  </Box>
                  
                  {Object.keys(doctors).length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 6,
                      background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
                      borderRadius: '12px'
                    }}>
                      <LocalHospital sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Doctors Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', mx: 'auto' }}>
                        Your healthcare providers will appear here after you have appointments.
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {Object.values(doctors).map((doctor) => (
                        <Grid item xs={12} sm={6} key={doctor._id || doctor.id}>
                          <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                              <Box display="flex" alignItems="flex-start" mb={2}>
                                <Avatar 
                                  src={doctor.profilePic} 
                                  sx={{ 
                                    width: 72, 
                                    height: 72, 
                                    mr: 3,
                                    border: '2px solid',
                                    borderColor: 'primary.main'
                                  }}
                                >
                                  {doctor.Firstname?.charAt(0)}{doctor.Lastname?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Dr. {doctor.Firstname} {doctor.Lastname}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {doctor.specialization || 'General Practitioner'}
                                  </Typography>
                                  <DoctorRating doctorId={doctor._id || doctor.id} doctors={doctors} />
                                </Box>
                              </Box>
                              
                              <Divider sx={{ my: 2 }} />
                              
                              <Box>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                  <Work sx={{ fontSize: '1rem', mr: 1.5, color: 'primary.main' }} />
                                  <span>
                                    <strong>Experience:</strong> {doctor.experience || 'N/A'} years
                                  </span>
                                </Typography>
                                
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                  <School sx={{ fontSize: '1rem', mr: 1.5, color: 'primary.main' }} />
                                  <span>
                                    <strong>Qualification:</strong> {doctor.qualification || 'N/A'}
                                  </span>
                                </Typography>
                                
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                  <Phone sx={{ fontSize: '1rem', mr: 1.5, color: 'primary.main' }} />
                                  <span>
                                    <strong>Contact:</strong> {doctor.phoneNumber || 'N/A'}
                                  </span>
                                </Typography>
                              </Box>

                              {doctor.reviews?.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Recent Reviews
                                  </Typography>
                                  <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {doctor.reviews.slice(0, 3).map((review, index) => (
                                      <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                        <ListItemAvatar>
                                          <Avatar sx={{ width: 32, height: 32 }}
                                           src={review.userId?.userPic || ''}
                                           >
                                             {!review.userId?.userPic && 
                                               `${review.userId?.Firstname?.charAt(0) || 'A'}${review.userId?.Lastname?.charAt(0) || ''}`
                                             }                                           
                                          </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                              <MuiRating value={review.rating} size="small" readOnly />
                                              <Typography variant="body2" sx={{ ml: 1 }}>
                                                {review.userId?.Firstname || 'Anonymous'}
                                                {review.userId?.Lastname || 'Anonymous'}
                                              </Typography>
                                            </Box>
                                          }
                                          secondary={review.review}
                                          secondaryTypographyProps={{ sx: { fontStyle: 'italic' } }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                  {doctor.reviews.length > 3 && (
                                    <Button size="small" sx={{ mt: 1 }}>
                                      View all {doctor.reviews.length} reviews
                                    </Button>
                                  )}
                                </Box>
                              )}
                              
                              {/* <Box sx={{ display: 'flex', mt: 3 }}>
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  sx={{ 
                                    mr: 2,
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                  }}
                                >
                                  View Profile
                                </Button>
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  sx={{ 
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                  }}
                                >
                                  Book Appointment
                                </Button>
                              </Box> */}
                            </CardContent>
                          </StyledCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Review Modal */}
      {reviewModalOpen && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={handleCloseReview}
          doctorId={selectedAppointment?.doctorId._id}
          appointmentId={selectedAppointment?._id}
          userId={userId}
        />
      )}
    </Container>
  );
};

export default EHRDashboard;