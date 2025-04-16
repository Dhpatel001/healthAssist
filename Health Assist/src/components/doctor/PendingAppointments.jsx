import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";

export const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const doctorId = localStorage.getItem("id");

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`/appointment/appointments/doctor/${doctorId}`);
      setAppointments(res.data.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.patch(`/appointment/confirm/${id}`, { status: "Confirmed" });
      fetchAppointments();
    } catch (err) {
      console.error("Error confirming appointment:", err);
    }
  };

  const handleCancel = async () => {
    try {
      await axios.patch(`/appointment/cancel/${selectedAppointmentId}`, {
        status: "Cancelled",
        cancelReason: cancelReason,
      });
      fetchAppointments();
      setCancelDialogOpen(false);
      setCancelReason("");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  const openCancelDialog = (id) => {
    setSelectedAppointmentId(id);
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelReason("");
  };

  const columns = [
    { field: "firstName", headerName: "Patient Name", width: 150 },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { field: "dob", headerName: "Date of Birth", width: 150 },
    { field: "appointmentDate", headerName: "Appointment Date", width: 150 },
    { field: "appointmentTime", headerName: "Time", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleConfirm(params.row.id)}
            disabled={params.row.status !== "Pending"}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => openCancelDialog(params.row.id)}
            disabled={params.row.status !== "Pending"}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </Button>
        </>
      ),
    },
  ];

  const rows = appointments.map((appointment) => ({
    id: appointment._id,
    firstName: appointment.firstName || "N/A",
    phoneNumber: appointment.phoneNumber || "N/A",
    dob: new Date(appointment.dob).toLocaleDateString(),
    appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
    appointmentTime: appointment.appointmentTime || "N/A",
    status: appointment.status,
  }));

  return (
    <div style={{ height: 600, width: "100%" }}>
      <h2>Appointments</h2>
      <DataGrid rows={rows} columns={columns} pageSize={10} />

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={closeCancelDialog}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Cancellation"
            fullWidth
            multiline
            rows={4}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} color="primary">
            Close
          </Button>
          <Button onClick={handleCancel} color="error">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
