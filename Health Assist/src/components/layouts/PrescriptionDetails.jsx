// components/PrescriptionDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Avatar,
  Grid
} from '@mui/material';
import { MedicalServices, CalendarToday, Person } from '@mui/icons-material';
import { toast } from 'react-toastify';

export const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`/prescription/${id}`);
        setPrescription(response.data.data);
      } catch (error) {
        console.error('Error fetching prescription:', error);
        toast.error('Failed to load prescription');
        navigate('/prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!prescription) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Prescription not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} width={"100vw"}>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Prescriptions
      </Button>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Prescription Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} /> Patient Information
              </Typography>
              <Typography variant="body1">
                <strong>Prescription Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
              </Typography>
              {prescription.followUpDate && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Follow-up Date:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicalServices sx={{ mr: 1 }} /> Doctor Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={prescription.doctorId.profilePic} 
                  sx={{ width: 60, height: 60, mr: 2 }} 
                />
                <Box>
                  <Typography variant="body1">
                    Dr. {prescription.doctorId.Firstname} {prescription.doctorId.Lastname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prescription.doctorId.specialization}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {prescription.diagnosis}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Medications
              </Typography>
              <List>
                {prescription.medications.map((med, index) => (
                  <div key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`${med.medicineName} - ${med.dosage}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {med.frequency} for {med.duration}
                            </Typography>
                            <br />
                            {med.instructions && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                Instructions: {med.instructions}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < prescription.medications.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>

          {prescription.notes && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Notes
                </Typography>
                <Typography variant="body1">
                  {prescription.notes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrescriptionDetails;