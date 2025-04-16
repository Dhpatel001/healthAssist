import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent, 
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Badge,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tabs,
  Tab,
  InputAdornment,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Rating,
  CardMedia,
  CardActionArea,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  CalendarToday,
  People,
  MedicalServices,
  Notifications,
  Videocam,
  BarChart,
  Person,
  Settings,
  Logout,
  Schedule,
  Cancel,
  CheckCircle,
  Pending,
  Edit,
  AccessTime,
  Today,
  Star,
  RateReview,
  Payment,
  Receipt,
  Add,
  ArrowForward,
  LocalHospital,
  ExitToApp,
  Search,
  Work,
  School,
  Chat as ChatIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export const UserHomePage = () => {



// Add these new state variables
const [socket, setSocket] = useState(null);
const [healthGoals, setHealthGoals] = useState([]);
const [goalCategory, setGoalCategory] = useState('Exercise');
const [newGoal, setNewGoal] = useState({
  title: '',
  message: '',
  category: 'Exercise',
  target: 0,
  current: 0,
  unit: ''
});
const [openGoalDialog, setOpenGoalDialog] = useState(false);



  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [healthInsights, setHealthInsights] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [appointmentsTab, setAppointmentsTab] = useState('upcoming');
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  // const [newAppointment, setNewAppointment] = useState({
  //   doctorId: '',
  //   appointmentDate: '',
  //   appointmentTime: '',
  // });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [unreadInsightsCount, setUnreadInsightsCount] = useState(0);
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [insightFilter, setInsightFilter] = useState('all');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [availableTimes] = useState([
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [openDoctorProfileDialog, setOpenDoctorProfileDialog] = useState(false);
  const [doctorProfileTab, setDoctorProfileTab] = useState('overview');

  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    patientName: '',
    phoneNumber: '',
    bookingFor: 'Myself'
  });

  const navigate = useNavigate();

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatDateTime = (dateString, timeString) => {
    try {
      if (!dateString) return 'No date set';
      const date = format(parseISO(dateString), 'MMMM d, yyyy');
      return timeString ? `${date} at ${timeString}` : date;
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Completed': return 'info';
      case 'Cancelled': return 'error';
      case 'Started': return 'primary';
      default: return 'default';
    }
  };

  const handleOpenChat = (doctor, appointment = null) => {
    if (appointment) {
      navigate(`/user/chat/${appointment._id}`);
    } else {
      navigate(`/user/chat/doctor/${doctor._id}`);
    }
  };

  const fetchUserData = async () => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userResponse = await axios.get(`/userbyid/${userId}`);
      const userData = userResponse.data?.data || null;
      setUser(userData);
      setEditedUser(userData || {});

      const [
        appointmentsResponse,
        insightsResponse,
        unreadCountResponse,
        doctorsResponse,
        specializationsResponse
      ] = await Promise.all([
        axios.get(`/appointment/appointments/user/${userId}`).catch(() => ({ data: { data: [] } })),
        axios.get(`/health/user/${userId}`).catch(() => ({ data: { data: [] } })),
        axios.get(`/user/${userId}/unread-count`).catch(() => ({ data: { data: 0 } })),
        axios.get('/doctor').catch(() => ({ data: { data: [] } })),
        axios.get('/specializations').catch(() => ({ data: { data: [] } }))
      ]);

      setAppointments(appointmentsResponse.data?.data || []);
      setHealthInsights(insightsResponse.data?.data || []);
      setFilteredInsights(insightsResponse.data?.data || []);
      setUnreadInsightsCount(unreadCountResponse.data?.data || 0);
      setDoctors(doctorsResponse.data?.data || []);
      setSpecializations(specializationsResponse.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
      showSnackbar('Failed to load data. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!healthInsights) return;
    
    let filtered;
    if (insightFilter === 'all') {
      filtered = healthInsights;
    } else if (insightFilter === 'unread') {
      filtered = healthInsights.filter(insight => !insight.isRead);
    } else {
      filtered = healthInsights.filter(insight => insight.alertType === insightFilter);
    }
    setFilteredInsights(filtered);
  }, [insightFilter, healthInsights]);

  const upcomingAppointments = appointments
    ?.filter(appt => appt.status === 'Confirmed' || appt.status === 'Pending' || appt.status === 'Started')
    ?.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)) || [];

  const pastAppointments = appointments
    ?.filter(appt => appt.status === 'Completed' || appt.status === 'Cancelled')
    ?.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)) || [];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.Firstname?.toLowerCase().includes(doctorSearchTerm.toLowerCase()) || 
                         doctor.Lastname?.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
                         doctor.specialization?.toLowerCase().includes(doctorSearchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleAppointmentsTabChange = (event, newValue) => {
    setAppointmentsTab(newValue);
  };

  const handleDoctorProfileTabChange = (event, newValue) => {
    setDoctorProfileTab(newValue);
  };

  const handleOpenAppointmentDialog = (doctor = null) => {
    setOpenAppointmentDialog(true);
    setNewAppointment({
      doctorId: doctor ? doctor._id : '',
      appointmentDate: '',
      appointmentTime: '',
    });
    setSelectedDoctor(doctor || null);
    setSelectedSpecialty(doctor ? doctor.specialization : '');
  };

  const handleCloseAppointmentDialog = () => {
    setOpenAppointmentDialog(false);
  };

  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    setSelectedDoctor(doctor || null);
  };

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('id');
      
      // Use the user's name if booking for self
      const patientName = newAppointment.bookingFor === 'Myself' 
        ? `${user.Firstname} ${user.Lastname}`
        : newAppointment.patientName;
  
      const appointmentData = {
        doctorId: newAppointment.doctorId,
        userId,
        firstName: patientName.split(' ')[0],
        lastName: patientName.split(' ')[1] || '',
        phoneNumber: newAppointment.phoneNumber || user.PhoneNumber,
        appointmentDate: newAppointment.appointmentDate,
        appointmentTime: newAppointment.appointmentTime,
        status: 'Pending'
      };
  
      const response = await axios.post('/appointment/appointment', appointmentData);
      
      // Create appointment reminder insight
      await axios.post(`/${newAppointment.doctorId}/insights`, {
        userId: userId,
        title: `Appointment with Dr. ${selectedDoctor.Lastname}`,
        message: `Your appointment is scheduled for ${format(newAppointment.appointmentDate, 'MMMM d')} at ${newAppointment.appointmentTime}`,
        alertType: "Appointment Reminder",
        priority: "High"
      });
  
      setAppointments(prev => [...prev, response.data.data]);
      setOpenAppointmentDialog(false);
      setLoading(false);
      showSnackbar('Appointment created successfully', 'success');
      fetchUserData();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setLoading(false);
      showSnackbar(err.response?.data?.message || 'Failed to create appointment', 'error');
    }
  };


  const handleOpenDoctorProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDoctorProfileDialog(true);
    setDoctorProfileTab('overview');
  };

  const handleCloseDoctorProfile = () => {
    setOpenDoctorProfileDialog(false);
  };

  const handleOpenCancelDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason('');
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCancelAppointment = async () => {
    try {
      setLoading(true);
      await axios.patch(`/appointment/cancel/${selectedAppointment._id}`, {
        cancelReason
      });

      setOpenCancelDialog(false);
      setLoading(false);
      showSnackbar('Appointment cancelled successfully', 'success');
      fetchUserData();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setLoading(false);
      showSnackbar(err.response?.data?.message || 'Failed to cancel appointment', 'error');
    }
  };

  const handleMarkInsightAsRead = async (insightId) => {
    try {
      await axios.patch(`/${insightId}/mark-read`);
      setHealthInsights(prev => prev.map(insight =>
        insight._id === insightId ? { ...insight, isRead: true } : insight
      ));
      setUnreadInsightsCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking insight as read:', err);
      showSnackbar('Failed to mark as read', 'error');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/updateduser/${user._id}`, editedUser);
      setUser(response.data.data);
      setEditedUser(response.data.data);
      setProfileEditMode(false);
      setLoading(false);
      showSnackbar('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      setLoading(false);
      showSnackbar(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);  // Changed from 'file' to 'image'
      formData.append("userId", user._id);  // Add userId to formData
      
      const response = await axios.put(`/updateuserphoto/${user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUser(response.data.data);
      setEditedUser(response.data.data);
      setLoading(false);
      showSnackbar('Profile photo updated successfully', 'success');
    } catch (err) {
      console.error('Error updating photo:', err);
      setLoading(false);
      showSnackbar('Failed to update profile photo', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    navigate('/login');
  };


// Add this useEffect for socket.io
// Replace your socket.io useEffect with this:
useEffect(() => {
  // Use your actual backend URL here instead of process.env
  const socket = io('http://localhost:3000', {
    withCredentials: true,
    transports: ['websocket']
  });

  const userId = localStorage.getItem('id');
  if (userId) {
    socket.emit('join_health_insights', userId);
  }

  socket.on('new_insight', (insight) => {
    if (insight.userId === localStorage.getItem('id')) {
      setHealthInsights(prev => [insight, ...prev]);
      setFilteredInsights(prev => [insight, ...prev]);
      if (!insight.isRead) {
        setUnreadInsightsCount(prev => prev + 1);
      }
      showSnackbar(`New health insight: ${insight.title}`, 'info');
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  setSocket(socket);

  return () => {
    socket.off('new_insight');
    socket.off('connect_error');
    socket.disconnect();
  };
}, []);
// Add this useEffect for real-time updates
useEffect(() => {
  if (!socket) return;

  socket.on('newInsight', (insight) => {
    if (insight.userId === localStorage.getItem('id')) {
      setHealthInsights(prev => [insight, ...prev]);
      setFilteredInsights(prev => [insight, ...prev]);
      if (!insight.isRead) {
        setUnreadInsightsCount(prev => prev + 1);
      }
    }
  });

  return () => {
    socket.off('newInsight');
  };
}, [socket]);

// Add this function to fetch goals
const fetchHealthGoals = async () => {
  try {
    const response = await axios.get(`/user/${localStorage.getItem('id')}/goals/${goalCategory}`);
    setHealthGoals(response.data.data);
  } catch (err) {
    console.error('Error fetching health goals:', err);
  }
};

// Add this useEffect to fetch goals when category changes
useEffect(() => {
  if (selectedTab === 'health-insights') {
    fetchHealthGoals();
  }
}, [goalCategory, selectedTab]);

// Add this function to create a new goal
const handleCreateGoal = async () => {
  try {
    await axios.post('/goals', {
      userId: localStorage.getItem('id'),
      title: newGoal.title,
      message: newGoal.message,
      category: newGoal.category,
      target: newGoal.target,
      current: newGoal.current,
      unit: newGoal.unit
    });
    setOpenGoalDialog(false);
    fetchHealthGoals();
    showSnackbar('Health goal created successfully', 'success');
  } catch (err) {
    console.error('Error creating goal:', err);
    showSnackbar('Failed to create health goal', 'error');
  }
};

// Add this function to update goal progress
const handleUpdateGoalProgress = async (goalId, newProgress) => {
  try {
    await axios.patch(`/goals/${goalId}/progress`, { current: newProgress });
    fetchHealthGoals();
  } catch (err) {
    console.error('Error updating goal progress:', err);
    showSnackbar('Failed to update goal progress', 'error');
  }
};


  if (loading && !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchUserData}>Retry</Button>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        {/* Sidebar */}
        <Box sx={{ width: 250, bgcolor: '#1e3a8a', color: 'white', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2 }}>
            <Avatar
              src={user?.userPic}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user?.Firstname} {user?.Lastname}
              </Typography>
              <Typography variant="body2" sx={{ color: '#93c5fd' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: '#3b82f6', mb: 2 }} />

          <List>
            <ListItem
              button
              selected={selectedTab === 'dashboard'}
              onClick={() => setSelectedTab('dashboard')}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': { bgcolor: '#3b82f6' },
                '&:hover': { bgcolor: '#3b82f6' }
              }}
            >
              <ListItemAvatar>
                <Person sx={{ color: 'white' }} />
              </ListItemAvatar>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              button
              selected={selectedTab === 'appointments'}
              onClick={() => setSelectedTab('appointments')}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': { bgcolor: '#3b82f6' },
                '&:hover': { bgcolor: '#3b82f6' }
              }}
            >
              <ListItemAvatar>
                <CalendarToday sx={{ color: 'white' }} />
              </ListItemAvatar>
              <ListItemText primary="Appointments" />
            </ListItem>

            <ListItem
              button
              selected={selectedTab === 'doctors'}
              onClick={() => setSelectedTab('doctors')}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': { bgcolor: '#3b82f6' },
                '&:hover': { bgcolor: '#3b82f6' }
              }}
            >
              <ListItemAvatar>
                <MedicalServices sx={{ color: 'white' }} />
              </ListItemAvatar>
              <ListItemText primary="Find Doctors" />
            </ListItem>

            <ListItem
              button
              selected={selectedTab === 'health-insights'}
              onClick={() => setSelectedTab('health-insights')}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': { bgcolor: '#3b82f6' },
                '&:hover': { bgcolor: '#3b82f6' }
              }}
            >
              <ListItemAvatar>
                <Badge badgeContent={unreadInsightsCount} color="error">
                  <Notifications sx={{ color: 'white' }} />
                </Badge>
              </ListItemAvatar>
              <ListItemText primary="Health Insights" />
            </ListItem>

            <ListItem
              button
              selected={selectedTab === 'profile'}
              onClick={() => setSelectedTab('profile')}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': { bgcolor: '#3b82f6' },
                '&:hover': { bgcolor: '#3b82f6' }
              }}
            >
              <ListItemAvatar>
                <Settings sx={{ color: 'white' }} />
              </ListItemAvatar>
              <ListItemText primary="Profile Settings" />
            </ListItem>
          </List>

          <Divider sx={{ bgcolor: '#3b82f6', my: 2 }} />

          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              '&:hover': { bgcolor: '#3b82f6' }
            }}
          >
            <ListItemAvatar>
              <ExitToApp sx={{ color: 'white' }} />
            </ListItemAvatar>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
              {selectedTab === 'dashboard' && 'Patient Dashboard'}
              {selectedTab === 'appointments' && 'Appointments'}
              {selectedTab === 'doctors' && 'Find Doctors'}
              {selectedTab === 'health-insights' && 'Health Insights'}
              {selectedTab === 'profile' && 'Profile Settings'}
            </Typography>
            {selectedTab === 'appointments' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAppointmentDialog}
              >
                New Appointment
              </Button>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {selectedTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#e0f2fe', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" color="text.secondary">
                            Upcoming Appointments
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {upcomingAppointments.length}
                          </Typography>
                        </Box>
                        <Box sx={{ bgcolor: '#bae6fd', p: 2, borderRadius: '50%', height:"60px"}}>
                          <CalendarToday sx={{ color: '#0369a1', fontSize: 30 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#dcfce7', borderRadius: 2 }}>
                    <CardContent sx={{height:"114px"}}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" color="text.secondary">
                            Health Insights
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {healthInsights.length}
                          </Typography>
                          <Typography variant="body2">
                            {unreadInsightsCount} unread
                          </Typography>
                        </Box>
                        <Box sx={{ bgcolor: '#bbf7d0', p: 2, borderRadius: '50%', height:"60px" }}>
                          <Notifications sx={{ color: '#15803d', fontSize: 30 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#fef3c7', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" color="text.secondary">
                            Past Appointments
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {pastAppointments.length}
                          </Typography>
                        </Box>
                        <Box sx={{ bgcolor: '#fde68a', p: 2, borderRadius: '50%' ,height:"60px" }}>
                          <CheckCircle sx={{ color: '#b45309', fontSize: 30 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Upcoming Appointments */}
              <Card sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Upcoming Appointments
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => setSelectedTab('appointments')}
                    >
                      View All
                    </Button>
                  </Box>

                  {upcomingAppointments.length > 0 ? (
                    <List>
                      {upcomingAppointments.slice(0, 3).map((appointment) => (
                        <ListItem
                          key={appointment._id}
                          sx={{
                            borderBottom: '1px solid #e5e7eb',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={appointment.doctorId?.profilePic} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`Dr. ${appointment.doctorId?.Firstname || ''} ${appointment.doctorId?.Lastname || ''}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  Status: {appointment.status}
                                </Typography>
                              </>
                            }
                          />
                          <Box>
                            {appointment.status === 'Started' && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<ChatIcon />}
                                onClick={() => handleOpenChat(appointment.doctorId, appointment)}
                                sx={{ mr: 1 }}
                              >
                                Chat
                              </Button>
                            )}
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                      No upcoming appointments
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Health Insights */}
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Recent Health Insights
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => setSelectedTab('health-insights')}
                    >
                      View All
                    </Button>
                  </Box>

                  {filteredInsights.length > 0 ? (
                    <List>
                      {filteredInsights.slice(0, 3).map((insight) => (
                        <ListItem
                          key={insight._id}
                          sx={{
                            backgroundColor: insight.isRead ? 'background.paper' : 'action.selected',
                            borderRadius: 1,
                            mb: 1
                          }}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => handleMarkInsightAsRead(insight._id)}
                            >
                              {insight.isRead ? <CheckCircle color="disabled" /> : <Notifications color="primary" />}
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar src={insight.doctorId?.profilePic}>
                              {insight.doctorId?.Firstname?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={insight.title}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {insight.alertType}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {format(parseISO(insight.createdAt), 'MMM d, yyyy h:mm a')}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                      No health insights
                    </Typography>
                  )}
                </CardContent>

         
              </Card>
            </>
          )}

          {selectedTab === 'appointments' && (
            <>
              <Tabs
                value={appointmentsTab}
                onChange={handleAppointmentsTabChange}
                sx={{ mb: 3 }}
              >
                <Tab label="Upcoming" value="upcoming" />
                <Tab label="Past" value="past" />
              </Tabs>

              {appointmentsTab === 'upcoming' && (
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <List>
                        {upcomingAppointments.map((appointment) => (
                          <ListItem
                            key={appointment._id}
                            sx={{
                              borderBottom: '1px solid #e5e7eb',
                              '&:last-child': { borderBottom: 'none' }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={appointment.doctorId?.profilePic} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={`Dr. ${appointment.doctorId?.Firstname || ''} ${appointment.doctorId?.Lastname || ''}`}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    Status: {appointment.status}
                                  </Typography>
                                </>
                              }
                            />
                            <Box>
                              {appointment.status === 'Started' && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  startIcon={<ChatIcon />}
                                  onClick={() => handleOpenChat(appointment.doctorId, appointment)}
                                  sx={{ mr: 1 }}
                                >
                                  Chat
                                </Button>
                              )}
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleOpenCancelDialog(appointment)}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                        No upcoming appointments
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}

              {appointmentsTab === 'past' && (
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    {pastAppointments.length > 0 ? (
                      <List>
                        {pastAppointments.map((appointment) => (
                          <ListItem
                            key={appointment._id}
                            sx={{
                              borderBottom: '1px solid #e5e7eb',
                              '&:last-child': { borderBottom: 'none' }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={appointment.doctorId?.profilePic} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={`Dr. ${appointment.doctorId?.Firstname} ${appointment.doctorId?.Lastname}`}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    Status: {appointment.status}
                                    {appointment.cancelReason && ` - Reason: ${appointment.cancelReason}`}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                        No past appointments
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {selectedTab === 'doctors' && (
            <>
              <Card sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search doctors by name or specialty"
                        value={doctorSearchTerm}
                        onChange={(e) => setDoctorSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Filter by Specialty</InputLabel>
                        <Select
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          label="Filter by Specialty"
                        >
                          <MenuItem value="">All Specialties</MenuItem>
                          {specializations.map((specialty) => (
                            <MenuItem key={specialty} value={specialty}>
                              {specialty}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {filteredDoctors.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredDoctors.map((doctor) => (
                    <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea onClick={() => handleOpenDoctorProfile(doctor)}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={doctor.profilePic || '/default-doctor.jpg'}
                            alt={doctor.Firstname}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              Dr. {doctor.Firstname} {doctor.Lastname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {doctor.specialization}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating value={4.5} precision={0.5} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                4.5 (24 reviews)
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                                {doctor.availability === 'fulltime' ? 'Available Full Time' : 
                                 `Available in the ${doctor.availability}`}
                              </Box>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <Box sx={{ p: 2, mt: 'auto' }}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CalendarToday />}
                            onClick={() => handleOpenAppointmentDialog(doctor)}
                            sx={{ mb: 2 }}
                          >
                            Book Appointment
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ChatIcon />}
                            onClick={() => handleOpenChat(doctor)}
                          >
                            Chat with Doctor
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No doctors found matching your search criteria
                </Typography>
              )}
            </>
          )}

          {selectedTab === 'health-insights' && (
            <>
              <Card sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Health Insights
                    </Typography>
                    <Badge badgeContent={unreadInsightsCount} color="error">
                      <Typography variant="subtitle1" color="text.secondary">
                        {unreadInsightsCount} unread
                      </Typography>
                    </Badge>
                  </Box>
                </CardContent>
              </Card>

              <FormControl variant="outlined" sx={{ minWidth: 200, mb: 3 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={insightFilter}
                  onChange={(e) => setInsightFilter(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Insights</MenuItem>
                  <MenuItem value="unread">Unread Only</MenuItem>
                  <MenuItem value="Checkup Reminder">Checkup Reminders</MenuItem>
                  <MenuItem value="Vaccination Alert">Vaccination Alerts</MenuItem>
                  <MenuItem value="Medication Refill">Medication Refills</MenuItem>
                  <MenuItem value="Health Tip">Health Tips</MenuItem>
                  <MenuItem value="Test Result">Test Results</MenuItem>
                </Select>
              </FormControl>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  {filteredInsights.length > 0 ? (
                    <List>
                      {filteredInsights.map((insight) => (
                        <ListItem
                          key={insight._id}
                          sx={{
                            backgroundColor: insight.isRead ? 'background.paper' : 'action.selected',
                            borderRadius: 1,
                            mb: 1
                          }}
                          secondaryAction={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip
                                label={insight.priority}
                                size="small"
                                color={
                                  insight.priority === 'High'
                                    ? 'error'
                                    : insight.priority === 'Medium'
                                    ? 'warning'
                                    : 'success'
                                }
                                sx={{ mr: 1 }}
                              />
                              <IconButton
                                edge="end"
                                onClick={() => handleMarkInsightAsRead(insight._id)}
                              >
                                {insight.isRead ? (
                                  <CheckCircle color="disabled" />
                                ) : (
                                  <Notifications color="primary" />
                                )}
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar src={insight.doctorId?.profilePic}>
                              {insight.doctorId?.Firstname?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={insight.title}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  display="block"
                                >
                                  {insight.message}
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  display="block"
                                >
                                  {insight.alertType} • {format(parseISO(insight.createdAt), 'MMM d, yyyy h:mm a')}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                      No health insights found
                    </Typography>
                  )}
                </CardContent>
              </Card>

        {/* Add goal category tabs */}
        <Box sx={{ display: 'flex', mb: 2 }}>
      <Button
        startIcon={<FitnessCenterIcon />}
        onClick={() => setGoalCategory('Exercise')}
        variant={goalCategory === 'Exercise' ? 'contained' : 'outlined'}
        sx={{ mr: 1 }}
      >
        Exercise
      </Button>
      <Button
        startIcon={<RestaurantIcon />}
        onClick={() => setGoalCategory('Diet')}
        variant={goalCategory === 'Diet' ? 'contained' : 'outlined'}
        sx={{ mr: 1 }}
      >
        Diet
      </Button>
      <Button
        startIcon={<LocalPharmacyIcon />}
        onClick={() => setGoalCategory('Medication')}
        variant={goalCategory === 'Medication' ? 'contained' : 'outlined'}
      >
        Medication
      </Button>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenGoalDialog(true)}
        sx={{ ml: 'auto' }}
      >
        New Goal
      </Button>
    </Box>

    {/* Add goals section */}
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Health Goals
        </Typography>
        {healthGoals.length > 0 ? (
          <Grid container spacing={2}>
            {healthGoals.map((goal) => (
              <Grid item xs={12} md={6} key={goal._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {goal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {goal.message}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        Progress: {goal.goalDetails.current} / {goal.goalDetails.target} {goal.goalDetails.unit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((goal.goalDetails.current / goal.goalDetails.target) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        (goal.goalDetails.current / goal.goalDetails.target) * 100,
                        100
                      )}
                      sx={{ height: 10, borderRadius: 5, mb: 2 }}
                    />
                    <TextField
                      label="Update Progress"
                      type="number"
                      size="small"
                      value={goal.goalDetails.current}
                      onChange={(e) => {
                        const newGoals = [...healthGoals];
                        const goalIndex = newGoals.findIndex(g => g._id === goal._id);
                        newGoals[goalIndex].goalDetails.current = Number(e.target.value);
                        setHealthGoals(newGoals);
                      }}
                      onBlur={(e) => handleUpdateGoalProgress(goal._id, Number(e.target.value))}
                      sx={{ width: 100, mr: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            No health goals found
          </Typography>
        )}
      </CardContent>
    </Card>

    {/* Add goal dialog */}
    <Dialog open={openGoalDialog} onClose={() => setOpenGoalDialog(false)}>
      <DialogTitle>Create New Health Goal</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={newGoal.message}
          onChange={(e) => setNewGoal({ ...newGoal, message: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={newGoal.category}
            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
            label="Category"
          >
            <MenuItem value="Exercise">Exercise</MenuItem>
            <MenuItem value="Diet">Diet</MenuItem>
            <MenuItem value="Medication">Medication</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Target Value"
          type="number"
          fullWidth
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Current Value"
          type="number"
          fullWidth
          value={newGoal.current}
          onChange={(e) => setNewGoal({ ...newGoal, current: Number(e.target.value) })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Unit (e.g., steps, ml, mg)"
          fullWidth
          value={newGoal.unit}
          onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenGoalDialog(false)}>Cancel</Button>
        <Button
          onClick={handleCreateGoal}
          disabled={!newGoal.title || !newGoal.message || !newGoal.target}
          variant="contained"
        >
          Create Goal
        </Button>
      </DialogActions>
    </Dialog>

            </>
          )}




          {selectedTab === 'profile' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-pic-upload"
                      type="file"
                      onChange={handlePhotoUpload}
                    />
                    <label htmlFor="profile-pic-upload">
                      <Avatar
                        src={user?.userPic}
                        sx={{ width: 120, height: 120, mb: 2, cursor: 'pointer' }}
                      />
                    </label>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {user?.Firstname} {user?.Lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>

                    <Box sx={{ mt: 3, width: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Contact Information
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {user?.email}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Phone:</strong> {user?.PhoneNumber}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Personal Information
                      </Typography>
                      {profileEditMode ? (
                        <Box>
                          <Button
                            variant="outlined"
                            sx={{ mr: 2 }}
                            onClick={() => setProfileEditMode(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleUpdateProfile}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => setProfileEditMode(true)}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          fullWidth
                          value={profileEditMode ? editedUser.Firstname || '' : user?.Firstname || ''}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, Firstname: e.target.value })
                          }
                          disabled={!profileEditMode}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          fullWidth
                          value={profileEditMode ? editedUser.Lastname || '' : user?.Lastname || ''}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, Lastname: e.target.value })
                          }
                          disabled={!profileEditMode}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          fullWidth
                          value={user?.email || ''}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone Number"
                          fullWidth
                          value={profileEditMode ? editedUser.PhoneNumber || '' : user?.PhoneNumber || ''}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, PhoneNumber: e.target.value })
                          }
                          disabled={!profileEditMode}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Date of Birth"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={
                            profileEditMode
                              ? editedUser.dateOfBirth
                                ? format(new Date(editedUser.dateOfBirth), 'yyyy-MM-dd')
                                : ''
                              : user?.dateOfBirth
                              ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd')
                              : ''
                          }
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              dateOfBirth: new Date(e.target.value).getTime()
                            })
                          }
                          disabled={!profileEditMode}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!profileEditMode}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={profileEditMode ? editedUser.gender || '' : user?.gender || ''}
                            onChange={(e) =>
                              setEditedUser({ ...editedUser, gender: e.target.value })
                            }
                            label="Gender"
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Age"
                          type="number"
                          fullWidth
                          value={profileEditMode ? editedUser.Age || '' : user?.Age || ''}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, Age: parseInt(e.target.value) })
                          }
                          disabled={!profileEditMode}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        Change Password
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/user/resetpassword')}
                      >
                        Reset Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}




         {/* New Appointment Dialog */}
<Dialog open={openAppointmentDialog} onClose={handleCloseAppointmentDialog} maxWidth="md" fullWidth>
  <DialogTitle>Book New Appointment</DialogTitle>
  <DialogContent>
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Specialization</InputLabel>
          <Select
            value={selectedSpecialty || ''}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            label="Select Specialization"
          >
            {specializations.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Doctor</InputLabel>
          <Select
            name="doctorId"
            value={newAppointment.doctorId}
            onChange={(e) => {
              handleAppointmentInputChange(e);
              handleDoctorSelect(e.target.value);
            }}
            label="Select Doctor"
            disabled={!selectedSpecialty}
          >
            {doctors
              .filter(doctor => doctor.specialization === selectedSpecialty)
              .map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  Dr. {doctor.Firstname} {doctor.Lastname}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {selectedDoctor && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={selectedDoctor.profilePic} sx={{ mr: 2 }} />
                <Typography variant="h6">
                  Dr. {selectedDoctor.Firstname} {selectedDoctor.Lastname}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Specialization:</strong> {selectedDoctor.specialization}
              </Typography>
            </CardContent>
          </Card>
        )}

        <TextField
          label="Appointment Date"
          type="date"
          fullWidth
          name="appointmentDate"
          value={newAppointment.appointmentDate}
          onChange={handleAppointmentInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          inputProps={{ min: format(new Date(), 'yyyy-MM-dd') }}
        />

        {newAppointment.appointmentDate && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Available Time Slots</InputLabel>
            <Select
              name="appointmentTime"
              value={newAppointment.appointmentTime}
              onChange={handleAppointmentInputChange}
              label="Available Time Slots"
            >
              {availableTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
          Appointment For:
        </Typography>
        <RadioGroup
          row
          name="bookingFor"
          value={newAppointment.bookingFor}
          onChange={(e) => setNewAppointment(prev => ({
            ...prev,
            bookingFor: e.target.value,
            patientName: e.target.value === 'Myself' ? `${user?.Firstname} ${user?.Lastname}` : ''
          }))}
          sx={{ mb: 3 }}
        >
          {['Myself', 'Family', 'Other'].map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio color="primary" />}
              label={option}
            />
          ))}
        </RadioGroup>

        <TextField
          fullWidth
          label="Patient Name"
          name="patientName"
          value={newAppointment.patientName}
          onChange={handleAppointmentInputChange}
          disabled={newAppointment.bookingFor === 'Myself'}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={newAppointment.phoneNumber || user?.PhoneNumber || ''}
          onChange={handleAppointmentInputChange}
          sx={{ mb: 3 }}
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseAppointmentDialog}>Cancel</Button>
    <Button
      onClick={handleCreateAppointment}
      disabled={
        !newAppointment.doctorId ||
        !newAppointment.appointmentDate ||
        !newAppointment.appointmentTime ||
        !newAppointment.patientName
      }
      variant="contained"
    >
      Book Appointment
    </Button>
  </DialogActions>
</Dialog>

          {/* Doctor Profile Dialog */}
          <Dialog 
            open={openDoctorProfileDialog} 
            onClose={handleCloseDoctorProfile} 
            maxWidth="md" 
            fullWidth
          >
            {selectedDoctor && (
              <>
                <DialogTitle>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={selectedDoctor.profilePic} sx={{ width: 60, height: 60, mr: 2 }} />
                    <Box>
                      <Typography variant="h5">
                        Dr. {selectedDoctor.Firstname} {selectedDoctor.Lastname}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {selectedDoctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Tabs
                    value={doctorProfileTab}
                    onChange={handleDoctorProfileTabChange}
                    sx={{ mb: 3 }}
                  >
                    <Tab label="Overview" value="overview" />
                    <Tab label="About" value="about" />
                    <Tab label="Availability" value="availability" />
                  </Tabs>

                  {doctorProfileTab === 'overview' && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          Professional Information
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body1">
                            <strong>Qualification:</strong> {selectedDoctor.qualification}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Experience:</strong> {selectedDoctor.experience}
                          </Typography>
                        </Box>

                        <Typography variant="h6" gutterBottom>
                          Contact Information
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Email:</strong> {selectedDoctor.email}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Phone:</strong> {selectedDoctor.phoneNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Book an Appointment
                            </Typography>
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<CalendarToday />}
                              onClick={() => {
                                handleCloseDoctorProfile();
                                handleOpenAppointmentDialog(selectedDoctor);
                              }}
                              sx={{ mb: 2 }}
                            >
                              Book Now
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<ChatIcon />}
                              onClick={() => {
                                handleCloseDoctorProfile();
                                handleOpenChat(selectedDoctor);
                              }}
                            >
                              Chat with Doctor
                            </Button>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              Available {selectedDoctor.availability === 'fulltime' ? 
                                'Full Time' : `in the ${selectedDoctor.availability}`}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  )}

                  {doctorProfileTab === 'about' && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        About Dr. {selectedDoctor.Firstname}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {selectedDoctor.about || 'No information available.'}
                      </Typography>
                    </Box>
                  )}

                  {doctorProfileTab === 'availability' && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Availability
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {selectedDoctor.availability === 'fulltime' ? 
                          'Available Full Time' : 
                          `Available in the ${selectedDoctor.availability}`}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Typical working hours: 9:00 AM - 5:00 PM
                      </Typography>
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDoctorProfile}>Close</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleCloseDoctorProfile();
                      handleOpenAppointmentDialog(selectedDoctor);
                    }}
                  >
                    Book Appointment
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          {/* Cancel Appointment Dialog */}
          <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <>
                  <Typography variant="body1" gutterBottom>
                    Are you sure you want to cancel your appointment with Dr.{' '}
                    {selectedAppointment.doctorId?.Firstname} {selectedAppointment.doctorId?.Lastname} on{' '}
                    {formatDateTime(selectedAppointment.appointmentDate, selectedAppointment.appointmentTime)}?
                  </Typography>
                  <TextField
                    label="Reason for cancellation"
                    fullWidth
                    multiline
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCancelDialog}>No, Keep It</Button>
              <Button
                onClick={handleCancelAppointment}
                disabled={!cancelReason}
                color="error"
                variant="contained"
              >
                Yes, Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default UserHomePage;