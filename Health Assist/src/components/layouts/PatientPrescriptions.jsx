// components/PatientPrescriptions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { MedicalServices, CalendarToday } from '@mui/icons-material';
import { toast } from 'react-toastify';

export const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const patientId = localStorage.getItem('id');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`/prescription/patient/${patientId}`);
        setPrescriptions(response.data.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        toast.error('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const viewPrescriptionDetails = (id) => {
    navigate(`/prescription/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} width={"100vw"}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Prescriptions
      </Typography>

      {prescriptions.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No prescriptions found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Medications</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={prescription.doctorId.profilePic} 
                        sx={{ mr: 2 }} 
                      />
                      <Box>
                        <Typography>Dr. {prescription.doctorId.Firstname} {prescription.doctorId.Lastname}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {prescription.doctorId.specialization}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {prescription.diagnosis}
                  </TableCell>
                  <TableCell>
                    {prescription.medications.length} medications
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => viewPrescriptionDetails(prescription._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PatientPrescriptions;