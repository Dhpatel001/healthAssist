import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ListItemIcon
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
  MailOutline,
  Phone,
  School,
  Work,
  Add,
  Delete,
  NoteAdd,
  FileDownload,
  Search
} from '@mui/icons-material';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const localizer = momentLocalizer(moment);

export const DoctorHomePage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0
  });




  const [startedAppointments, setStartedAppointments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [appointmentStatus, setAppointmentStatus] = useState('upcoming');
  const [newAvailability, setNewAvailability] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [activeChartTab, setActiveChartTab] = useState('weekly');
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [newAppointmentTime, setNewAppointmentTime] = useState('');
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);
  

  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medications: [{ medicineName: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
    followUpDate: ''
  });
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [calendarView, setCalendarView] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientAppointments, setSelectedPatientAppointments] = useState([]);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0]
  });

 
  const [analyticsData, setAnalyticsData] = useState({
    dailyStats: [],
    statusStats: [],
    range: 'weekly'
  });
 

  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const InfoRow = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Typography variant="body2">
        {text}
      </Typography>
    </Box>
  );

  // Sample data for charts
  const appointmentData = {
    weekly: [
      { name: 'Mon', appointments: 5 },
      { name: 'Tue', appointments: 8 },
      { name: 'Wed', appointments: 6 },
      { name: 'Thu', appointments: 9 },
      { name: 'Fri', appointments: 7 },
      { name: 'Sat', appointments: 4 },
      { name: 'Sun', appointments: 2 },
    ],
    monthly: [
      { name: 'Week 1', appointments: 20 },
      { name: 'Week 2', appointments: 25 },
      { name: 'Week 3', appointments: 18 },
      { name: 'Week 4', appointments: 22 },
    ]
  };

  const specializationData = [
    { name: 'Cardiology', patients: 24 },
    { name: 'Neurology', patients: 13 },
    { name: 'Pediatrics', patients: 18 },
    { name: 'Orthopedics', patients: 9 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


  const fetchAnalyticsData = async () => {
    try {
      if (!doctorData?._id) return;
      
      const token = localStorage.getItem('doctorToken');
      const response = await axios.get(`/appointment/analytics/${doctorData._id}`, {
        params: { range: timeRange.toLowerCase() },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.success) {
        setAnalyticsData({
          dailyStats: response.data.data.dailyStats || [],
          statusStats: response.data.data.statusStats || [],
          range: timeRange
        });
      } else {
        console.error('Analytics data not available');
        toast.error('Analytics data not available');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    }
  };
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const response = await axios.get(`/doctorbyid/${userId}`);
        setDoctorData(response.data.data);

        // Fetch appointments
        const appointmentsRes = await axios.get(`/appointment/appointments/doctor/${response.data.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointmentsRes.data.data);

        const started = appointmentsRes.data.data.filter(a => a.status === 'Started');
    setStartedAppointments(started);

        // Fetch reviews
        const reviewsRes = await axios.get(`/reviews/doctor/${response.data.data._id}`);
        setReviews(reviewsRes.data.data);

        // Calculate rating stats
        if (reviewsRes.data.data.length > 0) {
          const totalRatings = reviewsRes.data.data.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRatings / reviewsRes.data.data.length;

          const distribution = [0, 0, 0, 0, 0];
          reviewsRes.data.data.forEach(review => {
            distribution[review.rating - 1]++;
          });

          setRatingStats({
            averageRating: avgRating,
            totalReviews: reviewsRes.data.data.length,
            ratingDistribution: distribution
          });
        }

        // Calculate stats
        const total = appointmentsRes.data.data.length;
        const upcoming = appointmentsRes.data.data.filter(a => a.status === 'Confirmed').length;
        const pending = appointmentsRes.data.data.filter(a => a.status === 'Pending').length;
        const completed = appointmentsRes.data.data.filter(a => a.status === 'Completed').length;
        const cancelled = appointmentsRes.data.data.filter(a => a.status === 'Cancelled').length;

        // Calculate earnings (assuming each completed appointment is $100 for demo)
        const calculatedEarnings = completed * 100;
        setEarnings(calculatedEarnings);

        setStats({
          totalAppointments: total,
          upcomingAppointments: upcoming,
          pendingAppointments: pending,
          completedAppointments: completed,
          cancelledAppointments: cancelled
        });

        // Fetch notifications
        const notificationsRes = await axios.get(`/notification/doctor/${response.data.data._id}`);
        setNotifications(notificationsRes.data.data || []); // Ensure it's an array
        setUnreadCount((notificationsRes.data.data || []).filter(n => !n.read).length);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        toast.error('Failed to load doctor data');
        setLoading(false);
      }
    };

    fetchDoctorData();

    // Set up real-time updates with WebSocket or polling
    const interval = setInterval(fetchDoctorData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (doctorData?._id) {
      fetchAnalyticsData();
    }
  }, [timeRange, doctorData]);
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('doctorToken');
      await axios.patch(`/appointment/start/${appointmentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Appointment started successfully');

      // Navigate to chat page with correct parameters
      navigate(`/doctor/chat/${appointmentId}`, {
        state: {
          appointmentId,
          userType: 'DOCTOR',
          userId: userId
        }
      });

      // Update local state
      const updatedAppointments = appointments.map(app =>
        app._id === appointmentId ? { ...app, status: 'Started' } : app
      );
      setAppointments(updatedAppointments);

      // Update stats
      updateAppointmentStats(updatedAppointments);

    } catch (error) {
      console.error('Error starting appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to start appointment');
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const token = localStorage.getItem('doctorToken');
      let endpoint = '';
      let data = {};

      if (action === 'confirm') {
        endpoint = `/appointment/confirm/${appointmentId}`;
      } else if (action === 'cancel') {
        handleCancelClick(appointmentId);
        return;
      } else if (action === 'complete') {
        endpoint = `/appointment/complete/${appointmentId}`;
        data = { status: 'Completed' };
      } else if (action === 'reschedule') {
        handleRescheduleClick(appointmentId);
        return;
      }

      await axios.patch(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Appointment ${action}ed successfully`);

      // Update local state
      const updatedAppointments = appointments.map(app =>
        app._id === appointmentId ? {
          ...app,
          status: action === 'confirm' ? 'Confirmed' :
            action === 'complete' ? 'Completed' : app.status,
          cancelReason: action === 'cancel' ? data.cancelReason : app.cancelReason
        } : app
      );
      setAppointments(updatedAppointments);

      // Update stats
      updateAppointmentStats(updatedAppointments);

    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Failed to ${action} appointment`);
    }
  };

  const handleCancelClick = (appointmentId) => {
    setCurrentAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason || !currentAppointmentId) return;

    try {
      const token = localStorage.getItem('doctorToken');
      await axios.patch(`/appointment/cancel/${currentAppointmentId}`, {
        cancelReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Appointment cancelled successfully');

      // Update local state
      const updatedAppointments = appointments.map(app =>
        app._id === currentAppointmentId ? {
          ...app,
          status: 'Cancelled',
          cancelReason
        } : app
      );
      setAppointments(updatedAppointments);

      // Update stats
      updateAppointmentStats(updatedAppointments);

      // Close dialog and reset state
      setCancelDialogOpen(false);
      setCancelReason('');
      setCurrentAppointmentId(null);

    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    await handleAppointmentAction(appointmentId, 'complete');
  };

  const updateAppointmentStats = (appointments) => {
    const total = appointments.length;
    const upcoming = appointments.filter(a => a.status === 'Confirmed').length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

    setStats({
      totalAppointments: total,
      upcomingAppointments: upcoming,
      pendingAppointments: pending,
      completedAppointments: completed,
      cancelledAppointments: cancelled
    });
  };

  const handleUpdateAvailability = async () => {
    if (!newAvailability) return;

    try {
      const token = localStorage.getItem('doctorToken');
      await axios.put(`/updateddoctor/${doctorData._id}`, {
        availability: newAvailability
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Availability updated successfully');
      setDoctorData({ ...doctorData, availability: newAvailability });
      setNewAvailability('');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleProfilePicUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setProfilePic(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('doctorToken');
      await axios.put(`/updatedoctorphoto/${doctorData._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    navigate('/doctorlogin');
  };

  // New Functions for Enhanced Features

  const handleRescheduleClick = (appointmentId) => {
    setCurrentAppointmentId(appointmentId);
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleAppointment = async () => {
    if (!newAppointmentDate || !newAppointmentTime || !currentAppointmentId) return;

    try {
      const token = localStorage.getItem('doctorToken');
      await axios.patch(`/appointment/reschedule/${currentAppointmentId}`, {
        newDate: newAppointmentDate,
        newTime: newAppointmentTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Appointment rescheduled successfully');
      
      // Update local state
      const updatedAppointments = appointments.map(app => 
        app._id === currentAppointmentId ? { 
          ...app, 
          appointmentDate: newAppointmentDate,
          appointmentTime: newAppointmentTime
        } : app
      );
      setAppointments(updatedAppointments);
      
      setRescheduleDialogOpen(false);
      setNewAppointmentDate('');
      setNewAppointmentTime('');
      setCurrentAppointmentId(null);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  };

  const handleOpenNotesDialog = (patientId, appointmentId) => {
    setSelectedPatientForNotes(patientId);
    setCurrentAppointmentId(appointmentId); // Add this line
    setNotesDialogOpen(true);
  };

  const handleSavePatientNotes = async () => {
    try {
      if (!currentAppointmentId) {
        toast.error('No appointment selected');
        return;
      }
  
      const token = localStorage.getItem('doctorToken');
      await axios.post(`/appointment/${currentAppointmentId}/notes`, {
        notes: patientNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Notes saved successfully');
      setNotesDialogOpen(false);
      setPatientNotes('');
      setSelectedPatientForNotes(null);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error(error.response?.data?.message || 'Failed to save notes');
    }
  };
  const handleOpenPrescriptionDialog = (appointmentId) => {
    setCurrentAppointmentId(appointmentId);
    setPrescriptionDialogOpen(true);
  };

  const handleAddMedication = () => {
    setPrescriptionData({
      ...prescriptionData,
      medications: [...prescriptionData.medications, { medicineName: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const handleRemoveMedication = (index) => {
    const newMedications = [...prescriptionData.medications];
    newMedications.splice(index, 1);
    setPrescriptionData({
      ...prescriptionData,
      medications: newMedications
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...prescriptionData.medications];
    newMedications[index][field] = value;
    setPrescriptionData({
      ...prescriptionData,
      medications: newMedications
    });
  };

  const handleCreatePrescription = async () => {
    try {
      const token = localStorage.getItem('doctorToken');
      await axios.post('/prescription', {
        appointmentId: currentAppointmentId,
        doctorId: userId,
        patientId: selectedPatient?._id,
        ...prescriptionData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Prescription created successfully');
      setPrescriptionDialogOpen(false);
      setPrescriptionData({
        diagnosis: '',
        medications: [{ medicineName: '', dosage: '', frequency: '', duration: '' }],
        notes: '',
        followUpDate: ''
      });
      setCurrentAppointmentId(null);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription');
    }
  };

  const handleStartVideoCall = (appointmentId) => {
    // Integrate with your video call API (e.g., Twilio, Agora)
    navigate(`/video-call/${appointmentId}`, {
      state: {
        appointmentId,
        userType: 'DOCTOR',
        userId: userId
      }
    });
  };

  const exportAppointments = () => {
    const headers = [
      'Patient Name',
      'Appointment Date',
      'Appointment Time',
      'Status',
      'Phone Number',
      'Cancel Reason'
    ];
    
    const data = appointments.map(appointment => [
      `${appointment.firstName} ${appointment.lastName}`,
      new Date(appointment.appointmentDate).toLocaleDateString(),
      appointment.appointmentTime,
      appointment.status,
      appointment.phoneNumber,
      appointment.cancelReason || 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointments_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewPrescription = async (appointmentId) => {
    try {
      const token = localStorage.getItem('doctorToken');
      const response = await axios.get(`/prescription/patient/${selectedPatient._id}/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCurrentPrescription(response.data.data);
      } else {
        toast.info('No prescription found for this appointment');
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
      if (error.response?.status === 404) {
        toast.info('No prescription found for this appointment');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load prescription');
      }
    }
  };





  
  const calendarEvents = appointments.map(appointment => ({
    id: appointment._id,
    title: `${appointment.firstName} ${appointment.lastName}`,
    start: new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`),
    end: new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`),
    status: appointment.status
  }));

  const filteredPatients = Array.from(new Set(appointments.map(a => a.userId?._id || a.userId)))
    .filter(patientId => {
      if (!patientId) return false;
      
      const patientAppointments = appointments.filter(a => 
        (a.userId?._id || a.userId) === patientId
      );
      const latestAppointment = patientAppointments.reduce((latest, current) =>
        new Date(current.appointmentDate) > new Date(latest.appointmentDate) ? current : latest
      );
      
      const patient = latestAppointment.userId || {};
      const fullName = `${patient.Firstname || patient.firstName || ''} ${patient.Lastname || patient.lastName || ''}`.toLowerCase();
      
      // Search filter
      const matchesSearch = searchTerm === '' || 
        fullName.includes(searchTerm.toLowerCase()) ||
        (patient.PhoneNumber || latestAppointment.phoneNumber || '').includes(searchTerm);
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || 
        latestAppointment.status.toLowerCase() === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!doctorData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Failed to load doctor data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Sidebar */}
      <Box sx={{ width: 250, bgcolor: '#1e3a8a', color: 'white', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2 }}>
          <Avatar
            src={doctorData.profilePic}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Dr. {doctorData.Firstname} {doctorData.Lastname}
            </Typography>
            <Typography variant="body2" sx={{ color: '#93c5fd' }}>
              {doctorData.specialization}
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
              <MedicalServices sx={{ color: 'white' }} />
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
            selected={selectedTab === 'patients'}
            onClick={() => setSelectedTab('patients')}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&.Mui-selected': { bgcolor: '#3b82f6' },
              '&:hover': { bgcolor: '#3b82f6' }
            }}
          >
            <ListItemAvatar>
              <People sx={{ color: 'white' }} />
            </ListItemAvatar>
            <ListItemText primary="Patients" />
          </ListItem>

          <ListItem
  button
  selected={selectedTab === 'payments'}
  onClick={() => setSelectedTab('payments')}
  sx={{
    borderRadius: 1,
    mb: 1,
    '&.Mui-selected': { bgcolor: '#3b82f6' },
    '&:hover': { bgcolor: '#3b82f6' }
  }}
>
  <ListItemAvatar>
    <Payment sx={{ color: 'white' }} />
  </ListItemAvatar>
  <ListItemText primary="Payments" />
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
              <Person sx={{ color: 'white' }} />
            </ListItemAvatar>
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem
            button
            selected={selectedTab === 'settings'}
            onClick={() => setSelectedTab('settings')}
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
            <ListItemText primary="Settings" />
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
            <Logout sx={{ color: 'white' }} />
          </ListItemAvatar>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
            {selectedTab === 'dashboard' && 'Doctor Dashboard'}
            {selectedTab === 'appointments' && 'Appointments'}
            {selectedTab === 'patients' && 'Patients'}
            {selectedTab === 'profile' && 'Profile'}
            {selectedTab === 'settings' && 'Settings'}
          </Typography>
          <Badge badgeContent={unreadCount} color="error">
            <IconButton>
              <Notifications />
            </IconButton>
          </Badge>
        </Box>

        {selectedTab === 'dashboard' && (
          <>
            {/* Quick Action Buttons */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<Videocam />}
                  onClick={() => setSelectedTab('appointments')}
                >
                  Start Consultation
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<RateReview />}
                  onClick={() => setSelectedTab('patients')}
                >
                  Patient Reviews
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<Receipt />}
                  onClick={() => setSelectedTab('patients')}
                >
                  Create Prescription
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<Payment />}
                  onClick={() => setSelectedTab('dashboard')}
                >
                  View Earnings
                </Button>
              </Grid>
            </Grid>

          

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#e0f2fe', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Total Appointments
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {stats.totalAppointments}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: '#bae6fd', p: 2, borderRadius: '50%' }}>
                        <CalendarToday sx={{ color: '#0369a1', fontSize: 30 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#dcfce7', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Upcoming
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {stats.upcomingAppointments}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: '#bbf7d0', p: 2, borderRadius: '50%' }}>
                        <Schedule sx={{ color: '#15803d', fontSize: 30 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#fef3c7', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Pending
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {stats.pendingAppointments}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: '#fde68a', p: 2, borderRadius: '50%' }}>
                        <Pending sx={{ color: '#b45309', fontSize: 30 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#fee2e2', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {stats.completedAppointments}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: '#fecaca', p: 2, borderRadius: '50%' }}>
                        <CheckCircle sx={{ color: '#b91c1c', fontSize: 30 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Charts */}
            {/* <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Appointments Overview
                    </Typography>
                    <Tabs value={activeChartTab} onChange={(e, newValue) => setActiveChartTab(newValue)}>
                      <Tab label="Weekly" value="weekly" />
                      <Tab label="Monthly" value="monthly" />
                    </Tabs>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={appointmentData[activeChartTab]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2, p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Specialization Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={specializationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="patients"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {specializationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </Grid> */}

{/* Analytics Data Section */}
<Card sx={{ borderRadius: 2, p: 3, mb: 3 }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      Detailed Analytics ({analyticsData.range})
    </Typography>
    <TextField
      select
      size="small"
      value={timeRange}
      onChange={(e) => {
        setTimeRange(e.target.value);
        // Trigger a refetch when the range changes
        fetchAnalyticsData();
      }}
      sx={{ width: 120 }}
    >
      <MenuItem value="daily">Daily</MenuItem>
      <MenuItem value="weekly">Weekly</MenuItem>
      <MenuItem value="monthly">Monthly</MenuItem>
    </TextField>
  
  
  </Box>

  {analyticsData.dailyStats && analyticsData.dailyStats.length > 0 ? (
    <Grid container spacing={3}>
      {/* Daily Stats Chart */}
      <Grid item xs={12} md={7}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Appointments by Day
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart
            data={analyticsData.dailyStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="_id" 
              angle={-45} 
              textAnchor="end"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                try {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                } catch (e) {
                  return value;
                }
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} appointments`, 'Count']}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              name="Appointments"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </Grid>

      {/* Status Stats Chart */}
      <Grid item xs={12} md={5}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Appointments by Status
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analyticsData.statusStats}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
              nameKey="_id"
              label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {analyticsData.statusStats.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} appointments`, name]}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>

      {/* Summary Section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Summary
        </Typography>
        <Grid container spacing={2}>
          {analyticsData.statusStats.map((stat, index) => (
            <Grid item xs={4} key={stat._id}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
                  borderRadius: '4px'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stat.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat._id}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: 300 
    }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        No analytics data available for the selected period
      </Typography>
      <Button 
        variant="outlined" 
        onClick={() => fetchAnalyticsData()}
      >
        Retry
      </Button>
    </Box>
  )}


<Grid item xs={12} md={4}>
  <Card sx={{ bgcolor: '#f0fdf4', borderRadius: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Total Earnings
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            ₹{analyticsData.paymentStats?.totalEarnings || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {analyticsData.paymentStats?.count || 0} paid appointments
          </Typography>
        </Box>
        <Box sx={{ bgcolor: '#bbf7d0', p: 2, borderRadius: '50%' }}>
          <Payment sx={{ color: '#15803d', fontSize: 30 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
</Grid>
</Card>

            {/* Pending Appointments */}
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Pending Appointments
                </Typography>

                {appointments.filter(a => a.status === 'Pending').length === 0 ? (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No pending appointments
                  </Typography>
                ) : (
                  <List>
                    {appointments
                      .filter(a => a.status === 'Pending')
                      .slice(0, 5)
                      .map((appointment, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderBottom: '1px solid #e5e7eb',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={appointment.userId?.userPic} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${appointment.firstName} ${appointment.lastName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  Phone: {appointment.phoneNumber}
                                </Typography>
                              </>
                            }
                          />
                          <Box>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<CheckCircle />}
                              sx={{ mr: 1 }}
                              onClick={() => handleAppointmentAction(appointment._id, 'confirm')}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleCancelClick(appointment._id)}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Upcoming Appointments
                </Typography>

                {appointments.filter(a => a.status === 'Confirmed').length === 0 ? (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No upcoming appointments
                  </Typography>
                ) : (
                  <List>
                    {appointments
                      .filter(a => a.status === 'Confirmed')
                      .slice(0, 5)
                      .map((appointment, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderBottom: '1px solid #e5e7eb',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={appointment.userId?.userPic} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${appointment.firstName} ${appointment.lastName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  Phone: {appointment.phoneNumber}
                                </Typography>
                              </>
                            }
                          />
                          <Box>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<Videocam />}
                              sx={{ mr: 1 }}
                              onClick={() => {
                                setCurrentAppointmentId(appointment._id);
                                setStartDialogOpen(true);
                              }}
                            >
                              Start
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleCancelClick(appointment._id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleCompleteAppointment(appointment._id)}
                            >
                              Complete
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </>
        )}

{/* Started Appointments */}
{/* <Card sx={{ borderRadius: 2, mt: 3 }}>
  <CardContent>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      Active Consultations
    </Typography>

    {startedAppointments.length === 0 ? (
      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
        No active consultations
      </Typography>
    ) : (
      <List>
        {startedAppointments.map((appointment, index) => (
          <ListItem
            key={index}
            sx={{
              borderBottom: '1px solid #e5e7eb',
              '&:last-child': { borderBottom: 'none' }
            }}
          >
            <ListItemAvatar>
              <Avatar src={appointment.userId?.userPic} />
            </ListItemAvatar>
            <ListItemText
              primary={`${appointment.firstName} ${appointment.lastName}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    Phone: {appointment.phoneNumber}
                  </Typography>
                </>
              }
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Videocam />}
                sx={{ mr: 1 }}
                onClick={() => {
                  setCurrentAppointmentId(appointment._id);
                  setStartDialogOpen(true);
                }}
              >
                Video Call
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Cancel />}
                onClick={() => handleCancelClick(appointment._id)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle />}
                onClick={() => handleCompleteAppointment(appointment._id)}
                sx={{ mr: 1 }}
              >
                Complete
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<Edit />}
                onClick={() => handleRescheduleClick(appointment._id)}
              >
                Reschedule
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    )}
  </CardContent>
</Card> */}


{/* Started Appointments */}
<Card sx={{ borderRadius: 2, mt: 3 }}>
  <CardContent>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      Active Consultations
    </Typography>

    {startedAppointments.length === 0 ? (
      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
        No active consultations
      </Typography>
    ) : (
      <List>
        {startedAppointments.map((appointment, index) => (
          <ListItem
            key={index}
            sx={{
              borderBottom: '1px solid #e5e7eb',
              '&:last-child': { borderBottom: 'none' }
            }}
          >
            <ListItemAvatar>
              <Avatar src={appointment.userId?.userPic} />
            </ListItemAvatar>
            <ListItemText
              primary={`${appointment.firstName} ${appointment.lastName}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    Phone: {appointment.phoneNumber}
                  </Typography>
                </>
              }
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Videocam />}
                sx={{ mr: 1 }}
                onClick={() => {
                  setCurrentAppointmentId(appointment._id);
                  setStartDialogOpen(true);
                }}
              >
                Video Call
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Cancel />}
                onClick={() => {
                  setCurrentAppointmentId(appointment._id);
                  setCancelDialogOpen(true);
                }}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle />}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('doctorToken');
                    const response = await axios.patch(
                      `/appointment/complete/${appointment._id}`,
                      {}, // Empty object as the body since your endpoint might not need data
                      {
                        headers: { 
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      }
                    );

                    if (response.data.success) {
                      toast.success('Appointment completed successfully');
                      
                      // Update local state
                      const updatedAppointments = appointments.map(app =>
                        app._id === appointment._id ? { ...app, status: 'Completed' } : app
                      );
                      setAppointments(updatedAppointments);
                      
                      // Update started appointments list
                      setStartedAppointments(startedAppointments.filter(a => a._id !== appointment._id));
                      
                      // Update stats
                      updateAppointmentStats(updatedAppointments);
                    } else {
                      toast.error(response.data.message || 'Failed to complete appointment');
                    }
                  } catch (error) {
                    console.error('Error completing appointment:', error);
                    
                    // More detailed error handling
                    if (error.response) {
                      // The request was made and the server responded with a status code
                      console.error('Error data:', error.response.data);
                      console.error('Error status:', error.response.status);
                      console.error('Error headers:', error.response.headers);
                      
                      if (error.response.status === 400) {
                        toast.error('Invalid request. Please check the appointment data.');
                      } else if (error.response.status === 401) {
                        toast.error('Unauthorized. Please login again.');
                      } else if (error.response.status === 404) {
                        toast.error('Appointment not found.');
                      } else {
                        toast.error(error.response.data.message || 'Failed to complete appointment');
                      }
                    } else if (error.request) {
                      // The request was made but no response was received
                      console.error('No response received:', error.request);
                      toast.error('No response from server. Please check your connection.');
                    } else {
                      // Something happened in setting up the request
                      console.error('Request setup error:', error.message);
                      toast.error('Error setting up request. Please try again.');
                    }
                  }
                }}
                sx={{ mr: 1 }}
              >
                Complete
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<Edit />}
                onClick={() => {
                  setCurrentAppointmentId(appointment._id);
                  setRescheduleDialogOpen(true);
                }}
              >
                Reschedule
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    )}
  </CardContent>
</Card>

        {selectedTab === 'appointments' && (
          <>
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Calendar View
                </Typography>
                <div style={{ height: 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    views={['month', 'week', 'day', 'agenda']}
                    defaultView={calendarView}
                    onView={view => setCalendarView(view)}
                    eventPropGetter={(event) => ({
                      style: {
                        backgroundColor: 
                          event.status === 'Completed' ? '#4CAF50' :
                          event.status === 'Cancelled' ? '#F44336' :
                          event.status === 'Confirmed' ? '#2196F3' :
                          '#FFC107',
                        borderRadius: '4px',
                        opacity: 0.8,
                        color: 'white',
                        border: '0px',
                        display: 'block'
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    All Appointments
                  </Typography>

                  <Box>
                    <Button
                      variant={appointmentStatus === 'pending' ? 'contained' : 'outlined'}
                      onClick={() => setAppointmentStatus('pending')}
                      sx={{ mr: 1 }}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={appointmentStatus === 'upcoming' ? 'contained' : 'outlined'}
                      onClick={() => setAppointmentStatus('upcoming')}
                      sx={{ mr: 1 }}
                    >
                      Upcoming
                    </Button>
                    <Button
                      variant={appointmentStatus === 'completed' ? 'contained' : 'outlined'}
                      onClick={() => setAppointmentStatus('completed')}
                      sx={{ mr: 1 }}
                    >
                      Completed
                    </Button>
                    <Button
                      variant={appointmentStatus === 'cancelled' ? 'contained' : 'outlined'}
                      onClick={() => setAppointmentStatus('cancelled')}
                      sx={{ mr: 1 }}
                    >
                      Cancelled
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownload />}
                      onClick={exportAppointments}
                    >
                      Export
                    </Button>
                  </Box>
                </Box>

                {appointments.filter(a =>
                  (appointmentStatus === 'pending' && a.status === 'Pending') ||
                  (appointmentStatus === 'upcoming' && a.status === 'Confirmed') ||
                  (appointmentStatus === 'completed' && a.status === 'Completed') ||
                  (appointmentStatus === 'cancelled' && a.status === 'Cancelled')
                ).length === 0 ? (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No {appointmentStatus} appointments
                  </Typography>
                ) : (
                  <List>
                    {appointments
                      .filter(a =>
                        (appointmentStatus === 'pending' && a.status === 'Pending') ||
                        (appointmentStatus === 'upcoming' && a.status === 'Confirmed') ||
                        (appointmentStatus === 'completed' && a.status === 'Completed') ||
                        (appointmentStatus === 'cancelled' && a.status === 'Cancelled')
                      )
                      .map((appointment, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderBottom: '1px solid #e5e7eb',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={appointment.userId?.userPic} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${appointment.firstName} ${appointment.lastName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  Status: {appointment.status}
                                  {appointment.cancelReason && ` - Reason: ${appointment.cancelReason}`}
                                </Typography>
                              </>
                            }
                          />
                          <Box>
                            {appointment.status === 'Pending' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  startIcon={<CheckCircle />}
                                  sx={{ mr: 1 }}
                                  onClick={() => handleAppointmentAction(appointment._id, 'confirm')}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<Cancel />}
                                  onClick={() => {
                                    setCurrentAppointmentId(appointment._id);
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            {appointment.status === 'Confirmed' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  startIcon={<Videocam />}
                                  sx={{ mr: 1 }}
                                  onClick={() => {
                                    setCurrentAppointmentId(appointment._id);
                                    setStartDialogOpen(true);
                                  }}
                                >
                                  Start
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<Cancel />}
                                  onClick={() => {
                                    setCurrentAppointmentId(appointment._id);
                                    setCancelDialogOpen(true);
                                  }}
                                  sx={{ mr: 1 }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  startIcon={<CheckCircle />}
                                  onClick={() => handleCompleteAppointment(appointment._id)}
                                  sx={{ mr: 1 }}
                                >
                                  Complete
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  startIcon={<Edit />}
                                  onClick={() => handleRescheduleClick(appointment._id)}
                                >
                                  Reschedule
                                </Button>
                              </>
                            )}
                            {appointment.status === 'Completed' && (
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<Receipt />}
                                onClick={() => handleOpenPrescriptionDialog(appointment._id)}
                              >
                                Prescription
                              </Button>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {selectedTab === 'patients' && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  My Patients
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Search patients..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mr: 2, width: 250 }}
                  />
                  <TextField
                    select
                    size="small"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ width: 150 }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </TextField>
                </Box>
                </Box>
              

              {filteredPatients.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No patients found
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Last Appointment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredPatients.map((patientId) => {
  const patientAppointments = appointments.filter(a => 
    (a.userId?._id || a.userId) === patientId
  );
  const latestAppointment = patientAppointments.reduce((latest, current) =>
    new Date(current.appointmentDate) > new Date(latest.appointmentDate) ? current : latest
  );

  // Get patient data - first try from appointment.userId, then fallback to appointment fields
  let patient = latestAppointment.userId || {};
  
  // If userId is just an ID (not populated), use the appointment's firstName/lastName
  if (typeof latestAppointment.userId === 'string' || !latestAppointment.userId) {
    patient = {
      _id: latestAppointment.userId || patientId,
      Firstname: latestAppointment.firstName,
      Lastname: latestAppointment.lastName,
      PhoneNumber: latestAppointment.phoneNumber,
      // Add other fields as needed
    };
  }

                        return (
                          <TableRow key={patientId}>
                          <TableCell>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Avatar
      src={patient.userPic}
      sx={{ mr: 2 }}
      alt={`${latestAppointment.firstName} ${latestAppointment.lastName}`}
    />
    {latestAppointment.firstName} {latestAppointment.lastName}
  </Box>
</TableCell>
                            <TableCell>
                              {latestAppointment.appointmentDate ?
                                new Date(latestAppointment.appointmentDate).toLocaleDateString() :
                                'N/A'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={latestAppointment.status || 'Unknown'}
                                color={
                                  latestAppointment.status === 'Pending' ? 'warning' :
                                    latestAppointment.status === 'Confirmed' ? 'primary' :
                                      latestAppointment.status === 'Completed' ? 'success' :
                                        latestAppointment.status === 'Cancelled' ? 'error' : 'default'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {patient.PhoneNumber || latestAppointment.phoneNumber || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={async () => {
                                  // If we don't have full patient details, fetch them
                                  if (!patient.Firstname || !patient.Lastname) {
                                    try {
                                      const response = await axios.get(`/userbyid/${patient._id}`);
                                      patient = response.data.data;
                                    } catch (error) {
                                      console.error('Error fetching patient details:', error);
                                    }
                                  }

                                  // When setting the selected patient
                                  setSelectedPatient({
                                    ...patient,
                                    Firstname: patient.Firstname || patient.firstName,
                                    Lastname: patient.Lastname || patient.lastName,
                                    PhoneNumber: patient.PhoneNumber || patient.phoneNumber
                                  });
                                  setSelectedPatientAppointments(patientAppointments);
                                  setPatientDialogOpen(true);
                                }}
                                sx={{ mr: 1 }}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<NoteAdd />}
                                onClick={() => handleOpenNotesDialog(patient._id)}
                              >
                                Notes
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Patient Details Dialog */}
        <Dialog
          open={patientDialogOpen}
          onClose={() => {
            setPatientDialogOpen(false);
            setCurrentPrescription(null);
          }}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: '12px',
              background: '#f9fafb'
            }
          }}
        >
          <DialogTitle sx={{
            backgroundColor: theme => theme.palette.primary.main,
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Patient Profile
              </Typography>
              <Typography variant="subtitle1">
                {selectedPatient?.Firstname || 'Unknown'} {selectedPatient?.Lastname || 'Patient'}
              </Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => {
                setPatientDialogOpen(false);
                setCurrentPrescription(null);
              }}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            {selectedPatient && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Patient Information Column */}
                  <Grid item xs={12} md={5}>
                    {/* Profile Card */}
                    <Card sx={{
                      mb: 3,
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3
                        }}>
                          <Avatar
                            src={selectedPatient.userPic}
                            sx={{
                              width: 90,
                              height: 90,
                              mr: 3,
                              border: '3px solid',
                              borderColor: theme => theme.palette.primary.light
                            }}
                            alt={`${selectedPatient.Firstname || ''} ${selectedPatient.Lastname || ''}`}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {selectedPatient.Firstname || 'Unknown'} {selectedPatient.Lastname || 'Patient'}
                            </Typography>
                            <Chip
                              label={`Age: ${selectedPatient.Age || selectedPatient.age || 'N/A'}`}
                              size="small"
                              sx={{ mr: 1, mb: 1, background: '#e3f2fd' }}
                            />
                            <Chip
                              label={`Gender: ${selectedPatient.gender || 'N/A'}`}
                              size="small"
                              sx={{ background: '#e8f5e9' }}
                            />
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                            CONTACT INFORMATION
                          </Typography>
                          <InfoRow icon={<EmailIcon color="primary" />} text={selectedPatient.email || 'N/A'} />
                          <InfoRow icon={<PhoneIcon color="primary" />} text={selectedPatient.PhoneNumber || selectedPatient.phoneNumber || 'N/A'} />
                          <InfoRow icon={<CakeIcon color="primary" />} text={
                            selectedPatient.dateOfBirth ?
                              new Date(selectedPatient.dateOfBirth).toLocaleDateString() : 'N/A'
                          } />
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Medical History Card */}
                    <Card sx={{
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <MedicalInformationIcon color="primary" sx={{ mr: 1 }} />
                          Medical History
                        </Typography>
                        
                        {selectedPatient.mediacalHistory?.length > 0 || selectedPatient.medicalHistory?.length > 0 ? (
                          <List dense sx={{
                            maxHeight: 200,
                            overflow: 'auto',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            p: 1
                          }}>
                            {(selectedPatient.mediacalHistory || selectedPatient.medicalHistory || []).map((item, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <FiberManualRecordIcon sx={{ fontSize: '10px', color: 'primary.main' }} />
                                </ListItemIcon>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Box sx={{
                            p: 2,
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              No medical history recorded
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Appointments Column */}
                  <Grid item xs={12} md={7}>
                    {/* Appointments Card */}
                    <Card sx={{
                      mb: 3,
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          <EventIcon color="primary" sx={{ mr: 1 }} />
                          Appointment History
                        </Typography>
                        
                        {selectedPatientAppointments?.length > 0 ? (
                          <List sx={{
                            maxHeight: 300,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: '3px' }
                          }}>
                            {selectedPatientAppointments.map((appointment, index) => (
                              <ListItem 
                                key={index} 
                                sx={{
                                  mb: 1,
                                  p: 2,
                                  borderRadius: '8px',
                                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                                  '&:hover': { backgroundColor: '#e3f2fd' }
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                      {appointment.appointmentDate ?
                                        new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                  }
                                  secondary={
                                    <>
                                      <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                        {appointment.appointmentTime || 'N/A'}
                                      </Typography>
                                      <Chip
                                        label={appointment.status || 'Unknown'}
                                        size="small"
                                        sx={{
                                          mt: 0.5,
                                          backgroundColor: appointment.status === 'Completed' ? '#e8f5e9' : 
                                                         appointment.status === 'Cancelled' ? '#ffebee' : '#fff8e1',
                                          color: appointment.status === 'Completed' ? '#2e7d32' : 
                                                 appointment.status === 'Cancelled' ? '#c62828' : '#f57f17'
                                        }}
                                      />
                                      {appointment.status === 'Completed' && (
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={() => viewPrescription(appointment._id)}
                                          sx={{ mt: 1, ml: 0 }}
                                          startIcon={<DescriptionIcon />}
                                        >
                                          View Prescription
                                        </Button>
                                      )}
                                    </>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Box sx={{
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              No appointment history found
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Prescription Details */}
                    {currentPrescription && (
                      <Card sx={{
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                          }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                              <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                              Prescription Details
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => setCurrentPrescription(null)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                              DIAGNOSIS
                            </Typography>
                            <Typography variant="body1" sx={{
                              p: 2,
                              backgroundColor: '#e3f2fd',
                              borderRadius: '8px'
                            }}>
                              {currentPrescription.diagnosis || 'No diagnosis provided'}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                              MEDICATIONS
                            </Typography>
                            <TableContainer sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px'
                            }}>
                              <Table size="small">
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Dosage</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {currentPrescription.medications?.map((med, index) => (
                                    <TableRow key={index} hover>
                                      <TableCell>{med.medicineName || 'N/A'}</TableCell>
                                      <TableCell>{med.dosage || 'N/A'}</TableCell>
                                      <TableCell>{med.frequency || 'N/A'}</TableCell>
                                      <TableCell>{med.duration || 'N/A'}</TableCell>
                                    </TableRow>
                                  )) || (
                                    <TableRow>
                                      <TableCell colSpan={4} align="center">No medications prescribed</TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>

                          {currentPrescription.notes && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                                ADDITIONAL NOTES
                              </Typography>
                              <Typography variant="body1" sx={{
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px'
                              }}>
                                {currentPrescription.notes}
                              </Typography>
                            </Box>
                          )}

                          {currentPrescription.followUpDate && (
                            <Box sx={{
                              p: 2,
                              backgroundColor: '#e8f5e9',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <EventAvailableIcon color="success" sx={{ mr: 1 }} />
                              <Typography variant="body1">
                                <strong>Follow-up:</strong> {new Date(currentPrescription.followUpDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
        </Dialog>

{selectedTab === 'payments' && (
  <Card sx={{ borderRadius: 2 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Payment History
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 2 }}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 2 }}
        />
        <Button variant="contained">Filter</Button>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Appointment</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through payment data here */}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
)}

        {selectedTab === 'profile' && (
          <Grid container spacing={3}>
            {/* Left Column - Profile Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  {/* Profile Picture Upload */}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-pic-upload"
                    type="file"
                    onChange={handleProfilePicUpdate}
                  />
                  <label htmlFor="profile-pic-upload">
                    <Avatar
                      src={profilePic || doctorData.profilePic}
                      sx={{
                        width: 150,
                        height: 150,
                        mb: 3,
                        cursor: 'pointer',
                        border: '3px solid #3b82f6'
                      }}
                    />
                  </label>

                  {/* Doctor Name and Specialization */}
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Dr. {doctorData.Firstname} {doctorData.Lastname}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    {doctorData.specialization}
                  </Typography>

                  {/* Enhanced Rating Display */}
                  <Box sx={{
                    width: '100%',
                    mb: 3,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                      <Star sx={{ verticalAlign: 'middle', mr: 1, color: '#FFD700' }} />
                      Patient Ratings
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {ratingStats.averageRating.toFixed(1)}
                      </Typography>
                      <Box>
                        <Box sx={{ display: 'flex' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              sx={{
                                color: star <= Math.round(ratingStats.averageRating) ? '#FFD700' : '#e0e0e0',
                                fontSize: 20
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {ratingStats.totalReviews} reviews
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Contact Information */}
                  <Box sx={{
                    width: '100%',
                    mt: 'auto',
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      <People sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Contact Information
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <MailOutline sx={{ mr: 1, color: '#64748b' }} />
                        {doctorData.email}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ mr: 1, color: '#64748b' }} />
                        {doctorData.phoneNumber}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 1, color: '#64748b' }} />
                        Availability: {doctorData.availability}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Professional Information */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                    <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Professional Information
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Basic Information */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        value={doctorData.Firstname}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        value={doctorData.Lastname}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    {/* Professional Details */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Specialization"
                        value={doctorData.specialization}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MedicalServices />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Qualification"
                        value={doctorData.qualification}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <School />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Experience"
                        value={doctorData.experience}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Work />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Availability"
                        value={doctorData.availability}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTime />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* About Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        About
                      </Typography>
                      <Paper elevation={0} sx={{
                        p: 2,
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        minHeight: 150
                      }}>
                        <Typography variant="body1">
                          {doctorData.about || "No information provided"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 'settings' && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Account Settings
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Update Availability
                  </Typography>

                  <TextField
                    select
                    label="Current Availability"
                    value={newAvailability || doctorData.availability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="morning">Morning</MenuItem>
                    <MenuItem value="afternoon">Afternoon</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="night">Night</MenuItem>
                    <MenuItem value="fulltime">Full Time</MenuItem>
                  </TextField>

                  <Button
                    variant="contained"
                    onClick={handleUpdateAvailability}
                    disabled={!newAvailability}
                  >
                    Update Availability
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Change Password
                  </Typography>

                  <TextField
                    type="password"
                    label="Current Password"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    type="password"
                    label="New Password"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  <Button variant="contained">
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Cancel Appointment Dialog */}
        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide a reason for cancelling this appointment:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Cancellation Reason"
              type="text"
              fullWidth
              variant="standard"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setCancelDialogOpen(false);
              setCancelReason('');
            }}>Cancel</Button>
            <Button
              onClick={handleCancelConfirm}
              color="error"
              disabled={!cancelReason}
            >
              Confirm Cancellation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Start Appointment Dialog */}
        <Dialog open={startDialogOpen} onClose={() => setStartDialogOpen(false)}>
          <DialogTitle>Start Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to start this appointment? This will enable chat functionality with the patient.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStartDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleStartAppointment(currentAppointmentId);
                setStartDialogOpen(false);
              }}
              color="primary"
              variant="contained"
            >
              Start Appointment
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reschedule Appointment Dialog */}
        <Dialog open={rescheduleDialogOpen} onClose={() => setRescheduleDialogOpen(false)}>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please select the new date and time for this appointment:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="New Date"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              value={newAppointmentDate}
              onChange={(e) => setNewAppointmentDate(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              label="New Time"
              type="time"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              value={newAppointmentTime}
              onChange={(e) => setNewAppointmentTime(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setRescheduleDialogOpen(false);
              setNewAppointmentDate('');
              setNewAppointmentTime('');
            }}>Cancel</Button>
            <Button
              onClick={handleRescheduleAppointment}
              color="primary"
              disabled={!newAppointmentDate || !newAppointmentTime}
            >
              Reschedule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Patient Notes Dialog */}
        <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Patient Notes</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Notes"
              type="text"
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSavePatientNotes}
              color="primary"
              disabled={!patientNotes}
            >
              Save Notes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prescription Dialog */}
        <Dialog open={prescriptionDialogOpen} onClose={() => setPrescriptionDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>Create Prescription</DialogTitle>
          <DialogContent>
            <TextField
              label="Diagnosis"
              fullWidth
              multiline
              rows={2}
              value={prescriptionData.diagnosis}
              onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Medications
            </Typography>
            
            {prescriptionData.medications.map((med, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Medicine Name"
                      fullWidth
                      value={med.medicineName}
                      onChange={(e) => handleMedicationChange(index, 'medicineName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Dosage"
                      fullWidth
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Frequency"
                      fullWidth
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Duration"
                      fullWidth
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleRemoveMedication(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            
            <Button 
              variant="outlined" 
              startIcon={<Add />}
              onClick={handleAddMedication}
              sx={{ mb: 3 }}
            >
              Add Medication
            </Button>
            
            <TextField
              label="Additional Notes"
              fullWidth
              multiline
              rows={3}
              value={prescriptionData.notes}
              onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Follow-up Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={prescriptionData.followUpDate}
              onChange={(e) => setPrescriptionData({...prescriptionData, followUpDate: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPrescriptionDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreatePrescription}
              color="primary"
              variant="contained"
            >
              Save Prescription
            </Button>
          </DialogActions>
        </Dialog>

        {/* Video Call Dialog */}
        <Dialog open={videoDialogOpen} onClose={() => setVideoDialogOpen(false)}>
          <DialogTitle>Start Video Consultation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you ready to start the video consultation with the patient?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVideoDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleStartVideoCall(currentAppointmentId);
                setVideoDialogOpen(false);
              }}
              color="primary"
              variant="contained"
            >
              Start Video Call
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};``