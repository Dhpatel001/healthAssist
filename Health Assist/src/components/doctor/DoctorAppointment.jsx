import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Avatar,
  Stack,
  Tooltip,
  IconButton,
  Badge,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  CheckCircle as ConfirmIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  AccessTime as PendingIcon,
  EventAvailable as ConfirmedIcon,
  EventBusy as CancelledIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  NoteAdd as NotesIcon,
  Today as TodayIcon,
  Schedule as TimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");
  const [cancelReason, setCancelReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [newAppointment, setNewAppointment] = useState({
    userId: "",
    appointmentDate: dayjs(),
    appointmentTime: dayjs().add(1, 'hour'),
    notes: "",
    status: "Pending"
  });
  const [patients, setPatients] = useState([]);

  const doctorId = localStorage.getItem("id");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
      fetchPatients();
    }
  }, [doctorId]);

  useEffect(() => {
    filterAppointments();
    calculateStats();
  }, [appointments, tabValue, searchTerm]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/appointment/appointments/doctor/${doctorId}`);
      setAppointments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/alluser");
      setPatients(response.data.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by tab
    if (tabValue === 0) filtered = filtered.filter(a => a.status === "Pending");
    if (tabValue === 1) filtered = filtered.filter(a => a.status === "Confirmed");
    if (tabValue === 2) filtered = filtered.filter(a => a.status === "Cancelled");

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        `${appointment.userId?.Firstname} ${appointment.userId?.Lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.userId?.phoneNumber?.toString().includes(searchTerm) ||
        dayjs(appointment.appointmentDate).format('MMM D, YYYY').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const calculateStats = () => {
    const stats = {
      pending: appointments.filter(a => a.status === "Pending").length,
      confirmed: appointments.filter(a => a.status === "Confirmed").length,
      cancelled: appointments.filter(a => a.status === "Cancelled").length
    };
    setStats(stats);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setStatus(appointment.status);
    setNotes(appointment.notes || "");
    setCancelReason(appointment.cancelReason || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setNotes("");
    setCancelReason("");
  };

  const handleOpenNewAppointmentDialog = () => {
    setOpenNewAppointmentDialog(true);
  };

  const handleCloseNewAppointmentDialog = () => {
    setOpenNewAppointmentDialog(false);
    setNewAppointment({
      userId: "",
      appointmentDate: dayjs(),
      appointmentTime: dayjs().add(1, 'hour'),
      notes: "",
      status: "Pending"
    });
  };

  const handleStatusUpdate = async () => {
    try {
      if (!selectedAppointment) return;

      const updateData = {
        status,
        notes,
        ...(status === "Cancelled" && { cancelReason })
      };

      await axios.put(`/appointment/appointment/update-status/${selectedAppointment._id}`, updateData);
      toast.success("Appointment updated successfully");
      fetchAppointments();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const handleCreateAppointment = async () => {
    try {
      const appointmentData = {
        ...newAppointment,
        doctorId,
        appointmentDate: newAppointment.appointmentDate.toISOString(),
        appointmentTime: newAppointment.appointmentTime.toISOString()
      };

      await axios.post("/appointment/appointment", appointmentData);
      toast.success("Appointment created successfully");
      fetchAppointments();
      handleCloseNewAppointmentDialog();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
    }
  };

  const handleQuickConfirm = async (id) => {
    try {
      await axios.patch(`/appointment/confirm/${id}`);
      toast.success("Appointment confirmed");
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Failed to confirm appointment");
    }
  };

  const handleQuickCancel = async (id) => {
    setSelectedAppointment(appointments.find(a => a._id === id));
    setOpenDialog(true);
    setStatus("Cancelled");
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setNewAppointment({
      userId: appointment.userId._id,
      appointmentDate: dayjs(appointment.appointmentDate),
      appointmentTime: dayjs(appointment.appointmentTime),
      notes: appointment.notes,
      status: "Pending"
    });
    setOpenNewAppointmentDialog(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <PendingIcon color="warning" />;
      case "Confirmed": return <ConfirmedIcon color="success" />;
      case "Cancelled": return <CancelledIcon color="error" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "success";
      case "Cancelled": return "error";
      default: return "warning";
    }
  };

  const formatDateTime = (dateString, timeString) => {
    const date = dayjs(dateString);
    const time = dayjs(timeString);
    return `${date.format('MMM D, YYYY')} at ${time.format('h:mm A')}`;
  };

  const renderMobileView = () => (
    <Box>
      {filteredAppointments.map((appointment) => (
        <Card key={appointment._id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={
              <Avatar
                src={appointment.userId?.userPic}
                alt={`${appointment.userId?.Firstname} ${appointment.userId?.Lastname}`}
              />
            }
            title={`${appointment.userId?.Firstname} ${appointment.userId?.Lastname}`}
            subheader={
              <Box>
                <Typography variant="body2">
                  {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                </Typography>
                <Chip
                  label={appointment.status}
                  color={getStatusColor(appointment.status)}
                  icon={getStatusIcon(appointment.status)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            }
          />
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Edit appointment">
                <IconButton onClick={() => handleOpenDialog(appointment)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {appointment.status === "Pending" && (
                <>
                  <Tooltip title="Confirm appointment">
                    <IconButton
                      color="success"
                      onClick={() => handleQuickConfirm(appointment._id)}
                    >
                      <ConfirmIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel appointment">
                    <IconButton
                      color="error"
                      onClick={() => handleQuickCancel(appointment._id)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={{ color: 'white' }}>Patient</TableCell>
            <TableCell sx={{ color: 'white' }}>Date & Time</TableCell>
            <TableCell sx={{ color: 'white' }}>Status</TableCell>
            <TableCell sx={{ color: 'white' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAppointments.map((appointment) => (
            <TableRow
              key={appointment._id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={appointment.userId?.userPic}
                    alt={`${appointment.userId?.Firstname} ${appointment.userId?.Lastname}`}
                  />
                  <Box>
                    <Typography fontWeight="medium">
                      {appointment.userId?.Firstname} {appointment.userId?.Lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.userId?.phoneNumber}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography>
                  {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={appointment.status}
                  color={getStatusColor(appointment.status)}
                  icon={getStatusIcon(appointment.status)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit appointment">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(appointment)}
                    >
                      Details
                    </Button>
                  </Tooltip>
                  {appointment.status === "Pending" && (
                    <>
                      <Tooltip title="Confirm appointment">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<ConfirmIcon />}
                          onClick={() => handleQuickConfirm(appointment._id)}
                        >
                          Confirm
                        </Button>
                      </Tooltip>
                      <Tooltip title="Cancel appointment">
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleQuickCancel(appointment._id)}
                        >
                          Cancel
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  {appointment.status === "Confirmed" && (
                    <Tooltip title="Reschedule appointment">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<CalendarIcon />}
                        onClick={() => handleReschedule(appointment)}
                      >
                        Reschedule
                      </Button>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            Appointment Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and manage your appointments
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNewAppointmentDialog}
            >
              New Appointment
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAppointments}
            >
              Refresh
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">Pending</Typography>
                <Badge badgeContent={stats.pending} color="warning" sx={{ mr: 1 }}>
                  <PendingIcon color="action" />
                </Badge>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(stats.pending / appointments.length) * 100 || 0}
                color="warning"
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">Confirmed</Typography>
                <Badge badgeContent={stats.confirmed} color="success" sx={{ mr: 1 }}>
                  <ConfirmedIcon color="action" />
                </Badge>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(stats.confirmed / appointments.length) * 100 || 0}
                color="success"
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">Cancelled</Typography>
                <Badge badgeContent={stats.cancelled} color="error" sx={{ mr: 1 }}>
                  <CancelledIcon color="action" />
                </Badge>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(stats.cancelled / appointments.length) * 100 || 0}
                color="error"
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search patients..."
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Paper sx={{ p: 1, display: 'inline-block' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Pending" icon={<PendingIcon />} iconPosition="start" />
                <Tab label="Confirmed" icon={<ConfirmedIcon />} iconPosition="start" />
                <Tab label="Cancelled" icon={<CancelledIcon />} iconPosition="start" />
                <Tab label="All" />
              </Tabs>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No appointments found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewAppointmentDialog}
            sx={{ mt: 2 }}
          >
            Create New Appointment
          </Button>
        </Paper>
      ) : isMobile ? (
        renderMobileView()
      ) : (
        renderDesktopView()
      )}

      {/* Appointment Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment?.status === "Cancelled" ? "Cancellation Details" : "Appointment Details"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedAppointment && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedAppointment.userId?.Firstname} {selectedAppointment.userId?.Lastname}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedAppointment.userId?.phoneNumber || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {dayjs(selectedAppointment.appointmentDate).format('MMMM D, YYYY')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                <Typography variant="body1" gutterBottom>
                  {dayjs(selectedAppointment.appointmentTime).format('h:mm A')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              {status === "Cancelled" && (
                <Grid item xs={12}>
                  <TextField
                    label="Reason for Cancellation"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>  
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>    
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
            disabled={status === "Cancelled" && !cancelReason}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={openNewAppointmentDialog} onClose={handleCloseNewAppointmentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                label="Patient"
                value={newAppointment.userId}
                onChange={(e) => setNewAppointment({ ...newAppointment, userId: e.target.value })}
                fullWidth
                variant="outlined"
                required
              >
                {patients.map((patient) => (
                  <MenuItem key={patient._id} value={patient._id}>
                    {patient.Firstname} {patient.Lastname} ({patient.phoneNumber})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Appointment Date"
                value={newAppointment.appointmentDate}
                onChange={(date) => setNewAppointment({ ...newAppointment, appointmentDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={dayjs()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Appointment Time"
                value={newAppointment.appointmentTime}
                onChange={(time) => setNewAppointment({ ...newAppointment, appointmentTime: time })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minutesStep={15}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAppointmentDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleCreateAppointment}
            variant="contained"
            color="primary"
            disabled={!newAppointment.userId}
          >
            Create Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};