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
    Tooltip,
    FormControl,
    InputLabel,
    Select
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
    AdminPanelSettings,
    Group,
    Event,
    MonetizationOn,
    Assignment,
    Lock,
    LockOpen,
    Search,
    Block,
    Delete,
    FilterList,
    Check,
    Warning
} from '@mui/icons-material';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const AdminHomePage = () => {
    const [adminData, setAdminData] = useState(null);
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        activeDoctors: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        revenue: 0,
        pendingDoctors: 0
    });
    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [userStatus, setUserStatus] = useState('all');
    const [doctorStatus, setDoctorStatus] = useState('all');
    const [appointmentStatus, setAppointmentStatus] = useState('all');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeChartTab, setActiveChartTab] = useState('weekly');
    const [activeRevenueTab, setActiveRevenueTab] = useState('monthly');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [doctorDialogOpen, setDoctorDialogOpen] = useState(false);
    const navigate = useNavigate();
    const adminId = localStorage.getItem("adminId");

    // Sample data for charts (to be replaced with real data from backend)
    const userGrowthData = {
        weekly: [
            { name: 'Mon', users: 5 },
            { name: 'Tue', users: 8 },
            { name: 'Wed', users: 6 },
            { name: 'Thu', users: 9 },
            { name: 'Fri', users: 7 },
            { name: 'Sat', users: 4 },
            { name: 'Sun', users: 2 },
        ],
        monthly: [
            { name: 'Week 1', users: 20 },
            { name: 'Week 2', users: 25 },
            { name: 'Week 3', users: 18 },
            { name: 'Week 4', users: 22 },
        ]
    };

    const revenueData = {
        monthly: [
            { name: 'Jan', revenue: 4000 },
            { name: 'Feb', revenue: 3000 },
            { name: 'Mar', revenue: 5000 },
            { name: 'Apr', revenue: 2780 },
            { name: 'May', revenue: 1890 },
            { name: 'Jun', revenue: 2390 },
        ],
        yearly: [
            { name: '2020', revenue: 24000 },
            { name: '2021', revenue: 30000 },
            { name: '2022', revenue: 50000 },
            { name: '2023', revenue: 47800 },
        ]
    };

    const specializationDistribution = [
        { name: 'Cardiology', doctors: 12 },
        { name: 'Neurology', doctors: 8 },
        { name: 'Pediatrics', doctors: 15 },
        { name: 'Orthopedics', doctors: 7 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const adminId = localStorage.getItem("id");

                if (!adminId) {
                    throw new Error('Admin ID not found');
                }

                // Fetch admin data
                const adminResponse = await axios.get(`/admin/${adminId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdminData(adminResponse.data);

                // Fetch all users
                const usersResponse = await axios.get('/alluser', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(usersResponse.data.data);

                // Fetch all doctors
                const doctorsResponse = await axios.get('/doctor', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(doctorsResponse.data.data);
                

                // Fetch all appointments
                const appointmentsResponse = await axios.get('/appointment/allappointment', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(appointmentsResponse.data.data);

                // Calculate stats
                const totalUsers = usersResponse.data.data.length;
                const totalDoctors = doctorsResponse.data.data.length;
                const totalAppointments = appointmentsResponse.data.data.length;
                const activeDoctors = doctorsResponse.data.data.filter(d => d.Status).length;
                const pendingDoctors = doctorsResponse.data.data.filter(d => !d.Status).length;
                const pendingAppointments = appointmentsResponse.data.data.filter(a => a.status === 'Pending').length;
                const completedAppointments = appointmentsResponse.data.data.filter(a => a.status === 'Completed').length;

                // Calculate revenue (assuming $50 per completed appointment for demo)
                const revenue = completedAppointments * 50;

                setStats({
                    totalUsers,
                    totalDoctors,
                    totalAppointments,
                    activeDoctors,
                    pendingDoctors,
                    pendingAppointments,
                    completedAppointments,
                    revenue
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                toast.error('Failed to load admin data. Please login again.');
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/user/${userToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('User deleted successfully');

            // Update local state
            setUsers(users.filter(user => user._id !== userToDelete));
            setStats(prev => ({
                ...prev,
                totalUsers: prev.totalUsers - 1
            }));

            // Close dialog and reset state
            setDeleteDialogOpen(false);
            setUserToDelete(null);

        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleDeleteDoctor = async () => {
        if (!doctorToDelete) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/doctor/${doctorToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Doctor deleted successfully');

            // Update local state
            setDoctors(doctors.filter(doctor => doctor._id !== doctorToDelete));
            setStats(prev => ({
                ...prev,
                totalDoctors: prev.totalDoctors - 1,
                activeDoctors: prev.activeDoctors - (doctors.find(d => d._id === doctorToDelete)?.Status ? 1 : 0)
            }));

            // Close dialog and reset state
            setDeleteDialogOpen(false);
            setDoctorToDelete(null);

        } catch (error) {
            console.error('Error deleting doctor:', error);
            toast.error(error.response?.data?.message || 'Failed to delete doctor');
        }
    };

    const handleToggleUserStatus = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const user = users.find(u => u._id === userId);
            const newStatus = !user.Status;

            await axios.put(`/updateduser/${userId}`, {
                Status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`User ${newStatus ? 'activated' : 'blocked'} successfully`);
            
            // Update local state
            const updatedUsers = users.map(u =>
                u._id === userId ? { ...u, Status: newStatus } : u
            );
            setUsers(updatedUsers);

        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleToggleDoctorStatus = async (doctorId, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const endpoint = status ? `/approve-doctor/${doctorId}` : `/reject-doctor/${doctorId}`;
            
            const response = await axios.put(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            toast.success(`Doctor ${status ? 'approved' : 'rejected'} successfully`);
    
            // Update local state
            const updatedDoctors = doctors.map(d =>
                d._id === doctorId ? { ...d, Status: status, verificationStatus: status ? 'verified' : 'rejected' } : d
            );
            setDoctors(updatedDoctors);
    
            // Update stats
            setStats(prev => ({
                ...prev,
                activeDoctors: status ? prev.activeDoctors + 1 : prev.activeDoctors - 1,
                pendingDoctors: status ? prev.pendingDoctors - 1 : prev.pendingDoctors + 1
            }));
    
        } catch (error) {
            console.error('Error toggling doctor status:', error);
            toast.error(error.response?.data?.message || 'Failed to update doctor status');
        }
    };

    
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`/admin/${adminId}`, {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Password changed successfully');
            setChangePasswordDialog(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        navigate('/adminlogin');
    };

    const handleViewUserDetails = (user) => {
        setSelectedUser(user);
        setUserDialogOpen(true);
    };

    const handleViewDoctorDetails = (doctor) => {
        setSelectedDoctor(doctor);
        setDoctorDialogOpen(true);
    };

    const handleAppointmentStatusChange = async (appointmentId, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`/appointment/appointment/update-status/${appointmentId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            const updatedAppointments = appointments.map(appointment => 
                appointment._id === appointmentId ? { ...appointment, status } : appointment
            );
            setAppointments(updatedAppointments);

            toast.success(`Appointment status updated to ${status}`);
        } catch (error) {
            console.error('Error updating appointment status:', error);
            toast.error('Failed to update appointment status');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!adminData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6">Failed to load admin data</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            {/* Sidebar */}
            <Box sx={{ width: 250, bgcolor: '#1e3a8a', color: 'white', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2 }}>
                    <Avatar
                        sx={{ width: 60, height: 60, mr: 2, bgcolor: '#3b82f6' }}
                    >
                        <AdminPanelSettings fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {adminData.Firstname} {adminData.Lastname}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#93c5fd' }}>
                            Administrator
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
                            <BarChart sx={{ color: 'white' }} />
                        </ListItemAvatar>
                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    <ListItem
                        button
                        selected={selectedTab === 'users'}
                        onClick={() => setSelectedTab('users')}
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
                        <ListItemText primary="Users" />
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
                        <ListItemText primary="Doctors" />
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
                        {selectedTab === 'dashboard' && 'Admin Dashboard'}
                        {selectedTab === 'users' && 'User Management'}
                        {selectedTab === 'doctors' && 'Doctor Management'}
                        {selectedTab === 'appointments' && 'Appointments'}
                        {selectedTab === 'settings' && 'Settings'}
                    </Typography>
                </Box>

                {selectedTab === 'dashboard' && (
                    <>
                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: '#e0f2fe', borderRadius: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h6" color="text.secondary">
                                                    Total Users
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {stats.totalUsers}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ bgcolor: '#bae6fd', p: 2, borderRadius: '50%' }}>
                                                <Group sx={{ color: '#0369a1', fontSize: 30 }} />
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
                                                    Total Doctors
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {stats.totalDoctors}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ bgcolor: '#bbf7d0', p: 2, borderRadius: '50%' }}>
                                                <MedicalServices sx={{ color: '#15803d', fontSize: 30 }} />
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
                                                    Active Doctors
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {stats.activeDoctors}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ bgcolor: '#fde68a', p: 2, borderRadius: '50%' }}>
                                                <CheckCircle sx={{ color: '#b45309', fontSize: 30 }} />
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
                                                    Pending Doctors
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {stats.pendingDoctors}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ bgcolor: '#fecaca', p: 2, borderRadius: '50%' }}>
                                                <Pending sx={{ color: '#b91c1c', fontSize: 30 }} />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Charts */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2, p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            User Growth
                                        </Typography>
                                        <Tabs value={activeChartTab} onChange={(e, newValue) => setActiveChartTab(newValue)}>
                                            <Tab label="Weekly" value="weekly" />
                                            <Tab label="Monthly" value="monthly" />
                                        </Tabs>
                                    </Box>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={userGrowthData[activeChartTab]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2, p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Revenue Overview
                                        </Typography>
                                        <Tabs value={activeRevenueTab} onChange={(e, newValue) => setActiveRevenueTab(newValue)}>
                                            <Tab label="Monthly" value="monthly" />
                                            <Tab label="Yearly" value="yearly" />
                                        </Tabs>
                                    </Box>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={revenueData[activeRevenueTab]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar dataKey="revenue" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2, p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Specialization Distribution
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={specializationDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="doctors"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {specializationDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            Recent Appointments
                                        </Typography>

                                        {appointments.length === 0 ? (
                                            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                                                No appointments found
                                            </Typography>
                                        ) : (
                                            <List>
                                                {appointments.slice(0, 5).map((appointment, index) => (
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
                                                                    </Typography>
                                                                </>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                {selectedTab === 'users' && (
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                                    User Management
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Search users..."
                                        variant="outlined"
                                        sx={{ width: 300 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Filter by Status</InputLabel>
                                        <Select
                                            value={userStatus}
                                            onChange={(e) => setUserStatus(e.target.value)}
                                            label="Filter by Status"
                                        >
                                            <MenuItem value="all">All Users</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            {users.filter(user => 
                                userStatus === 'all' || 
                                (userStatus === 'active' && user.Status) || 
                                (userStatus === 'inactive' && !user.Status)
                            ).length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No users found
                                    </Typography>
                                    <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
                                        Refresh Data
                                    </Button>
                                </Box>
                            ) : (
                                <Paper elevation={0} sx={{ borderRadius: 2 }}>
                                    <List disablePadding>
                                        {users
                                            .filter(user => 
                                                userStatus === 'all' || 
                                                (userStatus === 'active' && user.Status) || 
                                                (userStatus === 'inactive' && !user.Status)
                                            )
                                            .map((user) => (
                                                <React.Fragment key={user._id}>
                                                    <ListItem 
                                                        sx={{
                                                            py: 2,
                                                            px: 3,
                                                            '&:hover': { backgroundColor: 'action.hover' },
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        secondaryAction={
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="View details">
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => handleViewUserDetails(user)}
                                                                        size="small"
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip title={user.Status ? 'Block user' : 'Activate user'}>
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => handleToggleUserStatus(user._id)}
                                                                        color={user.Status ? 'error' : 'success'}
                                                                        startIcon={user.Status ? <Block /> : <CheckCircle />}
                                                                        size="small"
                                                                    >
                                                                        {user.Status ? 'Block' : 'Activate'}
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip title="Delete user">
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        startIcon={<Delete />}
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setUserToDelete(user._id);
                                                                            setDeleteDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Tooltip>
                                                            </Box>
                                                        }
                                                    >
                                                        <ListItemAvatar>
                                                            <Badge
                                                                overlap="circular"
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                badgeContent={
                                                                    <Box sx={{ 
                                                                        bgcolor: user.Status ? 'success.main' : 'error.main',
                                                                        width: 12,
                                                                        height: 12,
                                                                        borderRadius: '50%',
                                                                        border: '2px solid white'
                                                                    }} />
                                                                }
                                                            >
                                                                <Avatar alt={user.Firstname} src={user.userPic} sx={{ width: 56, height: 56 }} />
                                                            </Badge>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {user.Firstname} {user.Lastname}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <>
                                                                    <Typography variant="body2" color="text.primary">
                                                                        {user.email}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                        <Chip 
                                                                            label={user.Status ? 'Active' : 'Blocked'} 
                                                                            size="small"
                                                                            color={user.Status ? 'success' : 'error'}
                                                                            variant="outlined"
                                                                            sx={{ mr: 1 }}
                                                                        />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {user.PhoneNumber}
                                                                        </Typography>
                                                                    </Box>
                                                                </>
                                                            }
                                                            sx={{ ml: 2 }}
                                                        />
                                                    </ListItem>
                                                    <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                                                </React.Fragment>
                                            ))}
                                    </List>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                )}

                {selectedTab === 'doctors' && (
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                                    Doctor Management
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Search doctors..."
                                        variant="outlined"
                                        sx={{ width: 300 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Filter by Status</InputLabel>
                                        <Select
                                            value={doctorStatus}
                                            onChange={(e) => setDoctorStatus(e.target.value)}
                                            label="Filter by Status"
                                        >
                                            <MenuItem value="all">All Doctors</MenuItem>
                                            <MenuItem value="active">Approved</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            {doctors.filter(doctor => 
                                doctorStatus === 'all' || 
                                (doctorStatus === 'active' && doctor.Status) || 
                                (doctorStatus === 'pending' && !doctor.Status)
                            ).length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No doctors found
                                    </Typography>
                                    <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
                                        Refresh Data
                                    </Button>
                                </Box>
                            ) : (
                                <Paper elevation={0} sx={{ borderRadius: 2 }}>
                                    <List disablePadding>
                                       {/* In the doctor management section */}
{doctors
    .filter(doctor => 
        doctorStatus === 'all' || 
        (doctorStatus === 'active' && doctor.verificationStatus === 'verified') || 
        (doctorStatus === 'pending' && doctor.verificationStatus !== 'verified')
    )
    .map((doctor) => (
        <React.Fragment key={doctor._id}>
            <ListItem 
                sx={{
                    py: 2,
                    px: 3,
                    '&:hover': { backgroundColor: 'action.hover' },
                    transition: 'background-color 0.2s'
                }}
                secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View details">
                            <Button
                                variant="outlined"
                                onClick={() => handleViewDoctorDetails(doctor)}
                                size="small"
                            >
                                View
                            </Button>
                        </Tooltip>
                        {doctor.verificationStatus !== 'verified' && (
                            <Tooltip title="Approve doctor">
                                <Button
                                    variant="outlined"
                                    onClick={() => handleToggleDoctorStatus(doctor._id, true)}
                                    color="success"
                                    startIcon={<Check />}
                                    size="small"
                                >
                                    Approve
                                </Button>
                            </Tooltip>
                        )}
                        {doctor.verificationStatus === 'verified' && (
                            <Tooltip title="Reject doctor">
                                <Button
                                    variant="outlined"
                                    onClick={() => handleToggleDoctorStatus(doctor._id, false)}
                                    color="error"
                                    startIcon={<Block />}
                                    size="small"
                                >
                                    Reject
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip title="Delete doctor">
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                size="small"
                                onClick={() => {
                                    setDoctorToDelete(doctor._id);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                Delete
                            </Button>
                        </Tooltip>
                    </Box>
                }
            >
                <ListItemAvatar>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <Box sx={{ 
                                bgcolor: doctor.verificationStatus === 'verified' ? 'success.main' : 
                                         doctor.verificationStatus === 'rejected' ? 'error.main' : 'warning.main',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                border: '2px solid white'
                            }} />
                        }
                    >
                        <Avatar alt={doctor.Firstname} src={doctor.profilePic} sx={{ width: 56, height: 56 }} />
                    </Badge>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                            Dr. {doctor.Firstname} {doctor.Lastname}
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography variant="body2" color="text.primary">
                                {doctor.specialization}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                    label={
                                        doctor.verificationStatus === 'verified' ? 'Approved' : 
                                        doctor.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'
                                    } 
                                    size="small"
                                    color={
                                        doctor.verificationStatus === 'verified' ? 'success' : 
                                        doctor.verificationStatus === 'rejected' ? 'error' : 'warning'
                                    }
                                    variant="outlined"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {doctor.email} • {doctor.phoneNumber}
                                </Typography>
                            </Box>
                        </>
                    }
                    sx={{ ml: 2 }}
                />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ ml: 9 }} />
        </React.Fragment>
    ))}
                                    </List>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                )}

                {selectedTab === 'appointments' && (
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Appointment Management
                                </Typography>

                                <Box>
                                    <Button
                                        variant={appointmentStatus === 'all' ? 'contained' : 'outlined'}
                                        onClick={() => setAppointmentStatus('all')}
                                        sx={{ mr: 1 }}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={appointmentStatus === 'pending' ? 'contained' : 'outlined'}
                                        onClick={() => setAppointmentStatus('pending')}
                                        sx={{ mr: 1 }}
                                    >
                                        Pending
                                    </Button>
                                    <Button
                                        variant={appointmentStatus === 'confirmed' ? 'contained' : 'outlined'}
                                        onClick={() => setAppointmentStatus('confirmed')}
                                        sx={{ mr: 1 }}
                                    >
                                        Confirmed
                                    </Button>
                                    <Button
                                        variant={appointmentStatus === 'completed' ? 'contained' : 'outlined'}
                                        onClick={() => setAppointmentStatus('completed')}
                                    >
                                        Completed
                                    </Button>
                                </Box>
                            </Box>

                            {appointments.filter(a =>
                                appointmentStatus === 'all' ||
                                (appointmentStatus === 'pending' && a.status === 'Pending') ||
                                (appointmentStatus === 'confirmed' && a.status === 'Confirmed') ||
                                (appointmentStatus === 'completed' && a.status === 'Completed')
                            ).length === 0 ? (
                                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                                    No appointments found
                                </Typography>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Patient</TableCell>
                                                <TableCell>Doctor</TableCell>
                                                <TableCell>Date & Time</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {appointments
                                                .filter(a =>
                                                    appointmentStatus === 'all' ||
                                                    (appointmentStatus === 'pending' && a.status === 'Pending') ||
                                                    (appointmentStatus === 'confirmed' && a.status === 'Confirmed') ||
                                                    (appointmentStatus === 'completed' && a.status === 'Completed')
                                                )
                                                .map((appointment) => (
                                                    <TableRow key={appointment._id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar src={appointment.userId?.userPic} sx={{ mr: 2 }} />
                                                                {appointment.firstName} {appointment.lastName}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar src={appointment.doctorId?.profilePic} sx={{ mr: 2 }} />
                                                                Dr. {appointment.doctorId?.Firstname} {appointment.doctorId?.Lastname}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={appointment.status}
                                                                color={
                                                                    appointment.status === 'Pending' ? 'warning' :
                                                                        appointment.status === 'Confirmed' ? 'primary' :
                                                                            appointment.status === 'Completed' ? 'success' : 'default'
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                                                <Select
                                                                    value={appointment.status}
                                                                    onChange={(e) => handleAppointmentStatusChange(appointment._id, e.target.value)}
                                                                >
                                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
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
                                        Admin Information
                                    </Typography>

                                    <TextField
                                        label="First Name"
                                        value={adminData.Firstname}
                                        fullWidth
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Last Name"
                                        value={adminData.Lastname}
                                        fullWidth
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Email"
                                        value={adminData.email}
                                        fullWidth
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Change Password
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={() => setChangePasswordDialog(true)}
                                    >
                                        Change Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* User Details Dialog */}
                <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogContent>
                        {selectedUser && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Avatar src={selectedUser.userPic} sx={{ width: 120, height: 120, mb: 2 }} />
                                        <Typography variant="h6">
                                            {selectedUser.Firstname} {selectedUser.Lastname}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            User ID: {selectedUser._id}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Personal Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="First Name"
                                                value={selectedUser.Firstname}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Last Name"
                                                value={selectedUser.Lastname}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email"
                                                value={selectedUser.email}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Phone"
                                                value={selectedUser.PhoneNumber}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Age"
                                                value={selectedUser.Age || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Gender"
                                                value={selectedUser.gender || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Doctor Details Dialog */}
                <Dialog open={doctorDialogOpen} onClose={() => setDoctorDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Doctor Details</DialogTitle>
                    <DialogContent>
                        {selectedDoctor && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Avatar src={selectedDoctor.profilePic} sx={{ width: 120, height: 120, mb: 2 }} />
                                        <Typography variant="h6">
                                            Dr. {selectedDoctor.Firstname} {selectedDoctor.Lastname}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedDoctor.specialization}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Professional Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="First Name"
                                                value={selectedDoctor.Firstname}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Last Name"
                                                value={selectedDoctor.Lastname}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email"
                                                value={selectedDoctor.email}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Phone"
                                                value={selectedDoctor.phoneNumber || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Specialization"
                                                value={selectedDoctor.specialization || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Qualification"
                                                value={selectedDoctor.qualification || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Experience"
                                                value={selectedDoctor.experience || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Availability"
                                                value={selectedDoctor.availability || ''}
                                                fullWidth
                                                disabled
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="About"
                                                value={selectedDoctor.about || ''}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDoctorDialogOpen(false)}>Close</Button>
                        {selectedDoctor && !selectedDoctor.Status && (
                            <Button 
                                variant="contained" 
                                color="success"
                                onClick={() => {
                                    handleToggleDoctorStatus(selectedDoctor._id, true);
                                    setDoctorDialogOpen(false);
                                }}
                            >
                                Approve Doctor
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {userToDelete
                                ? 'Are you sure you want to delete this user? This action cannot be undone.'
                                : 'Are you sure you want to delete this doctor? This action cannot be undone.'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={userToDelete ? handleDeleteUser : handleDeleteDoctor}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Change Password Dialog */}
                <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Current Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleChangePassword}
                            color="primary"
                            variant="contained"
                            disabled={!currentPassword || !newPassword || !confirmPassword}
                        >
                            Change Password
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};